// Ruta desde la raíz de tu proyecto: backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory, 
    deleteCategory,
} = require('../controllers/categoryController');

// Rutas para /api/categories
router.route('/')
    .get(getCategories) // Obtener todas las categorías
    .post(createCategory); // Crear una nueva categoría

// Rutas para /api/categories/:id
router.route('/:id')
    .put(updateCategory) // Actualizar por ID
    .delete(deleteCategory); // Eliminar por ID

module.exports = router;