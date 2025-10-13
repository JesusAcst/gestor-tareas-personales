// Ruta desde la raíz de tu proyecto: backend/controllers/categoryController.js
const Category = require('../models/Category'); // Importar el modelo Category

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Crear una nueva categoría
// @route   POST /api/categories
// @access  Public
const createCategory = async (req, res) => {
    const { name, color } = req.body;

    // Validación: El nombre y color son obligatorios
    if (!name || !color) {
        return res.status(400).json({ message: 'Por favor, añade el nombre y el color de la categoría.' });
    }

    try {
        const category = await Category.create({ name, color });
        res.status(201).json(category);
    } catch (error) {
        // Error de duplicado (si el nombre es único)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre.' });
        }
        // Otros errores de validación de Mongoose
        res.status(400).json({ message: error.message });
    }
};

// @desc    Eliminar una categoría
// @route   DELETE /api/categories/:id
// @access  Public
const deleteCategory = async (req, res) => {
    try {
        // Buscamos y eliminamos por ID
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        
        // **(NOTA):** La lógica para eliminar tareas asociadas se implementará después.

        res.status(200).json({ message: `Categoría "${category.name}" eliminada con éxito.` });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al eliminar la categoría.' });
    }
};

// Exportar funciones para usarlas en las rutas
module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
};