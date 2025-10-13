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
        // Referencia al modelo Category (Relación 1 a N)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: [true, 'La categoría es obligatoria para la tarea'],
    },
    dueDate: {
        type: Date,
        default: null, // Opcional
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', TaskSchema);