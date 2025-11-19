import { useState, useEffect, useRef } from 'react';

export default function TaskForm({ initialTask, categories, onCancel, onSubmit, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminder, setReminder] = useState('');
  const titleInputRef = useRef(null);

  // Enfocar automáticamente el campo title al abrir el modal
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Manejar tecla Esc para cerrar el modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel, isLoading]);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask?.title || '');
      setDescription(initialTask?.description || '');
      // Convertir prioridad del backend ('Alta', 'Media', 'Baja') a formato del formulario ('alta', 'media', 'baja')
      const priorityMap = { 'Alta': 'alta', 'Media': 'media', 'Baja': 'baja' };
      setPriority(priorityMap[initialTask?.priority] || 'media');
      setCategoryId(initialTask?.category?._id || initialTask?.category || '');
      
      // Convertir fechas ISO a formato datetime-local
      if (initialTask?.dueDate) {
        const due = new Date(initialTask.dueDate);
        const year = due.getFullYear();
        const month = String(due.getMonth() + 1).padStart(2, '0');
        const day = String(due.getDate()).padStart(2, '0');
        const hours = String(due.getHours()).padStart(2, '0');
        const minutes = String(due.getMinutes()).padStart(2, '0');
        setDueDate(`${year}-${month}-${day}T${hours}:${minutes}`);
      } else {
        setDueDate('');
      }
      
      if (initialTask?.reminder) {
        const rem = new Date(initialTask.reminder);
        const year = rem.getFullYear();
        const month = String(rem.getMonth() + 1).padStart(2, '0');
        const day = String(rem.getDate()).padStart(2, '0');
        const hours = String(rem.getHours()).padStart(2, '0');
        const minutes = String(rem.getMinutes()).padStart(2, '0');
        setReminder(`${year}-${month}-${day}T${hours}:${minutes}`);
      } else {
        setReminder('');
      }
    } else {
      // Resetear formulario para nueva tarea
      setTitle('');
      setDescription('');
      setPriority('media');
      setCategoryId('');
      setDueDate('');
      setReminder('');
    }
  }, [initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación: title y priority son requeridos
    if (!title.trim()) {
      return;
    }
    if (!priority || !['alta', 'media', 'baja'].includes(priority)) {
      return;
    }

    // Convertir prioridad del formulario a formato del backend
    const priorityMap = { 'alta': 'Alta', 'media': 'Media', 'baja': 'Baja' };
    const backendPriority = priorityMap[priority];

    // Obtener categoría completa si se seleccionó una
    let categoryObj = null;
    if (categoryId) {
      const selectedCategory = categories.find(c => c._id === categoryId);
      if (selectedCategory) {
        categoryObj = {
          _id: selectedCategory._id,
          name: selectedCategory.name,
          color: selectedCategory.color
        };
      }
    }

    // Preparar payload según el formato requerido
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority: backendPriority,
      category: categoryObj || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      reminder: reminder ? new Date(reminder).toISOString() : undefined,
      completed: initialTask?.completed || false
    };

    onSubmit(payload);
  };

  // Validar si el formulario es válido
  const isValid = title.trim() && priority && ['alta', 'media', 'baja'].includes(priority);

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">
          Título <span id="title-required" style={{ color: '#ef4444' }} aria-label="requerido">*</span>
        </label>
        <input
          ref={titleInputRef}
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
          aria-required="true"
          aria-describedby="title-required"
        />
      </div>

      <div className="field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          disabled={isLoading}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '10px 12px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <div className="field">
        <label htmlFor="priority">Prioridad <span style={{ color: '#ef4444' }}>*</span></label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="category">Categoría</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Sin categoría</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="dueDate">Fecha límite</label>
        <input
          id="dueDate"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="field">
        <label htmlFor="reminder">Recordatorio</label>
        <input
          id="reminder"
          type="datetime-local"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn ghost"
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Cancelar y cerrar formulario"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn primary"
          disabled={!isValid || isLoading}
          aria-label={isLoading ? 'Guardando tarea...' : initialTask ? 'Guardar cambios de la tarea' : 'Crear nueva tarea'}
        >
          {isLoading ? 'Guardando...' : initialTask ? 'Guardar cambios' : 'Guardar tarea'}
        </button>
      </div>
    </form>
  );
}

