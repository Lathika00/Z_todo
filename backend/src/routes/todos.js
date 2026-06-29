import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readTodos, writeTodos } from '../store/fileStore.js';

const router = Router();

const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateTodoBody(body, partial = false) {
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      errors.push('title is required and must be a non-empty string');
    }
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }

  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }

  if (body.priority !== undefined && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  if (body.dueDate !== undefined && body.dueDate !== null && body.dueDate !== '') {
    if (isNaN(Date.parse(body.dueDate))) {
      errors.push('dueDate must be a valid date string');
    }
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== 'string')) {
      errors.push('tags must be an array of strings');
    }
  }

  return errors;
}

// GET /api/todos — list all todos (optional ?status=active|completed|all)
router.get('/', async (req, res, next) => {
  try {
    let todos = await readTodos();
    const { status, search, tag, sort } = req.query;

    if (status === 'active') {
      todos = todos.filter((t) => !t.completed);
    } else if (status === 'completed') {
      todos = todos.filter((t) => t.completed);
    }

    if (search) {
      const q = search.toLowerCase();
      todos = todos.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
      );
    }

    if (tag) {
      todos = todos.filter((t) => t.tags?.includes(tag));
    }

    if (sort === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      todos.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sort === 'dueDate') {
      todos.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else {
      todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// GET /api/todos/stats — summary counts
router.get('/stats', async (req, res, next) => {
  try {
    const todos = await readTodos();
    res.json({
      total: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
      overdue: todos.filter(
        (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
      ).length,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/todos/:id
router.get('/:id', async (req, res, next) => {
  try {
    const todos = await readTodos();
    const todo = todos.find((t) => t.id === req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// POST /api/todos
router.post('/', async (req, res, next) => {
  try {
    const errors = validateTodoBody(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const now = new Date().toISOString();
    const todo = {
      id: uuidv4(),
      title: req.body.title.trim(),
      description: (req.body.description || '').trim(),
      completed: false,
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate || null,
      tags: req.body.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    const todos = await readTodos();
    todos.unshift(todo);
    await writeTodos(todos);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

// PUT /api/todos/:id — full update
router.put('/:id', async (req, res, next) => {
  try {
    const errors = validateTodoBody(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const todos = await readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });

    const updated = {
      ...todos[index],
      title: req.body.title.trim(),
      description: (req.body.description || '').trim(),
      completed: req.body.completed ?? todos[index].completed,
      priority: req.body.priority || todos[index].priority,
      dueDate: req.body.dueDate ?? todos[index].dueDate,
      tags: req.body.tags ?? todos[index].tags,
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updated;
    await writeTodos(todos);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/todos/:id — partial update (e.g. toggle complete)
router.patch('/:id', async (req, res, next) => {
  try {
    const errors = validateTodoBody(req.body, true);
    if (errors.length) return res.status(400).json({ errors });

    const todos = await readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });

    const updated = {
      ...todos[index],
      ...req.body,
      title: req.body.title !== undefined ? req.body.title.trim() : todos[index].title,
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updated;
    await writeTodos(todos);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const todos = await readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });

    const [removed] = todos.splice(index, 1);
    await writeTodos(todos);
    res.json(removed);
  } catch (err) {
    next(err);
  }
});

export default router;
