import { useState, useEffect, useCallback } from "react";
import {
  todoApi,
  formatDate,
  isOverdue,
  todoDetailUrl,
} from "../../shared/api";
import {
  Layout,
  PriorityBadge,
  TagList,
  Spinner,
  EmptyState,
  Modal,
  ConfirmDialog,
} from "../../shared/components";
import { MiniCalendar, UpcomingPanel } from "../../shared/CalendarWidget";

/* ─────── Stats Bar ─────── */

function StatsBar({ stats }) {
  if (!stats) return null;

  const items = [
    {
      label: "Total",
      value: stats.total,
      color: "var(--text-primary)",
      glow: "rgba(148, 163, 184, 0.3)",
    },
    {
      label: "Active",
      value: stats.active,
      color: "#fbbf24",
      glow: "rgba(245, 158, 11, 0.35)",
    },
    {
      label: "Done",
      value: stats.completed,
      color: "#34d399",
      glow: "rgba(16, 185, 129, 0.35)",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      color: "#fb7185",
      glow: "rgba(244, 63, 94, 0.35)",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="glass-card px-4 py-4 text-center animate-slide-up"
          style={{
            animationDelay: `${i * 80}ms`,
            animationFillMode: "both",
          }}
        >
          <p
            className="font-display text-3xl font-bold"
            style={{
              color: item.color,
              filter: `drop-shadow(0 0 8px ${item.glow})`,
            }}
          >
            {item.value}
          </p>
          <p className="text-caption mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────── Todo Form ─────── */

function TodoForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setTags("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          className="mb-4 rounded-xl px-4 py-3 text-base"
          style={{
            background: "rgba(244, 63, 94, 0.1)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fb7185",
          }}
        >
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="text-caption mb-1.5 block">Title</label>
          <input
            className="input-field"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label className="text-caption mb-1.5 block">Description</label>
          <textarea
            className="input-field min-h-[100px] resize-y"
            placeholder="Add details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-caption mb-1.5 block">Priority</label>
            <select
              className="input-field"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-caption mb-1.5 block">Due Date</label>
            <input
              type="date"
              className="input-field"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-caption mb-1.5 block">Tags</label>
            <input
              className="input-field"
              placeholder="work, urgent"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Adding..." : "✦ Add Task"}
          </button>
          {onCancel && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

/* ─────── Todo Item ─────── */

const PRIORITY_BORDER = {
  high: "rgba(244, 63, 94, 0.6)",
  medium: "rgba(6, 182, 212, 0.5)",
  low: "rgba(16, 185, 129, 0.5)",
};

const PRIORITY_GLOW = {
  high: "0 0 20px rgba(244, 63, 94, 0.15)",
  medium: "0 0 20px rgba(6, 182, 212, 0.1)",
  low: "0 0 20px rgba(16, 185, 129, 0.1)",
};

function TodoItem({ todo, onToggle, onDelete, index = 0 }) {
  const overdue = isOverdue(todo);

  return (
    <article
      className="group animate-slide-up"
      style={{
        animationDelay: `${index * 60}ms`,
        animationFillMode: "both",
      }}
    >
      <div
        className="flex items-start gap-4 rounded-[16px] p-5 transition-all duration-300"
        style={{
          background: "var(--item-bg)",
          border: "1px solid var(--border-color)",
          borderLeft: `3px solid ${PRIORITY_BORDER[todo.priority] || PRIORITY_BORDER.medium}`,
          backdropFilter: "blur(12px)",
          opacity: todo.completed ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--item-bg-hover)";
          e.currentTarget.style.borderColor = "var(--item-border-hover)";
          e.currentTarget.style.borderLeftColor =
            PRIORITY_BORDER[todo.priority] || PRIORITY_BORDER.medium;
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            PRIORITY_GLOW[todo.priority] || PRIORITY_GLOW.medium;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--item-bg)";
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.borderLeftColor =
            PRIORITY_BORDER[todo.priority] || PRIORITY_BORDER.medium;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <input
          type="checkbox"
          className="todo-checkbox mt-1.5"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={todoDetailUrl(todo.id)}
              className={`text-card-title transition-colors hover:text-aurora-violet ${
                todo.completed ? "text-muted line-through" : ""
              }`}
            >
              {todo.title}
            </a>
            <PriorityBadge priority={todo.priority} />
            {overdue && (
              <span
                className="rounded-md px-2 py-0.5 text-sm font-semibold animate-glow-pulse"
                style={{
                  background: "rgba(244, 63, 94, 0.12)",
                  color: "#fb7185",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                }}
              >
                Overdue
              </span>
            )}
          </div>
          {todo.description && (
            <p className="mt-1.5 line-clamp-2 text-body-sm">
              {todo.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {todo.dueDate && (
              <span
                className={`text-sm ${overdue ? "text-aurora-rose font-medium" : "text-muted"}`}
              >
                Due {formatDate(todo.dueDate)}
              </span>
            )}
            <TagList tags={todo.tags} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <a
            href={todoDetailUrl(todo.id)}
            className="btn-secondary !px-3 !py-2"
            title="View details"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </a>
          <button
            onClick={() => onDelete(todo.id)}
            className="btn-danger !px-3 !py-2"
            title="Delete"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─────── Main Page ─────── */

export default function TodosPage() {
  const [calendarTodos, setCalendarTodos] = useState([]);
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [showForm, setShowForm] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [confirmDialog, setConfirmDialog] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError("");
      const params = { sort };
      if (filter !== "all") params.status = filter;
      if (search) params.search = search;

      const [todosData, statsData, allTodos] = await Promise.all([
        todoApi.getAll(params),
        todoApi.getStats(),
        todoApi.getAll({ sort: "dueDate" }),
      ]);
      setTodos(todosData);
      setStats(statsData);
      setCalendarTodos(allTodos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, search, sort]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (data) => {
    await todoApi.create(data);
    setShowForm(false);
    await loadData();
  };

  const handleToggle = async (todo) => {
    await todoApi.patch(todo.id, { completed: !todo.completed });
    await loadData();
  };

  const handleDeleteRequest = (id) => {
    setConfirmDialog({ type: "delete", id });
  };

  const handleClearCompletedRequest = () => {
    const completed = todos.filter((t) => t.completed);
    if (!completed.length) return;
    setConfirmDialog({ type: "clear", count: completed.length });
  };

  const handleConfirm = async () => {
    if (!confirmDialog) return;
    if (confirmDialog.type === "delete") {
      await todoApi.delete(confirmDialog.id);
    } else if (confirmDialog.type === "clear") {
      const completed = todos.filter((t) => t.completed);
      await Promise.all(completed.map((t) => todoApi.delete(t.id)));
    }
    setConfirmDialog(null);
    await loadData();
  };

  return (
    <Layout activePage="todos">
      <ConfirmDialog
        open={!!confirmDialog}
        title={
          confirmDialog?.type === "clear"
            ? "Clear completed tasks?"
            : "Delete task?"
        }
        message={
          confirmDialog?.type === "clear"
            ? `This will permanently delete ${confirmDialog.count} completed task(s). This cannot be undone.`
            : "This task will be permanently deleted. This cannot be undone."
        }
        confirmLabel={confirmDialog?.type === "clear" ? "Clear all" : "Delete"}
        danger
        onConfirm={handleConfirm}
        onCancel={() => setConfirmDialog(null)}
      />

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Task"
      >
        <TodoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>

      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div>
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-page-title">Tasks</h2>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Task
            </button>
          </div>

          {/* Stats */}
          <StatsBar stats={stats} />

          {/* Task List Card */}
          <section className="glass-card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full animate-glow-pulse"
                style={{
                  background: "#8b5cf6",
                  boxShadow: "0 0 8px rgba(139, 92, 246, 0.5)",
                }}
              />
              <h3 className="text-section-title">Task List</h3>
            </div>

            {/* Filters & Search */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {["all", "active", "completed"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="rounded-xl px-4 py-2 text-sm font-bold capitalize transition-all"
                    style={
                      filter === f
                        ? {
                            background: "#7c3aed",
                            border: "2px solid var(--accent-border)",
                            color: "white",
                            boxShadow: "3px 3px 0 var(--btn-shadow)",
                          }
                        : {
                            background: "var(--filter-btn-bg)",
                            border: "1px solid var(--filter-btn-border)",
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  className="input-field !w-auto min-w-[200px]"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="input-field !w-auto"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="createdAt">Newest first</option>
                  <option value="priority">By priority</option>
                  <option value="dueDate">By due date</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-4 rounded-xl px-4 py-3 text-base"
                style={{
                  background: "rgba(244, 63, 94, 0.1)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  color: "#fb7185",
                }}
              >
                {error}
                <button
                  className="ml-3 underline hover:no-underline"
                  onClick={loadData}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Task count header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-section-title">
                {filter === "all"
                  ? "All Tasks"
                  : filter === "active"
                    ? "Active Tasks"
                    : "Completed Tasks"}
                {!loading && (
                  <span className="ml-2 text-base font-normal text-muted">
                    ({todos.length})
                  </span>
                )}
              </h3>
            </div>

            {/* Task list */}
            {loading ? (
              <Spinner />
            ) : todos.length === 0 ? (
              <EmptyState
                title={search ? "No matching tasks" : "No tasks yet"}
                description={
                  search
                    ? "Try a different search term or clear filters."
                    : 'Click "New Task" to create your first task.'
                }
                action={
                  !search && (
                    <button
                      className="btn-primary"
                      onClick={() => setShowForm(true)}
                    >
                      ✦ New Task
                    </button>
                  )
                }
              />
            ) : (
              <div className="space-y-3">
                {todos.map((todo, i) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    index={i}
                    onToggle={handleToggle}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Clear completed */}
          {stats?.completed > 0 && (
            <div className="mt-8 text-center">
              <button
                className="btn-secondary text-secondary"
                onClick={handleClearCompletedRequest}
              >
                Clear {stats.completed} completed task
                {stats.completed > 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-24 space-y-4 animate-slide-up">
            <MiniCalendar
              todos={calendarTodos}
              selectedDate={selectedCalendarDate}
              onSelectDate={setSelectedCalendarDate}
            />
            <UpcomingPanel todos={calendarTodos} />
          </div>
        </aside>
      </div>
    </Layout>
  );
}
