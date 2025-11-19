import { formatDueDate, priorityBadge, normalizePriority } from '../services/api';

export default function TaskCard({ task, onComplete, onDelete, onEdit }) {
  const pr = priorityBadge(task.priority || normalizePriority(task.priority));
  const progressColor = pr.color;
  const hoverCls = pr.text === 'Urgent' ? 'border-red' : pr.text === 'Medium' ? 'border-yellow' : 'border-blue';

  const percent = typeof task.progress === 'number' ? Math.max(0, Math.min(100, task.progress)) : 45;

  return (
    <div className={`card ${hoverCls} entering`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <h3 className="card-title">{task.title}</h3>
          <span className={pr.cls}>{pr.text}</span>
        </div>
      </div>
      <div className="row-end">
        <div style={{ width: '66%' }}>
          <p className="meta">{formatDueDate(task.dueDate)}</p>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${percent}%`, background: progressColor }} />
          </div>
        </div>
        <div className="actions">
          {onEdit && (
            <button 
              className="action-btn bg-blue" 
              title="Editar" 
              onClick={() => onEdit(task)} 
              aria-label={`Editar tarea "${task.title}"`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          <button 
            className="action-btn bg-green" 
            title="Marcar completada" 
            onClick={() => onComplete(task)} 
            aria-label={task.completed ? `Marcar tarea "${task.title}" como pendiente` : `Marcar tarea "${task.title}" como completada`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button 
            className="action-btn bg-red" 
            title="Eliminar" 
            onClick={() => onDelete(task)} 
            aria-label={`Eliminar tarea "${task.title}"`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}


