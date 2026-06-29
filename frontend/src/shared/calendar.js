const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function toDateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a, b) {
  return toDateKey(a) === toDateKey(b);
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function getMonthLabel(year, month) {
  return `${MONTHS[month]} ${year}`;
}

export function getWeekdayLabels() {
  return WEEKDAYS;
}

export function getCalendarDays(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const days = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    days.push({
      date,
      dateKey: toDateKey(date),
      isCurrentMonth: date.getMonth() === month,
      isToday: isToday(date),
    });
  }
  return days;
}

export function groupTodosByDueDate(todos) {
  const map = {};
  for (const todo of todos) {
    if (!todo.dueDate) continue;
    const key = todo.dueDate.split('T')[0];
    if (!map[key]) map[key] = [];
    map[key].push(todo);
  }
  return map;
}

export function getUpcomingTodos(todos, days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() + days);

  return todos
    .filter((t) => {
      if (!t.dueDate || t.completed) return false;
      const due = parseDateKey(t.dueDate.split('T')[0]);
      return due >= today && due <= end;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export const PRIORITY_DOT = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-emerald-400',
};

export const PRIORITY_RING = {
  high: 'ring-red-400/40',
  medium: 'ring-amber-400/40',
  low: 'ring-emerald-400/40',
};
