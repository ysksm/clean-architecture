import { useTodoPresenter } from '../presenters/TodoPresenter';
import { TodoItem } from './TodoItem';
import { useState } from 'react';

/**
 * Todoリストを表示するコンポーネント
 */
export const TodoList = () => {
  const { todos, isLoading, error, addTodo } = useTodoPresenter();
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // 新しいTodoアイテムの追加
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim() !== '') {
      addTodo(newTodoTitle);
      setNewTodoTitle('');
    }
  };

  // ローディング中表示
  if (isLoading && todos.length === 0) {
    return <div className="loading">読み込み中...</div>;
  }

  // エラー表示
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="todo-list-container">
      <h2>ToDoリスト</h2>
      
      {/* 新しいTodoアイテム追加フォーム */}
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="todo-input"
        />
        <button type="submit" className="btn add-btn">
          追加
        </button>
      </form>

      {/* Todoリスト */}
      {todos.length === 0 ? (
        <p className="empty-message">タスクがありません。新しいタスクを追加してください。</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
      
      {/* 統計情報 */}
      <div className="todo-stats">
        <p>
          合計: {todos.length} タスク, 完了: {todos.filter(todo => todo.completed).length} タスク
        </p>
      </div>
    </div>
  );
};
