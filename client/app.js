// Configuration
const API_URL = 'http://localhost:3001';
let currentFilter = 'all';

// DOM Elements
const todoList = document.getElementById('todo-list');
const addTodoForm = document.getElementById('add-todo-form');
const newTodoInput = document.getElementById('new-todo-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const statusMessage = document.getElementById('status-message');

// Initialize app
function init() {
  setupEventListeners();
  syncFilterFromURL();
  loadTodos();
}

// Set up event listeners
function setupEventListeners() {
  // Add todo form
  addTodoForm.addEventListener('submit', handleAddTodo);

  // Filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', handleFilterClick);
  });

  // Listen to URL changes (back/forward navigation)
  window.addEventListener('popstate', () => {
    syncFilterFromURL();
    loadTodos();
  });
}

// Sync filter from URL query parameter
function syncFilterFromURL() {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get('filter') || 'all';

  if (['all', 'active', 'completed'].includes(filter)) {
    currentFilter = filter;
    updateFilterButtons();
  }
}

// Update filter buttons aria-pressed state
function updateFilterButtons() {
  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === currentFilter;
    button.setAttribute('aria-pressed', isActive);
  });
}

// Handle filter button click
function handleFilterClick(event) {
  const filter = event.target.dataset.filter;

  if (filter === currentFilter) {
    return; // Already on this filter
  }

  currentFilter = filter;

  // Update URL without page reload
  const url = new URL(window.location);
  if (filter === 'all') {
    url.searchParams.delete('filter');
  } else {
    url.searchParams.set('filter', filter);
  }
  window.history.pushState({}, '', url);

  // Update UI
  updateFilterButtons();
  loadTodos();
}

// Load todos from server
async function loadTodos() {
  try {
    const response = await fetch(`${API_URL}/todos?filter=${currentFilter}`);

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    renderTodos(data.todos);
  } catch (error) {
    showStatus('Failed to load todos. Make sure the server is running.', 'error');
    console.error('Error loading todos:', error);
  }
}

// Render todos to the DOM
function renderTodos(todos) {
  // Clear existing todos
  todoList.innerHTML = '';

  if (todos.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `<p>No ${currentFilter === 'all' ? '' : currentFilter} todos</p>`;
    todoList.appendChild(emptyState);
    return;
  }

  // Render each todo
  todos.forEach(todo => {
    const li = createTodoElement(todo);
    todoList.appendChild(li);
  });
}

// Create a todo DOM element
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`);
  checkbox.addEventListener('change', () => handleToggleTodo(todo.id, !todo.completed));

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = todo.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'todo-delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('aria-label', `Delete "${todo.text}"`);
  deleteBtn.addEventListener('click', () => handleDeleteTodo(todo.id));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// Handle adding a new todo
async function handleAddTodo(event) {
  event.preventDefault();

  const text = newTodoInput.value.trim();
  if (!text) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    newTodoInput.value = '';
    newTodoInput.focus();
    await loadTodos();
    showStatus('Todo added successfully!', 'success');
  } catch (error) {
    showStatus('Failed to add todo', 'error');
    console.error('Error adding todo:', error);
  }
}

// Handle toggling a todo's completed status
async function handleToggleTodo(id, completed) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    await loadTodos();
  } catch (error) {
    showStatus('Failed to update todo', 'error');
    console.error('Error updating todo:', error);
  }
}

// Handle deleting a todo
async function handleDeleteTodo(id) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    await loadTodos();
    showStatus('Todo deleted', 'success');
  } catch (error) {
    showStatus('Failed to delete todo', 'error');
    console.error('Error deleting todo:', error);
  }
}

// Show status message
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message show ${type}`;

  setTimeout(() => {
    statusMessage.className = 'status-message';
  }, 3000);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderTodos,
    createTodoElement,
    updateFilterButtons
  };
}

// Start the app
init();
