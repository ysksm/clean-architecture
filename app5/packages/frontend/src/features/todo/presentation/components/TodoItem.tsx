import React from 'react';

interface TodoPrimitive {
  id: string;
  title: string;
  status: 'pending' | 'completed';
}

interface TodoItemProps {
  todo: TodoPrimitive;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete }) => {
  const handleToggle = () => {
    onToggleComplete(todo.id, todo.status === 'pending');
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input
        type="checkbox"
        checked={todo.status === 'completed'}
        onChange={handleToggle}
        style={{ marginRight: '10px' }}
      />
      <span style={{ textDecoration: todo.status === 'completed' ? 'line-through' : 'none', flexGrow: 1 }}>
        {todo.title}
      </span>
      <button onClick={handleDelete} style={{ marginLeft: '10px', padding: '5px 10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
        削除
      </button>
    </li>
  );
};
