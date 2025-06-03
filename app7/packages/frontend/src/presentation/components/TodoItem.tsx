import React, { useState } from 'react';
import { TodoEntity } from '../../domain/entities/Todo';

interface TodoItemProps {
  todo: TodoEntity;
  onComplete: (id: string) => Promise<void>;
  onUncomplete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string, description?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoItem({ todo, onComplete, onUncomplete, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleToggleComplete = async () => {
    try {
      if (todo.completed) {
        await onUncomplete(todo.id);
      } else {
        await onComplete(todo.id);
      }
    } catch (error) {
      console.error('Failed to toggle todo completion:', error);
    }
  };

  const handleSave = async () => {
    try {
      await onUpdate(todo.id, editTitle, editDescription || undefined);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="todo-content">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title"
            placeholder="Todo title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-description"
            placeholder="Description (optional)"
            rows={2}
          />
        </div>
        <div className="todo-actions">
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="todo-checkbox"
          />
          <h3 className="todo-title">{todo.title}</h3>
        </div>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        <div className="todo-meta">
          <span className="todo-date">
            Created: {todo.createdAt.toLocaleDateString()}
          </span>
          {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
            <span className="todo-date">
              Updated: {todo.updatedAt.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)} className="edit-btn">
          Edit
        </button>
        <button onClick={handleDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}
