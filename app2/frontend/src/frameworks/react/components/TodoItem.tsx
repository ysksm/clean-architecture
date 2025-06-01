import React, { useState } from 'react';
import type { TodoViewModel } from '../../../adapters/presenters/TodoPresenter';

interface TodoItemProps {
  todo: TodoViewModel;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}

export function TodoItem({ todo, onToggleComplete, onDelete, onUpdateTitle }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleToggleComplete = () => {
    onToggleComplete(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editTitle.trim() !== '') {
      onUpdateTitle(todo.id, editTitle);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="todo-item" data-testid="todo-item">
      <div className="todo-item-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="todo-checkbox"
          aria-label={`${todo.completed ? '完了済み' : '未完了'}: ${todo.title}`}
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="todo-edit-input"
            autoFocus
            placeholder="Todoを入力"
            aria-label="Todoを編集"
          />
        ) : (
          <div 
            className={`todo-title ${todo.completed ? 'completed' : ''}`}
            onClick={handleEdit}
          >
            {todo.title}
          </div>
        )}
        
        <div className="todo-date">{todo.createdAt}</div>
      </div>
      
      <div className="todo-actions">
        {!isEditing && (
          <>
            <button
              onClick={handleEdit}
              className="edit-button"
              aria-label={`${todo.title}を編集`}
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="delete-button"
              aria-label={`${todo.title}を削除`}
            >
              削除
            </button>
          </>
        )}
        
        {isEditing && (
          <>
            <button onClick={handleSave} className="save-button">
              保存
            </button>
            <button onClick={handleCancel} className="cancel-button">
              キャンセル
            </button>
          </>
        )}
      </div>
    </div>
  );
}
