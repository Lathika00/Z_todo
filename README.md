# Z_Todo 

A full-stack todo application built for the Ziptrrip technical recruitment process.

## Repository Structure

```
ziptrrip/
├── challenge-1/          # Technical Q&A + runnable JS/CSS demos
├── backend/              # Express.js REST API
├── frontend/             # Multi-page React application (Vite)
├── docs/                 # Feature & API documentation
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Development mode (two terminals)

**Terminal 1 — API server:**
```bash
cd backend
npm run dev
```
Runs at `http://localhost:3001`

**Terminal 2 — Frontend dev server:**
```bash
cd frontend
npm run dev
```
Runs at `http://localhost:5173`

Open `http://localhost:5173/todos.html` in your browser.

### 3. Production build

```bash
cd frontend && npm run build
cd ../backend && npm start
```

Open `http://localhost:3001/todos`

---

## Challenge 1

All five technical questions are answered in [`challenge-1/ANSWERS.md`](challenge-1/ANSWERS.md).

Runnable JavaScript:
```bash
node challenge-1/q1-pattern.js
node challenge-1/q2-reverse-string.js
node challenge-1/q3-remove-duplicates.js
```

CSS layout demo: open `challenge-1/q5-layout.html` in a browser.

---

## Challenge 2 — ZipTodo Application

### Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Storage | JSON file (`backend/data/todos.json`) |
| Pages | Multi-page (not SPA) — separate HTML entry points |

### Pages

| Page | URL (dev) | URL (prod) | Description |
|------|-----------|------------|-------------|
| Todo List | `/todos.html` | `/todos` | Create, filter, search, and manage todos |
| Todo Detail | `/todo.html?id=<id>` | `/todo?id=<id>` | View and edit a single todo |

### Documentation

- [Features & Functionality](docs/FEATURES.md)
- [API Reference](docs/API.md)

