import { todosPageUrl } from './api';
import { useTheme } from './ThemeContext';

export function Layout({ children, activePage = 'todos' }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="relative min-h-screen">
      {/* Aurora animated background */}
      <div className="aurora-bg" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        <header className="sticky top-0 z-50 header-bg" style={{
          borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
        }}>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <a href={todosPageUrl()} className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-lg transition-all group-hover:scale-110 logo-bg">
                ✓
              </div>
              <div>
                <h1 className="font-display text-xl font-bold tracking-tight text-gradient-violet-cyan">Planora</h1>
                <p className="text-xs text-muted">Daily planner, beautifully done</p>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold focus-mode-badge">
                <span className="h-2 w-2 rounded-full bg-aurora-violet animate-glow-pulse" />
                Focus mode
              </span>
              <button 
                onClick={toggleTheme} 
                className="theme-toggle-btn group flex h-10 w-10 items-center justify-center rounded-xl transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PriorityBadge({ priority }) {
  const classes = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };
  const labels = { high: 'High', medium: 'Medium', low: 'Low' };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${classes[priority] || classes.medium}`}>
      {labels[priority] || priority}
    </span>
  );
}

export function TagList({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{
            background: 'var(--filter-btn-bg)',
            border: '1px solid var(--filter-btn-border)',
            color: 'var(--text-muted)'
          }}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="orbital-spinner">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl text-3xl animate-float"
        style={{
          background: 'rgba(124, 58, 237, 0.18)',
          border: '2px solid rgba(124, 58, 237, 0.45)',
          boxShadow: '4px 4px 0 rgba(30, 18, 61, 0.75)',
        }}>
        ⊚
      </div>
      <h3 className="text-section-title">{title}</h3>
      <p className="mt-2 max-w-sm text-body-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0"
        style={{
          background: 'var(--modal-overlay)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative z-10 w-full max-w-lg animate-scale-in rounded-[20px] p-6"
        style={{
          background: 'var(--modal-bg)',
          border: '1px solid var(--accent-border)',
          boxShadow: '0 0 60px rgba(139, 92, 246, 0.15), 0 24px 48px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
        }}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-section-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-all font-bold text-lg"
            style={{ 
              background: 'var(--filter-btn-bg)',
              color: 'var(--text-secondary)'
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0"
        style={{
          background: 'var(--modal-overlay)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onCancel}
        aria-label="Close dialog"
      />
      <div className="relative z-10 w-full max-w-md animate-scale-in rounded-[20px] p-6"
        style={{
          background: 'var(--modal-bg)',
          border: danger ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--glass-border)',
          boxShadow: danger
            ? '0 0 40px rgba(244, 63, 94, 0.1), 0 24px 48px rgba(0, 0, 0, 0.4)'
            : '0 24px 48px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
        }}>
        <h2 className="text-section-title">{title}</h2>
        <p className="mt-3 text-body leading-relaxed">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
