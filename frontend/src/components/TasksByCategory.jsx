import { memo, useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskList from './TaskList';

const TasksByCategory = memo(function TasksByCategory({ onEdit, onComplete, onDelete }) {
  const { tasksByCategory, filters } = useTasks();
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  if (!tasksByCategory || Object.keys(tasksByCategory).length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px',
        background: '#ffffff',
        borderRadius: '16px',
        color: '#6b7280'
      }}>
        <p>No hay tareas agrupadas por categoría.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {Object.entries(tasksByCategory).map(([catId, group]) => {
        const isExpanded = expandedCategories[catId] !== false; // Por defecto expandido
        const displayLimit = isExpanded ? group.tasks.length : 7;
        const tasksToShow = group.tasks.slice(0, displayLimit);
        const hasMore = group.tasks.length > 7;

        return (
          <div
            key={catId}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: `2px solid ${group.color}20`
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                cursor: hasMore ? 'pointer' : 'default'
              }}
              onClick={hasMore ? () => toggleCategory(catId) : undefined}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  backgroundColor: group.color,
                  flexShrink: 0
                }}
              />
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                margin: 0,
                color: '#1f2937',
                flex: 1
              }}>
                {group.name}
              </h3>
              <span style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: 500
              }}>
                {group.tasks.length} {group.tasks.length === 1 ? 'tarea' : 'tareas'}
              </span>
              {hasMore && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </div>
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
            {hasMore && !isExpanded && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  className="btn ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(catId);
                  }}
                >
                  Mostrar todas ({group.tasks.length} tareas)
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default TasksByCategory;

