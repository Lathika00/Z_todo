import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import todosRouter from './routes/todos.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/todos', todosRouter);

// Serve built frontend in production
const frontendDist = join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('/todos', (_req, res) => {
  res.sendFile(join(frontendDist, 'todos.html'));
});

app.get('/todo', (_req, res) => {
  res.sendFile(join(frontendDist, 'todo.html'));
});

app.get('/', (_req, res) => {
  res.redirect('/todos');
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`ZipTodo API running at http://localhost:${PORT}`);
});
