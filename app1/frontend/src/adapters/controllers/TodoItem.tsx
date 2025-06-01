import { useState } from 'react';
import { Todo } from '../../domain/entities/Todo';
import { useTodoPresenter } from '../presenters/TodoPresenter';

interface TodoItemProps {
  todo: Todo;
}

/**
 * 個々のTodoアイテムをレンダリングするコンポーネント
 */
export const TodoItem = ({ todo }: TodoItemProps) => {
  const { toggleTodoCompleted, updateTodoTitle, deleteTodo } = useTodoPresenter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  // 完了状態の切り替え
  const handleToggleComplete = () => {
    toggleTodoCompleted(todo.id, !todo.completed);
  };

  // 編集モードの開始
  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  // タイトル更新の保存
  const handleSave = () => {
    if (editTitle.trim() !== '') {
      updateTodoTitle(todo.id, editTitle);
      setIsEditing(false);
    }
  };

  // 編集のキャンセル
  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  // エンターキーを押したとき保存する
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="todo-checkbox"
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="todo-edit"
            autoFocus
          />
        ) : (
          <span
            className={`todo-title ${todo.completed ? 'completed' : ''}`}
            onClick={handleEdit}
          >
            {todo.title}
          </span>
        )}
      </div>
      
      <div className="todo-actions">
        {!isEditing && (
          <>
            <button onClick={handleEdit} className="btn edit-btn">
              編集
            </button>
            <button onClick={() => deleteTodo(todo.id)} className="btn delete-btn">
              削除
            </button>
          </>
        )}
        
        {isEditing && (
          <>
            <button onClick={handleSave} className="btn save-btn">
              保存
            </button>
            <button onClick={handleCancel} className="btn cancel-btn">
              キャンセル
            </button>
          </>
        )}
      </div>
    </li>
  );
};
