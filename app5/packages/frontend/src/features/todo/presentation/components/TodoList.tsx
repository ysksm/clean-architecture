import React from 'react';
import { TodoItem } from './TodoItem';

interface TodoPrimitive {
  id: string;
  title: string;
  status: 'pending' | 'completed';
}

interface TodoListProps {
  todos: TodoPrimitive[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onDelete }) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
