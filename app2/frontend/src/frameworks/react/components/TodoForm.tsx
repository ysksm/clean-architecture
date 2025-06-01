import React, { useState } from 'react';

interface TodoFormProps {
  onAddTodo: (title: string) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAddTodo(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいTodoを入力"
        className="todo-input"
        aria-label="新しいTodoを入力"
      />
      <button 
        type="submit" 
        className="add-button"
        disabled={!title.trim()}
      >
        追加
      </button>
    </form>
  );
}
