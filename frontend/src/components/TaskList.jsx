// TaskList.jsx
function TaskList({ tasks }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {tasks.length === 0 ? (
        <p className="text-gray-500 italic">No hay tareas. ¡Empieza a crear una!</p>
      ) : (
        // Aquí se mapearán las tareas
        <ul className="space-y-3">
          {/* Ejemplo de Tarea */}
          <li className="p-3 border-b">Tarea de Ejemplo (Total: {tasks.length})</li>
        </ul>
      )}
    </div>
  );
}
export default TaskList;