import { useState, useEffect } from 'react';
import { categoriesApi } from '../services/api';
import { useTasks } from '../context/TaskContext';

export default function CategoriesPanel({ onCategoryChange, showToast, onClose }) {
  const { categories, setCategories, refreshTasks } = useTasks();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadCategories = async () => {
    try {
      await refreshTasks();
      if (onCategoryChange) {
        onCategoryChange(categories);
      }
    } catch (e) {
      console.error(e);
      if (showToast) {
        showToast('Error al cargar categorías', 'error');
      }
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', color: '#3B82F6' });
    setErrors({});
    setShowForm(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color });
    setErrors({});
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#3B82F6' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.color || !formData.color.trim()) {
      newErrors.color = 'El color es obligatorio';
    } else if (!/^#([0-9A-F]{3}){1,2}$/i.test(formData.color)) {
      newErrors.color = 'El color debe ser un código hexadecimal válido (ej: #3B82F6)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (editingCategory) {
        // Editar categoría
        await categoriesApi.update(editingCategory._id, {
          name: formData.name.trim(),
          color: formData.color.trim()
        });
        if (showToast) {
          showToast('Categoría actualizada correctamente', 'success');
        }
      } else {
        // Crear categoría
        await categoriesApi.create({
          name: formData.name.trim(),
          color: formData.color.trim()
        });
        if (showToast) {
          showToast('Categoría creada correctamente', 'success');
        }
      }
      await loadCategories();
      handleCancel();
    } catch (e) {
      console.error(e);
      let errorMessage = 'Error al guardar la categoría';
      
      if (e.message?.includes('HTTP 400')) {
        const errorText = e.message.toLowerCase();
        if (errorText.includes('ya existe') || errorText.includes('duplicado') || errorText.includes('unique')) {
          errorMessage = 'Ya existe una categoría con ese nombre';
          setErrors({ name: 'Este nombre ya está en uso' });
        } else {
          errorMessage = 'Datos inválidos. Verifica los campos.';
        }
      } else if (e.message?.includes('Failed to fetch') || e.message?.includes('NetworkError')) {
        errorMessage = 'Error de conexión. Verifica que el servidor esté en ejecución.';
      }
      
      if (showToast) {
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (category) => {
    setIsLoading(true);
    try {
      await categoriesApi.remove(category._id);
      if (showToast) {
        showToast(`Categoría "${category.name}" eliminada correctamente`, 'success');
      }
      await loadCategories();
      setDeleteConfirm(null);
    } catch (e) {
      console.error(e);
      const errorMessage = e.message?.includes('HTTP 404')
        ? 'Categoría no encontrada'
        : e.message?.includes('Failed to fetch')
        ? 'Error de conexión'
        : 'Error al eliminar la categoría';
      if (showToast) {
        showToast(errorMessage, 'error');
      }
      setDeleteConfirm(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onClose && (
            <button
              className="btn ghost"
              onClick={onClose}
              style={{ padding: '8px 12px' }}
            >
              ← Volver
            </button>
          )}
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Categorías</h2>
        </div>
        <button
          className="btn primary"
          onClick={handleOpenCreate}
          disabled={isLoading || showForm}
        >
          + Añadir categoría
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="category-name">
                Nombre <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="category-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                style={{
                  borderColor: errors.name ? '#ef4444' : '#e5e7eb'
                }}
              />
              {errors.name && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.name}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="category-color">
                Color <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  id="category-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  disabled={isLoading}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  disabled={isLoading}
                  placeholder="#3B82F6"
                  style={{
                    flex: 1,
                    borderColor: errors.color ? '#ef4444' : '#e5e7eb'
                  }}
                />
              </div>
              {errors.color && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.color}
                </span>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn primary"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : editingCategory ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 && !showForm ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: '#ffffff',
          borderRadius: '16px',
          color: '#6b7280'
        }}>
          <p>No hay categorías creadas aún.</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Crea tu primera categoría para organizar tus tareas.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {categories.map(category => (
            <div
              key={category._id}
              style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: category.color,
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>
                  {category.name}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="action-btn bg-blue"
                  title="Editar"
                  onClick={() => handleOpenEdit(category)}
                  disabled={isLoading || showForm}
                  aria-label="edit"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  className="action-btn bg-red"
                  title="Eliminar"
                  onClick={() => setDeleteConfirm(category)}
                  disabled={isLoading || showForm}
                  aria-label="delete"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
              Confirmar eliminación
            </h3>
            <p style={{ marginBottom: 20, color: '#6b7280' }}>
              ¿Seguro que deseas eliminar la categoría <strong>"{deleteConfirm.name}"</strong>?
              <br />
              <span style={{ fontSize: '14px' }}>
                Las tareas asociadas quedarán sin categoría.
              </span>
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setDeleteConfirm(null)}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isLoading}
                style={{ background: '#ef4444' }}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

