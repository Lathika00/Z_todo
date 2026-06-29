import { useState } from 'react';
import {
  getCalendarDays,
  getMonthLabel,
  getWeekdayLabels,
  groupTodosByDueDate,
  getUpcomingTodos,
  PRIORITY_DOT,
  toDateKey,
  parseDateKey,
} from './calendar';
import { todoDetailUrl } from './api';
import { PriorityBadge } from './components';

/* Priority dot colors for dark theme */
const PRIORITY_DOT_DARK = {
  high: 'bg-aurora-rose',
  medium: 'bg-aurora-cyan',
  low: 'bg-aurora-emerald',
};

function NavButton({ onClick, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-all hover:text-primary"
      style={{ background: 'transparent' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

export function MiniCalendar({ todos, selectedDate, onSelectDate, embedded = false, size = 'compact' }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const byDate = groupTodosByDueDate(todos);
  const days = getCalendarDays(viewYear, viewMonth);
  const weekdays = getWeekdayLabels();

  const goMonth = (delta) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null;

  const cellClass = size === 'large'
    ? 'calendar-day relative flex min-h-[72px] flex-col items-center justify-start rounded-xl p-1.5 pt-2 text-sm'
    : 'calendar-day relative flex aspect-square flex-col items-center justify-center rounded-lg text-xs';

  const inner = (
    <>
      {/* Month Navigation */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-display font-semibold text-primary ${size === 'large' ? 'text-lg' : 'text-sm'}`}>
          {getMonthLabel(viewYear, viewMonth)}
        </h3>
        <div className="flex gap-0.5">
          <NavButton onClick={() => goMonth(-1)} title="Previous month">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </NavButton>
          <NavButton
            onClick={() => {
              setViewYear(today.getFullYear());
              setViewMonth(today.getMonth());
              onSelectDate?.(today);
            }}
            title="Today"
          >
            <span className="text-[10px] font-bold">T</span>
          </NavButton>
          <NavButton onClick={() => goMonth(1)} title="Next month">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </NavButton>
        </div>
      </div>

      {/* Weekday headers */}
      <div className={`mb-1 grid grid-cols-7 ${size === 'large' ? 'gap-1' : 'gap-0.5'}`}>
        {weekdays.map((d) => (
          <div
            key={d}
            className={`py-1 text-center font-semibold uppercase tracking-wider text-muted ${size === 'large' ? 'text-xs' : 'text-[10px]'
              }`}
          >
            {size === 'large' ? d : d.charAt(0)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={`grid grid-cols-7 ${size === 'large' ? 'gap-1' : 'gap-0.5'}`}>
        {days.map(({ date, dateKey, isCurrentMonth, isToday: todayFlag }) => {
          const dayTodos = byDate[dateKey] || [];
          const isSelected = selectedKey === dateKey;
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const cellDate = parseDateKey(dateKey);
          const hasOverdue = cellDate < todayStart && dayTodos.some((t) => !t.completed);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate?.(date)}
              className={`${cellClass} transition-all cursor-pointer ${!isCurrentMonth ? 'text-muted' : 'text-secondary'}`}
              style={
                isSelected
                  ? {
                      background: '#7c3aed',
                      border: '2px solid #5b21b6',
                      color: 'white',
                      fontWeight: 700,
                      boxShadow: '3px 3px 0 #1e123d',
                    }
                  : todayFlag
                    ? {
                        boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.5)',
                        fontWeight: 700,
                        color: '#a78bfa',
                      }
                    : {}
              }
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span className={size === 'large' ? 'text-sm font-semibold' : ''}>{date.getDate()}</span>
              {dayTodos.length > 0 && size === 'large' && (
                <div className="mt-1 w-full space-y-0.5 overflow-hidden">
                  {dayTodos.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${t.completed
                        ? 'text-muted line-through'
                        : t.priority === 'high'
                          ? 'text-aurora-rose'
                          : t.priority === 'low'
                            ? 'text-aurora-emerald'
                            : 'text-aurora-cyan'
                        }`}
                      style={{
                        background: t.completed
                          ? 'var(--item-bg)'
                          : t.priority === 'high'
                            ? 'rgba(244, 63, 94, 0.12)'
                            : t.priority === 'low'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(6, 182, 212, 0.12)',
                      }}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTodos.length > 2 && (
                    <span className="text-[10px] text-muted">+{dayTodos.length - 2} more</span>
                  )}
                </div>
              )}
              {dayTodos.length > 0 && size === 'compact' && (
                <span className="mt-0.5 flex gap-0.5">
                  {dayTodos.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className={`h-1 w-1 rounded-full ${PRIORITY_DOT[t.priority] || PRIORITY_DOT.medium} ${t.completed ? 'opacity-30' : ''
                        }`}
                    />
                  ))}
                </span>
              )}
              {hasOverdue && !isSelected && (
                <span
                  className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full animate-glow-pulse"
                  style={{
                    background: '#f43f5e',
                    boxShadow: '0 0 6px rgba(244, 63, 94, 0.6)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );

  if (embedded) return inner;

  return <div className="glass-card p-4">{inner}</div>;
}

export function UpcomingPanel({ todos }) {
  const upcoming = getUpcomingTodos(todos, 7);

  return (
    <div className="glass-card mt-4 p-4">
      <h3 className="mb-3 font-display text-sm font-semibold text-primary">Upcoming</h3>
      {upcoming.length === 0 ? (
        <p className="text-xs text-muted">No tasks due in the next 7 days.</p>
      ) : (
        <ul className="space-y-2">
          {upcoming.map((todo) => (
            <li key={todo.id}>
              <a
                href={todoDetailUrl(todo.id)}
                className="group flex cursor-pointer items-start gap-3 rounded-[12px] p-3 transition-all"
                style={{
                  border: '1px solid var(--filter-btn-border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--focus-badge-border)';
                  e.currentTarget.style.background = 'var(--focus-badge-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--filter-btn-border)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[todo.priority]}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-secondary group-hover:text-aurora-violet transition-colors">
                    {todo.title}
                  </p>
                  <p className="text-[11px] text-muted">
                    {new Date(todo.dueDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DayTodoList({ date, todos, onToggle }) {
  if (!date) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div
          className="rounded-[16px] p-5"
          style={{
            background: 'var(--focus-badge-bg)',
            border: '1px solid var(--focus-badge-border)',
          }}
        >
          <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-muted">Select a date to view tasks</p>
      </div>
    );
  }

  const dateKey = toDateKey(date);
  const dayTodos = todos.filter((t) => t.dueDate?.split('T')[0] === dateKey);
  const label = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="animate-fade-in">
      <h3 className="mb-1 font-display text-lg font-semibold text-primary">{label}</h3>
      <p className="mb-4 text-sm text-muted">
        {dayTodos.length} task{dayTodos.length !== 1 ? 's' : ''} due
      </p>

      {dayTodos.length === 0 ? (
        <p
          className="rounded-[16px] p-5 backdrop-blur-md"
          style={{
            background: 'var(--filter-btn-bg)',
            border: '1px solid var(--filter-btn-border)',
          }}
        >
          No tasks scheduled for this day.
        </p>
      ) : (
        <ul className="space-y-2">
          {dayTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-start gap-3 rounded-xl p-3 transition-all ${todo.completed ? 'opacity-50' : ''}`}
              style={{
                background: 'var(--item-bg)',
                border: '1px solid var(--border-color)',
                borderLeft: '2px solid #64748b',
              }}
            >
              <input
                type="checkbox"
                className="todo-checkbox mt-0.5"
                checked={todo.completed}
                onChange={() => onToggle?.(todo)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={todoDetailUrl(todo.id)}
                    className={`text-sm font-medium hover:text-aurora-violet transition-colors ${todo.completed ? 'line-through text-muted' : 'text-primary'
                      }`}
                  >
                    {todo.title}
                  </a>
                  <PriorityBadge priority={todo.priority} />
                </div>
                {todo.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{todo.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CalendarLegend() {
  const items = [
    { label: 'High priority', color: PRIORITY_DOT.high },
    { label: 'Medium priority', color: PRIORITY_DOT.medium },
    { label: 'Low priority', color: PRIORITY_DOT.low },
  ];

  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${item.color}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
