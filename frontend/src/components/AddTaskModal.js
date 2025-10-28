import { useState } from 'react';

export default function AddTaskModal({ open, onClose, onSubmit, categories }) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, category: categoryId || null, priority, dueDate: dueDate ? new Date(dueDate).toISOString() : null, completed: false });
    setTitle(''); setCategoryId(''); setPriority('medium'); setDueDate('');
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Nueva Tarea</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label>Categoría</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Prioridad</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
          <div className="field">
            <label>Fecha límite</label>
            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn primary">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}


