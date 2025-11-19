const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.status !== 204 ? res.json() : null;
}

export const tasksApi = {
  list: () => http('/api/tasks'),
  create: (payload) => http('/api/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => http(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => http(`/api/tasks/${id}`, { method: 'DELETE' }),
};

export const categoriesApi = {
  list: () => http('/api/categories'),
  create: (payload) => http('/api/categories', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => http(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => http(`/api/categories/${id}`, { method: 'DELETE' }),
};

export function normalizePriority(value) {
  if (!value) return 'low';
  const v = String(value).trim().toLowerCase();
  if (['high', 'alta', 'alto', 'urgente', 'urgent'].includes(v)) return 'high';
  if (['medium', 'media', 'medio'].includes(v)) return 'medium';
  return 'low';
}

export function formatDueDate(iso) {
  if (!iso) return '';
  const now = new Date();
  const due = new Date(iso);
  const diffMs = due - now;
  const dayMs = 24 * 60 * 60 * 1000;
  if (diffMs <= 0) return 'Due: Today';
  const days = Math.round(diffMs / dayMs);
  if (days === 1) return 'Due: Tomorrow';
  if (days < 7) return `Due: In ${days} d${days === 1 ? 'y' : 'ys'}`;
  const weeks = Math.round(days / 7);
  return `Due: In ${weeks} wk${weeks > 1 ? 's' : ''}`;
}

export function priorityBadge(priority) {
  const p = normalizePriority(priority);
  switch (p) {
    case 'high': return { text: 'Urgent', cls: 'badge red', color: '#ef4444' };
    case 'medium': return { text: 'Medium', cls: 'badge yellow', color: '#f59e0b' };
    default: return { text: 'Low', cls: 'badge blue', color: '#3b82f6' };
  }
}

