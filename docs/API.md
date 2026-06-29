# ZipTodo — API Reference

Base URL: `http://localhost:3001/api`

All request/response bodies are JSON.

---

## Health Check

### `GET /api/health`

Returns server status.

**Response `200`:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-29T12:00:00.000Z"
}
```

---

## Todos

### `GET /api/todos`

List all todos with optional filters.

**Query parameters:**

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `active`, `completed` | Filter by completion |
| `search` | string | Search title and description |
| `tag` | string | Filter by exact tag match |
| `sort` | `createdAt`, `priority`, `dueDate` | Sort order |

**Response `200`:** Array of todo objects.

```json
[
  {
    "id": "uuid",
    "title": "Task title",
    "description": "Optional description",
    "completed": false,
    "priority": "medium",
    "dueDate": "2026-07-01",
    "tags": ["work"],
    "createdAt": "2026-06-29T10:00:00.000Z",
    "updatedAt": "2026-06-29T10:00:00.000Z"
  }
]
```

---

### `GET /api/todos/stats`

Dashboard statistics.

**Response `200`:**
```json
{
  "total": 10,
  "active": 6,
  "completed": 4,
  "overdue": 2
}
```

---

### `GET /api/todos/:id`

Get a single todo by ID.

**Response `200`:** Todo object.

**Response `404`:**
```json
{ "error": "Todo not found" }
```

---

### `POST /api/todos`

Create a new todo.

**Request body:**
```json
{
  "title": "Required string",
  "description": "Optional string",
  "priority": "low | medium | high",
  "dueDate": "YYYY-MM-DD or null",
  "tags": ["array", "of", "strings"]
}
```

**Response `201`:** Created todo object.

**Response `400`:**
```json
{ "errors": ["title is required and must be a non-empty string"] }
```

---

### `PUT /api/todos/:id`

Full update of a todo.

**Request body:** Same as POST, plus `completed` (boolean).

**Response `200`:** Updated todo object.

**Response `404`:** Todo not found.

---

### `PATCH /api/todos/:id`

Partial update (e.g. toggle completion).

**Request body:** Any subset of todo fields.

**Example — toggle complete:**
```json
{ "completed": true }
```

**Response `200`:** Updated todo object.

---

### `DELETE /api/todos/:id`

Delete a todo.

**Response `200`:** Deleted todo object.

**Response `404`:** Todo not found.

---

## Todo Object Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `title` | string | Task title |
| `description` | string | Task notes |
| `completed` | boolean | Completion status |
| `priority` | `"low"` \| `"medium"` \| `"high"` | Priority level |
| `dueDate` | string \| null | ISO date string (YYYY-MM-DD) |
| `tags` | string[] | Labels |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

---

## Data Persistence

Todos are stored in `backend/data/todos.json`. The file is read on every request and written on mutations. No database required.

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 404 | Resource not found |
| 500 | Internal server error |
