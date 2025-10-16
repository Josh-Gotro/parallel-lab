import { test } from 'node:test';
import assert from 'node:assert';
import { filterTodos } from './index.js';

test('filterTodos - returns all todos when filter is "all"', () => {
  const todos = [
    { id: 1, text: 'Task 1', completed: true },
    { id: 2, text: 'Task 2', completed: false },
    { id: 3, text: 'Task 3', completed: false }
  ];

  const result = filterTodos(todos, 'all');
  assert.strictEqual(result.length, 3);
});

test('filterTodos - returns only active todos when filter is "active"', () => {
  const todos = [
    { id: 1, text: 'Task 1', completed: true },
    { id: 2, text: 'Task 2', completed: false },
    { id: 3, text: 'Task 3', completed: false }
  ];

  const result = filterTodos(todos, 'active');
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].id, 2);
  assert.strictEqual(result[1].id, 3);
  assert.strictEqual(result.every(t => !t.completed), true);
});

test('filterTodos - returns only completed todos when filter is "completed"', () => {
  const todos = [
    { id: 1, text: 'Task 1', completed: true },
    { id: 2, text: 'Task 2', completed: false },
    { id: 3, text: 'Task 3', completed: true }
  ];

  const result = filterTodos(todos, 'completed');
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].id, 1);
  assert.strictEqual(result[1].id, 3);
  assert.strictEqual(result.every(t => t.completed), true);
});

test('filterTodos - handles empty array', () => {
  const todos = [];
  const result = filterTodos(todos, 'all');
  assert.strictEqual(result.length, 0);
});

test('filterTodos - handles no completed todos', () => {
  const todos = [
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: false }
  ];

  const result = filterTodos(todos, 'completed');
  assert.strictEqual(result.length, 0);
});

test('filterTodos - handles no active todos', () => {
  const todos = [
    { id: 1, text: 'Task 1', completed: true },
    { id: 2, text: 'Task 2', completed: true }
  ];

  const result = filterTodos(todos, 'active');
  assert.strictEqual(result.length, 0);
});
