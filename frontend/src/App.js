import { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        console.log('📦 Datos recibidos del backend:', data);
        setTasks(data);
      })
      .catch(err => console.error('❌ Error al conectar con backend:', err));
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Gestor de Tareas</h1>
      <ul className="list-group mt-4">
        {tasks.length === 0 ? (
          <li className="list-group-item">No hay tareas registradas</li>
        ) : (
          tasks.map((task) => (
            <li key={task._id} className="list-group-item">
              {task.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
