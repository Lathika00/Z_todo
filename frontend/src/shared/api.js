const API_BASE = '/api/todos';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.errors?.join(', ') || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const todoApi = {
  getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`${API_BASE}${query ? `?${query}` : ''}`);
  },

  getStats() {
    return request(`${API_BASE}/stats`);
  },

  getById(id) {
    return request(`${API_BASE}/${id}`);
  },

  create(data) {
    return request(API_BASE, { method: 'POST', body: JSON.stringify(data) });
  },

  update(id, data) {
    return request(`${API_BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  patch(id, data) {
    return request(`${API_BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },

  delete(id) {
    return request(`${API_BASE}/${id}`, { method: 'DELETE' });
  },
};

export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function isOverdue(todo) {
  if (!todo.dueDate || todo.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(todo.dueDate) < today;
}

export function getPriorityLabel(priority) {
  return { low: 'Low', medium: 'Medium', high: 'High' }[priority] || priority;
}

export function todosPageUrl() {
  return import.meta.env.DEV ? '/todos.html' : '/todos';
}

export function todoDetailUrl(id) {
  const base = import.meta.env.DEV ? '/todo.html' : '/todo';
  return `${base}?id=${id}`;
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
