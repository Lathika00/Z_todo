import { useState, useEffect } from 'react';
import { todoApi, formatDate, formatDateTime, isOverdue, getQueryParam, todosPageUrl, todoDetailUrl } from '../../shared/api';
import { Layout, PriorityBadge, TagList, Spinner, ConfirmDialog } from '../../shared/components';

function EditForm({ todo, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    dueDate: todo.dueDate || '',
    tags: (todo.tags || []).join(', '),
    completed: todo.completed,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    const value = field === 'completed' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || null,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        completed: form.completed,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 animate-scale-in">
      <h2 className="mb-5 font-display text-xl font-semibold text-gradient-violet-cyan">Edit Task</h2>
      {error && (
        <div
          className="mb-4 rounded-xl px-3 py-2 text-sm"
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
          }}
        >
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
            Title
          </label>
          <input className="input-field" value={form.title} onChange={handleChange('title')} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
            Description
          </label>
          <textarea
            className="input-field min-h-[120px] resize-y"
            value={form.description}
            onChange={handleChange('description')}
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
              Priority
            </label>
            <select className="input-field" value={form.priority} onChange={handleChange('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
              Due Date
            </label>
            <input
              type="date"
              className="input-field"
              value={form.dueDate}
              onChange={handleChange('dueDate')}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
            Tags
          </label>
          <input
            className="input-field"
            placeholder="work, urgent, personal"
            value={form.tags}
            onChange={handleChange('tags')}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={form.completed}
            onChange={handleChange('completed')}
          />
          <span className="text-sm text-secondary">Mark as completed</span>
        </label>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : '✦ Save Changes'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default function TodoDetailPage() {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const todoId = getQueryParam('id');

  useEffect(() => {
    if (!todoId) {
      setError('No todo ID provided. Use ?id=<todo-id> in the URL.');
      setLoading(false);
      return;
    }

    todoApi
      .getById(todoId)
      .then(setTodo)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [todoId]);

  const handleSave = async (data) => {
    const updated = await todoApi.update(todoId, data);
    setTodo(updated);
    setEditing(false);
  };

  const handleToggle = async () => {
    const updated = await todoApi.patch(todoId, { completed: !todo.completed });
    setTodo(updated);
  };

  const handleDelete = async () => {
    await todoApi.delete(todoId);
    window.location.href = todosPageUrl();
  };

  if (loading) {
    return (
      <Layout activePage="todo">
        <Spinner />
      </Layout>
    );
  }

  if (error || !todo) {
    return (
      <Layout activePage="todo">
        <div className="glass-card p-8 text-center animate-fade-in">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
            }}
          >
            <svg className="h-7 w-7" style={{ color: '#fb7185' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-primary">Task Not Found</h2>
          <p className="mt-2 text-secondary">{error || 'This task may have been deleted.'}</p>
          <a href={todosPageUrl()} className="btn-primary mt-6 inline-flex">
            Back to All Tasks
          </a>
        </div>
      </Layout>
    );
  }

  const overdue = isOverdue(todo);

  if (editing) {
    return (
      <Layout activePage="todo">
        <a href={todoDetailUrl(todo.id)} className="mb-6 inline-flex items-center gap-1 text-sm text-secondary hover:text-aurora-violet transition-colors">
          ← Back to task
        </a>
        <EditForm todo={todo} onSave={handleSave} onCancel={() => setEditing(false)} />
      </Layout>
    );
  }

  return (
    <Layout activePage="todo">
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete task?"
        message="This task will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Back link */}
      <a
        href={todosPageUrl()}
        className="mb-6 inline-flex items-center gap-1.5 text-base font-medium text-secondary transition-colors hover:text-aurora-violet"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Tasks
      </a>

      {/* Detail Card */}
      <article className="glass-card overflow-hidden animate-slide-up">
        {/* Header */}
        <div
          className="px-6 py-5 sm:px-8"
          style={{
            background: 'var(--filter-btn-bg)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                className="todo-checkbox mt-1.5"
                checked={todo.completed}
                onChange={handleToggle}
              />
              <div>
                <h1
                  className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${
                    todo.completed ? 'text-muted line-through' : 'text-gradient-violet-cyan'
                  }`}
                >
                  {todo.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={todo.priority} />
                  {todo.completed && (
                    <span
                      className="rounded-md px-2 py-0.5 text-sm font-semibold"
                      style={{
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                      }}
                    >
                      Completed
                    </span>
                  )}
                  {overdue && (
                    <span
                      className="rounded-md px-2 py-0.5 text-sm font-semibold animate-glow-pulse"
                      style={{
                        background: 'rgba(244, 63, 94, 0.12)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        color: '#fb7185',
                      }}
                    >
                      Overdue
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => setEditing(true)}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-6 sm:px-8">
          {/* Description */}
          {todo.description ? (
            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                Description
              </h3>
              <p className="text-body whitespace-pre-wrap leading-relaxed">{todo.description}</p>
            </section>
          ) : (
            <p className="text-base italic text-muted">No description provided.</p>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Due Date',
                value: todo.dueDate ? formatDate(todo.dueDate) : 'No due date',
                highlight: overdue,
              },
              {
                label: 'Priority',
                value: todo.priority,
                capitalize: true,
              },
              {
                label: 'Created',
                value: formatDateTime(todo.createdAt),
              },
              {
                label: 'Last Updated',
                value: formatDateTime(todo.updatedAt),
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="rounded-xl p-4 animate-slide-up"
                style={{
                  background: 'var(--item-bg)',
                  border: '1px solid var(--border-color)',
                  animationDelay: `${i * 80}ms`,
                  animationFillMode: 'both',
                }}
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-muted">{item.label}</p>
                <p className={`mt-1 text-lg font-semibold ${
                  item.highlight ? 'text-aurora-rose' : item.capitalize ? 'capitalize text-primary' : 'text-primary'
                }`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {todo.tags?.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">Tags</h3>
              <TagList tags={todo.tags} />
            </section>
          )}

          {/* Task ID */}
          <section
            className="rounded-xl p-4"
            style={{
              background: 'var(--filter-btn-bg)',
              border: '1px solid var(--filter-btn-border)',
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Task ID</p>
            <p className="mt-1 font-mono text-base text-secondary">{todo.id}</p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
