// Ruta: backend/controllers/taskController.js
const Task = require('../models/Task');// Modelo de Tarea
const Category = require('../models/Category'); // Necesario para verificar si existe la categoría
const moment = require('moment'); // Para manejo de fechas si es necesario

// @desc    Obtener todas las tareas (incluyendo el filtro por categoría)
// @route   GET /api/tasks
// @access  Public
// @desc    Obtener todas las tareas (incluyendo filtros por categoría, estado y fecha)
// @route   GET /api/tasks?category=ID&completed=true&dateRange=today
// @access  Public
const getTasks = async (req, res) => {
    // Definimos el objeto de filtros inicial
    let filter = {};

    // 1. Filtrar por Categoría (ID)
    if (req.query.category) {
        // Maneja la categoría nula (sin asignar)
        if (req.query.category.toLowerCase() === 'null') {
            filter.category = null;
        } else {
            // Verifica y aplica filtro por ID válido
            if (!mongoose.Types.ObjectId.isValid(req.query.category)) {
                return res.status(400).json({ message: 'ID de categoría no válido.' });
            }
            filter.category = req.query.category;
        }
    }

    // 2. Filtrar por Estado (completed)
    if (req.query.completed !== undefined) {
        if (req.query.completed === 'true' || req.query.completed === '1') {
            filter.completed = true;
        } else if (req.query.completed === 'false' || req.query.completed === '0') {
            filter.completed = false;
        } 
    }

    // 3. Filtrar por Rango de Fecha de Vencimiento (dueDate)
    if (req.query.dateRange) {
        const today = moment().startOf('day');
        let startDate = today.toDate(); 
        let endDate = null;

        switch (req.query.dateRange.toLowerCase()) {
            case 'today':
                // Tareas con fecha de hoy (vencen hoy o en algún momento de hoy)
                endDate = moment().endOf('day').toDate();
                break;
            case 'week':
            case '7days':
                // Tareas con fecha de hoy hasta dentro de 7 días (incluyendo el final del día 7)
                endDate = moment().add(7, 'days').endOf('day').toDate();
                break;
            case '15days':
                // Tareas con fecha de hoy hasta dentro de 15 días
                endDate = moment().add(15, 'days').endOf('day').toDate();
                break;
            case 'month':
            case '30days':
                // Tareas con fecha de hoy hasta dentro de 30 días
                endDate = moment().add(30, 'days').endOf('day').toDate();
                break;
            case 'overdue':
                // Tareas que debieron completarse antes de hoy (antes de hoy 00:00:00)
                filter.dueDate = { $lt: today.toDate() };
                startDate = null; // No aplica rango GTE
                break;
            default:
                // Ignorar si el valor es inválido
                startDate = null;
                break;
        }

        if (startDate && endDate) {
            // Aplicar filtro para tareas con DueDate entre [hoy al inicio] y [fecha final al final del día]
            filter.dueDate = { $gte: startDate, $lte: endDate };
        }
    }

    try {
        const tasks = await Task.find(filter) 
            .populate('category', 'name color')
            .sort({ createdAt: -1 });
            
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Crear una nueva tarea
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
    // CORRECCIÓN: Desestructurar todos los campos, incluyendo priority y reminder
    const { title, description, category, dueDate, priority, reminder } = req.body; 

    // Validación básica
    // NOTA: Quité la validación de categoría, ya que es opcional en el modelo.
    if (!title) {
        return res.status(400).json({ message: 'El título de la tarea es obligatorio.' });
    }

    try {
        // 1. Verificar si la Category existe (solo si se proporciona)
        if (category) {
             const categoryExists = await Category.findById(category);

            if (!categoryExists) {
                return res.status(404).json({ message: 'La categoría especificada no existe.' });
            }
        }
        
        // Convertir reminder y dueDate a objetos Date si se proporcionan
        // Si no se proporcionan, se mantienen como null
        const reminderDate = reminder ? new Date(reminder) : null;
        const due = dueDate ? new Date(dueDate) : null;

        // 2. Crear la tarea (pasando los nuevos campos)
        const task = await Task.create({
            title,
            description,
            category,
            dueDate: due,
            priority, // Pasa el valor de prioridad
            reminder: reminderDate, // Pasa el objeto Date del reminder
        });

        // 3. Devolver la tarea completa, incluyendo el objeto de categoría poblado
        const createdTask = await Task.findById(task._id).populate('category', 'name color');

        res.status(201).json(createdTask);

    } catch (error) {
        // Este catch manejará errores de validación de enum (si priority no es 'Alta', 'Media', 'Baja')
        res.status(400).json({ message: error.message });
    }
};

// @desc    Actualizar el estado de una tarea (e.g., completada)
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
    // Extraer los campos que se pueden actualizar
    const { title, description, category, dueDate, completed, priority, reminder } = req.body;

    try {
        // Buscar la tarea por ID
        const task = await Task.findById(req.params.id);

        // Verificar si la tarea existe
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        
        // LÓGICA DE CATEGORÍA: Permite asignar a null o cambiar a otra existente
        if (category !== undefined) {
            // 1. Si la categoría es nula o vacía (para desvincular)
            if (category === null || category === '') {
                // Si el valor es explícitamente null, permitimos la desvinculación
                task.category = null;
            } 
            // 2. Si es una categoría nueva diferente a la actual, verificamos que exista
            else if (category.toString() !== (task.category ? task.category.toString() : null)) {
                const categoryExists = await Category.findById(category);
                if (!categoryExists) {
                    return res.status(404).json({ message: 'La nueva categoría especificada no existe.' });
                }
                task.category = category;
            }
        }

        // 3. ACTUALIZAR CAMPOS (EXISTENTES y NUEVOS)
        
        // Actualizar campos existentes
        task.title = title !== undefined ? title : task.title;
        task.description = description !== undefined ? description : task.description;
        // CORRECCIÓN: Forzar conversión a Date si viene como cadena
        if (dueDate !== undefined) {
            task.dueDate = dueDate ? new Date(dueDate) : null;
        }
        
        // Manejar 'completed'
        if (completed !== undefined) {
            task.completed = completed;
        }

        // ACTUALIZAR NUEVOS CAMPOS (priority y reminder)
        if (priority !== undefined) {
            task.priority = priority;
        }
        if (reminder !== undefined) {
            task.reminder = reminder ? new Date(reminder) : null;
        }

        const updatedTask = await task.save();

        // Devolver la tarea actualizada con la categoría poblada
        const finalTask = await Task.findById(updatedTask._id).populate('category', 'name color');

        res.status(200).json(finalTask);

    } catch (error) {
        // Manejo de errores de validación (ej. prioridad no válida)
        res.status(400).json({ message: error.message });
    }
};

// @desc    Eliminar una tarea
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }

        res.status(200).json({ message: `Tarea "${task.title}" eliminada con éxito.` });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al eliminar la tarea.' });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};