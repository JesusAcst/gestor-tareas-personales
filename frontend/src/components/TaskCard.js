import { formatDueDate, priorityBadge } from '../services/api';

export default function TaskCard({ task, onComplete, onDelete }) {
  const pr = priorityBadge(task.priority || (task.category?.color === '#ef4444' ? 'high' : 'low'));
  const progressColor = pr.color;
  const hoverCls = pr.text === 'Urgent' ? 'border-red' : pr.text === 'Medium' ? 'border-yellow' : 'border-blue';

  const percent = typeof task.progress === 'number' ? Math.max(0, Math.min(100, task.progress)) : 45;

  return (
    <div className={`card ${hoverCls}`}>
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
          <button className="action-btn bg-green" onClick={() => onComplete(task)} aria-label="complete">
            <span className="material-symbols-outlined" style={{ color: '#22C55E' }}>check</span>
          </button>
          <button className="action-btn bg-red" onClick={() => onDelete(task)} aria-label="delete">
            <span className="material-symbols-outlined" style={{ color: '#EF4444' }}>delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}


