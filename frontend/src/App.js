import { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TasksByCategory from './components/TasksByCategory';
import CategoriesPanel from './components/CategoriesPanel';
import Filters from './components/Filters';
import Toast from './components/Toast';
import { useTasks } from './context/TaskContext';
import { tasksApi } from './services/api';
import './App.css';

function App() {
  const { categories, filters, setTasks, refreshTasks } = useTasks();
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showCategoriesPanel, setShowCategoriesPanel] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCategoryChange = (updatedCategories) => {
    // Las categorías se actualizan automáticamente desde CategoriesPanel
    // Este handler se mantiene por compatibilidad
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingTask(null);
  };

  async function handleSubmit(payload) {
    setIsLoading(true);
    try {
      if (editingTask) {
        // Edición: PUT /api/tasks/:id
        const updated = await tasksApi.update(editingTask._id, payload);
        setTasks(prev => prev.map(t => t._id === editingTask._id ? updated : t));
        showToast('Tarea actualizada correctamente', 'success');
      } else {
        // Creación: POST /api/tasks
        const created = await tasksApi.create(payload);
        setTasks(prev => [created, ...prev]);
        showToast('Tarea creada correctamente', 'success');
      }
      handleCloseModal();
      // Refrescar tareas para asegurar sincronización
      await refreshTasks();
    } catch (e) {
      console.error(e);
      const errorMessage = e.message?.includes('Failed to fetch') || e.message?.includes('NetworkError')
        ? 'Error de conexión. Verifica que el servidor esté en ejecución.'
        : e.message?.includes('HTTP 400')
        ? 'Datos inválidos. Verifica los campos del formulario.'
        : e.message?.includes('HTTP 404')
        ? 'Recurso no encontrado.'
        : 'Error al guardar la tarea. Intenta nuevamente.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleComplete(task) {
    try {
      const updated = await tasksApi.update(task._id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
      await refreshTasks();
    } catch (e) {
      console.error(e);
      showToast('Error al actualizar la tarea', 'error');
    }
  }

  async function handleDelete(task) {
    try {
      await tasksApi.remove(task._id);
      setTasks(prev => prev.filter(t => t._id !== task._id));
      showToast('Tarea eliminada correctamente', 'success');
      await refreshTasks();
    } catch (e) {
      console.error(e);
      showToast('Error al eliminar la tarea', 'error');
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="container-page">
        <Tabs />
        {showCategoriesPanel ? (
          <CategoriesPanel
            onCategoryChange={handleCategoryChange}
            showToast={showToast}
            onClose={() => setShowCategoriesPanel(false)}
          />
        ) : filters.tab === 'categories' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Tareas por Categoría</h2>
              <button
                className="btn ghost"
                onClick={() => setShowCategoriesPanel(true)}
                style={{ fontSize: '14px' }}
                aria-label="Abrir panel de gestión de categorías"
              >
                Gestionar categorías
              </button>
            </div>
            <Filters />
            <TasksByCategory
              onEdit={handleOpenEdit}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
            <button 
              className="fab" 
              onClick={handleOpenCreate} 
              aria-label="Crear nueva tarea"
              title="Crear nueva tarea"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <Filters />
            <TaskList
              onEdit={handleOpenEdit}
              onComplete={handleComplete}
              onDelete={handleDelete}
              showToast={showToast}
            />
            <button 
              className="fab" 
              onClick={handleOpenCreate} 
              aria-label="Crear nueva tarea"
              title="Crear nueva tarea"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </>
        )}
      </main>
      {openModal && (
        <div 
          className="modal-backdrop" 
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-title" style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
            </h3>
            <TaskForm
              initialTask={editingTask}
              categories={categories}
              onCancel={handleCloseModal}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
