import React from 'react';
import { TodoEntity } from '../../domain/entities/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: TodoEntity[];
  loading: boolean;
  error: string | null;
  onComplete: (id: string) => Promise<void>;
  onUncomplete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string, description?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoList({ 
  todos, 
  loading, 
  error, 
  onComplete, 
  onUncomplete, 
  onUpdate, 
  onDelete 
}: TodoListProps) {
  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (todos.length === 0) {
    return <div className="empty-state">No todos yet. Add one above!</div>;
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const incompleteTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todo-list">
      {incompleteTodos.length > 0 && (
        <div className="todo-section">
          <h2 className="section-title">Active Todos ({incompleteTodos.length})</h2>
          <div className="todos">
            {incompleteTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onComplete={onComplete}
                onUncomplete={onUncomplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div className="todo-section">
          <h2 className="section-title">Completed Todos ({completedTodos.length})</h2>
          <div className="todos">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onComplete={onComplete}
                onUncomplete={onUncomplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
