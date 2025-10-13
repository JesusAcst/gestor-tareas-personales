// Ruta: backend/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título de la tarea es obligatorio'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: false, // Ya no es obligatorio
    },
    // Nuevo campo para fecha de vencimiento
    dueDate: {
        type: Date,
        default: null, // Ahora puede incluir tareas sin fecha de vencimiento
    },
    // Nuevo campo para prioridad
        priority: {
        type: String,
        enum: ['Alta', 'Media', 'Baja'], // Restringe los valores posibles
        required: false, // No es obligatorio
    },
    // NUEVO: Campo para recordatorio (e.g., almacenar un timestamp o configuración)
    reminder: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', TaskSchema);