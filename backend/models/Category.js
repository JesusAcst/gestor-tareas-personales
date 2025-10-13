// Ruta desde la raíz de tu proyecto: backend/models/Category.js
const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true, // Asegura que no haya categorías duplicadas
        trim: true,
    },
    color: {
        type: String,
        required: [true, 'El color de la categoría es obligatorio'],
        // Puedes añadir validación de formato si usas códigos hexadecimales:
        // match: /^#([0-9A-F]{3}){1,2}$/i, 
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Category', CategorySchema);