import React, { useState } from 'react';

interface TodoFormProps {
  onAddTodo: (title: string) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTodo(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいTodoを追加"
        style={{ padding: '8px', marginRight: '10px', width: '300px' }}
      />
      <button type="submit" style={{ padding: '8px 15px' }}>
        追加
      </button>
    </form>
  );
};
