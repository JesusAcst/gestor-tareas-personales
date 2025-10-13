// Ruta: backend/controllers/taskController.js
const Task = require('../models/Task');
const Category = require('../models/Category'); // Necesario para verificar si existe la categoría

// @desc    Obtener todas las tareas (incluyendo el filtro por categoría)
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('category', 'name color') // Reemplaza el ID de categoría por el objeto (solo 'name' y 'color')
            .sort({ createdAt: -1 }); // Ordenar por más reciente primero
            
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Crear una nueva tarea
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
    const { title, description, category, dueDate } = req.body;

    // Validación básica
    if (!title || !category) {
        return res.status(400).json({ message: 'El título y la categoría son obligatorios.' });
    }

    try {
        // 1. Verificar si la Category existe (manejar la relación)
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({ message: 'La categoría especificada no existe.' });
        }

        // 2. Crear la tarea
        const task = await Task.create({
            title,
            description,
            category,
            dueDate,
        });

        // 3. Devolver la tarea completa, incluyendo el objeto de categoría poblado
        const createdTask = await Task.findById(task._id).populate('category', 'name color');

        res.status(201).json(createdTask);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Actualizar el estado de una tarea (e.g., completada)
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
    const { title, description, category, dueDate, completed } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada.' });
        }
        
        // Opcional: Si se intenta cambiar la categoría, verificar que exista
        if (category && category.toString() !== task.category.toString()) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: 'La nueva categoría especificada no existe.' });
            }
        }

        // Actualizar los campos
        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.category = category || task.category;
        task.dueDate = dueDate || task.dueDate;
        
        // Manejar el campo 'completed' específicamente, ya que puede ser `false`
        if (completed !== undefined) {
            task.completed = completed;
        }

        const updatedTask = await task.save();

        // Devolver la tarea actualizada con la categoría poblada
        const finalTask = await Task.findById(updatedTask._id).populate('category', 'name color');

        res.status(200).json(finalTask);

    } catch (error) {
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