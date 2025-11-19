import { memo } from 'react';
import { useTasks } from '../context/TaskContext';

const Tabs = memo(function Tabs() {
  const { filters, updateFilters } = useTasks();

  const handleTabChange = (tab) => {
    updateFilters({ tab });
  };

  return (
    <div className="tabs">
      <button
        className={`tab ${filters.tab === 'pending' ? 'active' : ''}`}
        onClick={() => handleTabChange('pending')}
      >
        Pendientes
      </button>
      <button
        className={`tab ${filters.tab === 'completed' ? 'active' : ''}`}
        onClick={() => handleTabChange('completed')}
      >
        Completadas
      </button>
      <button
        className={`tab ${filters.tab === 'categories' ? 'active' : ''}`}
        onClick={() => handleTabChange('categories')}
      >
        Categoría
      </button>
    </div>
  );
});

export default Tabs;


