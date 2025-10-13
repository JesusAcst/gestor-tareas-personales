// Ruta: backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

// Rutas para /api/tasks
router.route('/')
    .get(getTasks) 
    .post(createTask); 

// Rutas para /api/tasks/:id
router.route('/:id')
    .put(updateTask) 
    .delete(deleteTask); 

module.exports = router;