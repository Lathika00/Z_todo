import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '../../data/todos.json');

async function ensureDataFile() {
  try {
    await readFile(DATA_FILE, 'utf-8');
  } catch {
    await mkdir(dirname(DATA_FILE), { recursive: true });
    await writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

export async function readTodos() {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

export async function writeTodos(todos) {
  await ensureDataFile();
  await writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}
