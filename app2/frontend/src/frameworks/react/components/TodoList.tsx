import React from 'react';
import { TodoItem } from './TodoItem';
import type { TodoViewModel } from '../../../adapters/presenters/TodoPresenter';

interface TodoListProps {
  todos: TodoViewModel[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

export function TodoList({ todos, onToggleComplete, onDelete, onUpdateTitle }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>Todoがありません</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdateTitle={onUpdateTitle}
        />
      ))}
    </div>
  );
}
