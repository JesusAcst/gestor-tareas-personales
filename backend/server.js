// 1. Importar librerías necesarias
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 2. Cargar variables de entorno
dotenv.config();

// 3. Inicializar la aplicación Express
const app = express();

// 4. Middlewares
// Permite que Express maneje JSON
app.use(express.json());
// Configurar CORS para permitir peticiones del frontend (React)
app.use(cors({
    origin: 'http://localhost:3000' // Puerto por defecto de Vite/React
}));

// 5. Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB conectado con éxito.');
    } catch (error) {
        console.error(`❌ Error al conectar a MongoDB: ${error.message}`);
        process.exit(1); // Salir del proceso con fallo
    }
};

// Conectar a la base de datos
connectDB();

// 6. Rutas de prueba (Endpoint principal)
app.get('/', (req, res) => {
    res.send('API del Gestor de Tareas funcionando!');
});

// 7. Definición de Rutas de la API
// Usaremos la URL base /api para todos nuestros endpoints
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));


// 8. Iniciar el Servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`📡 Servidor corriendo en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});






