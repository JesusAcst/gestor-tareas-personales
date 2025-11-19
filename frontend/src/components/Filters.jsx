import { memo } from 'react';
import { useTasks } from '../context/TaskContext';

const Filters = memo(function Filters() {
  const { categories, filters, updateFilters } = useTasks();

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value === 'all' ? null : e.target.value;
    updateFilters({ categoryId });
  };

  const handlePriorityChange = (e) => {
    const priority = e.target.value === 'all' ? null : e.target.value;
    updateFilters({ priority });
  };

  return (
    <div className="filters" style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor="filter-category" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
          Categoría:
        </label>
        <select
          id="filter-category"
          className="filter-select"
          value={filters.categoryId || 'all'}
          onChange={handleCategoryChange}
          aria-label="Filtrar tareas por categoría"
        >
          <option value="all">Todas</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label htmlFor="filter-priority" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
          Prioridad:
        </label>
        <select
          id="filter-priority"
          className="filter-select"
          value={filters.priority || 'all'}
          onChange={handlePriorityChange}
          aria-label="Filtrar tareas por prioridad"
        >
          <option value="all">Todas</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>
    </div>
  );
});

export default Filters;

