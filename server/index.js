import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for todos
let todos = [
  { id: 1, text: 'Learn JavaScript', completed: true },
  { id: 2, text: 'Build a todo app', completed: false },
  { id: 3, text: 'Master Node.js', completed: false },
  { id: 4, text: 'Write tests', completed: true },
  { id: 5, text: 'Deploy to production', completed: false }
];

let nextId = 6;

// Filter todos based on query parameter
function filterTodos(todos, filter) {
  if (filter === 'active') {
    return todos.filter(todo => !todo.completed);
  }
  if (filter === 'completed') {
    return todos.filter(todo => todo.completed);
  }
  // 'all' or no filter - return all todos
  return todos;
}

// GET /todos - Get all todos with optional filtering
app.get('/todos', (req, res) => {
  const filter = req.query.filter || 'all';
  const filteredTodos = filterTodos(todos, filter);
  res.json({
    todos: filteredTodos,
    filter: filter
  });
});

// POST /todos - Create a new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newTodo = {
    id: nextId++,
    text,
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH /todos/:id - Update a todo
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (req.body.hasOwnProperty('completed')) {
    todo.completed = req.body.completed;
  }
  if (req.body.hasOwnProperty('text')) {
    todo.text = req.body.text;
  }

  res.json(todo);
});

// DELETE /todos/:id - Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

// Export for testing
export { app, filterTodos, todos };

// Start server only if not being imported
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
