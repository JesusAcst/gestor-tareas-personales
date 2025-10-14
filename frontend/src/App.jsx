// frontend/src/App.jsx
import { useState } from 'react';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Agrega más estado y funciones de la API aquí más tarde

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Menú lateral con Categorías y filtros */}
      <Sidebar categories={categories} />
      
      {/* Main Content - Lista de Tareas y cabecera */}
      <div className="flex-1 p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tareas Pendientes</h1>
          {/* Aquí irá el botón para añadir nueva tarea */}
        </header>
        
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}

export default App;