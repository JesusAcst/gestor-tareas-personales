import { useState, useMemo, memo } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { tasksApi } from '../services/api';

const TaskList = memo(function TaskList({ onEdit, onComplete, onDelete, showToast }) {
  const { filteredTasks, filters, refreshTasks } = useTasks();
  const [displayLimit, setDisplayLimit] = useState(7);
  const ITEMS_PER_PAGE = 7;

  // Tareas a mostrar según el límite
  const tasksToShow = useMemo(() => {
    return filteredTasks.slice(0, displayLimit);
  }, [filteredTasks, displayLimit]);

  const hasMore = filteredTasks.length > displayLimit;

  const handleShowMore = () => {
    setDisplayLimit(prev => prev + ITEMS_PER_PAGE);
  };

  // Resetear límite cuando cambian los filtros
  useMemo(() => {
    setDisplayLimit(7);
  }, [filters.categoryId, filters.priority, filters.tab]);

  if (filteredTasks.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px',
        background: '#ffffff',
        borderRadius: '16px',
        color: '#6b7280'
      }}>
        <p>No hay tareas que coincidan con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid">
        {tasksToShow.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            className="btn ghost"
            onClick={handleShowMore}
            style={{ minWidth: '140px' }}
          >
            Mostrar más ({filteredTasks.length - displayLimit} restantes)
          </button>
        </div>
      )}
    </>
  );
});

export default TaskList;

