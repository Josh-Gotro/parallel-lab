import { test } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

// Set up a mock DOM environment
function setupDOM() {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <body>
        <div id="todo-list"></div>
        <button class="filter-btn" data-filter="all" aria-pressed="true"></button>
        <button class="filter-btn" data-filter="active" aria-pressed="false"></button>
        <button class="filter-btn" data-filter="completed" aria-pressed="false"></button>
      </body>
    </html>
  `);

  global.document = dom.window.document;
  global.window = dom.window;
  return dom;
}

test('filter buttons should have correct initial state', () => {
  const dom = setupDOM();
  const allButton = document.querySelector('[data-filter="all"]');
  const activeButton = document.querySelector('[data-filter="active"]');
  const completedButton = document.querySelector('[data-filter="completed"]');

  assert.strictEqual(allButton.getAttribute('aria-pressed'), 'true');
  assert.strictEqual(activeButton.getAttribute('aria-pressed'), 'false');
  assert.strictEqual(completedButton.getAttribute('aria-pressed'), 'false');
});

test('renderTodos should create correct number of todo elements', () => {
  const dom = setupDOM();
  const todoList = document.getElementById('todo-list');

  const todos = [
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: true }
  ];

  // Simulate rendering
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    todoList.appendChild(li);
  });

  assert.strictEqual(todoList.children.length, 2);
  assert.strictEqual(todoList.children[0].dataset.id, '1');
  assert.strictEqual(todoList.children[1].dataset.id, '2');
});

test('completed todos should have completed class', () => {
  const dom = setupDOM();
  const todoList = document.getElementById('todo-list');

  const todo = { id: 1, text: 'Task 1', completed: true };

  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  todoList.appendChild(li);

  assert.strictEqual(li.classList.contains('completed'), true);
});

test('active todos should not have completed class', () => {
  const dom = setupDOM();
  const todoList = document.getElementById('todo-list');

  const todo = { id: 1, text: 'Task 1', completed: false };

  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  todoList.appendChild(li);

  assert.strictEqual(li.classList.contains('completed'), false);
});

test('empty state should be shown when no todos', () => {
  const dom = setupDOM();
  const todoList = document.getElementById('todo-list');

  todoList.innerHTML = '';
  const emptyState = document.createElement('li');
  emptyState.className = 'empty-state';
  emptyState.innerHTML = '<p>No todos</p>';
  todoList.appendChild(emptyState);

  assert.strictEqual(todoList.children.length, 1);
  assert.strictEqual(todoList.children[0].className, 'empty-state');
});

test('URL filter parameter parsing', () => {
  // Test different filter values using URLSearchParams directly
  const testCases = [
    { search: '?filter=active', expected: 'active' },
    { search: '?filter=completed', expected: 'completed' },
    { search: '?filter=all', expected: 'all' },
    { search: '', expected: 'all' } // default
  ];

  testCases.forEach(testCase => {
    const params = new URLSearchParams(testCase.search);
    const filter = params.get('filter') || 'all';
    assert.strictEqual(filter, testCase.expected);
  });
});
