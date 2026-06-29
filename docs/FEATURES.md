# ZipTodo — Features & Functionality

This document describes every feature implemented in the ZipTodo application. All features listed here are functional and tested.

---

## Application Overview

ZipTodo is a professional task management application with a modern dark-themed UI. It uses a **multi-page architecture** (not a single-page app): each page is a separate HTML document with its own React entry point, navigated via standard browser links and query parameters.

---

## Page 1: Todo List (`/todos`)

### Dashboard Statistics

- **Total tasks** — count of all todos
- **Active tasks** — incomplete todos
- **Completed tasks** — finished todos
- **Overdue tasks** — active todos past their due date

Stats update in real time after any CRUD operation.

### Create Todo

Users can create a new todo with:

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Short task name |
| Description | No | Longer notes or details |
| Priority | No | Low / Medium / High (default: Medium) |
| Due Date | No | Calendar date picker |
| Tags | No | Comma-separated labels (e.g. `work, urgent`) |

Validation errors from the API are displayed inline.

### List & Display

Each todo card shows:

- Custom checkbox to toggle completion
- Title (links to detail page)
- Priority badge (color-coded)
- Overdue indicator
- Description preview (truncated to 2 lines)
- Due date
- Tags

Completed todos appear with reduced opacity and strikethrough title.

### Toggle Completion

Click the checkbox on any todo to mark it complete or incomplete. Updates persist immediately via PATCH API.

### Delete Todo

Hover over a todo card to reveal the delete button. Confirmation dialog prevents accidental deletion.

### Filter

Three filter tabs:

- **All** — every todo
- **Active** — incomplete only
- **Completed** — finished only

### Search

Real-time text search across title and description fields (server-side).

### Sort

Three sort options:

- **Newest first** — by creation date (default)
- **By priority** — High → Medium → Low
- **By due date** — earliest due date first

### Clear Completed

Bulk-delete all completed todos with one click (with confirmation).

### Navigation

- Click any todo title or the view icon to open the detail page
- Header logo links back to the list

---

## Page 2: Todo Detail (`/todo?id=<todo-id>`)

Receives the todo ID as a **query parameter** (`?id=...`) as required.

### View Mode

Displays full todo information:

- Title with completion checkbox
- Priority badge
- Completed / Overdue status badges
- Full description
- Due date, priority, created date, last updated date
- Tags
- Task ID (UUID)

### Edit Mode

Click **Edit** to switch to an inline form with all editable fields:

- Title, description, priority, due date, tags
- Completed checkbox

Save persists via PUT API. Cancel returns to view mode.

### Toggle Completion

Checkbox in the header toggles complete/incomplete without entering edit mode.

### Delete

Deletes the todo and redirects to the list page.

### Error Handling

- Missing `?id` parameter shows a clear error message
- Invalid/deleted ID shows "Task Not Found" with link back to list

---

## Calendar on Tasks Page

The tasks page includes an integrated calendar (no separate calendar tab or page):

- **Mini calendar** — month view with priority dots on due dates
- **Month navigation** — previous / next month and jump to today
- **Upcoming panel** — tasks due in the next 7 days
- Visible on all screen sizes (sidebar on desktop, below task list on mobile)

---

## UI / UX Features

- **Light minimal design** with clear section partitions
- **Responsive layout** — works on mobile and desktop
- **Smooth animations** — fade-in, slide-up on load
- **Custom checkbox styling**
- **Color-coded priority badges** (red/amber/green)
- **Hover actions** on todo cards
- **Loading spinners** during API calls
- **Empty states** with helpful messaging
- **Confirmation dialogs** for destructive actions
- **Inter & Outfit fonts** for modern typography

---

## Backend Features

- Full CRUD REST API for todos
- JSON file persistence (`backend/data/todos.json`)
- Input validation on create/update
- Query filters: status, search, tag, sort
- Stats endpoint for dashboard counts
- CORS enabled for development
- Serves built frontend in production
- Health check endpoint

See [API.md](./API.md) for full endpoint documentation.

---

## Multi-Page Architecture (Not SPA)

This app intentionally avoids client-side routing libraries (no React Router).

| Aspect | Implementation |
|--------|---------------|
| List page | `todos.html` → `src/pages/todos/main.jsx` |
| Detail page | `todo.html` → `src/pages/todo-detail/main.jsx` |
| Navigation | Standard `<a href>` links between pages |
| Detail ID | URL query parameter `?id=<uuid>` |
| Build | Vite multi-page build with separate entry points |

This means each page is a full browser navigation — true multi-page, not SPA.

---

## Seed Data

Three sample todos are pre-loaded in `backend/data/todos.json` for immediate demonstration.
