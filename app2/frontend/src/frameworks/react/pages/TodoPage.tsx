import React, { useEffect, useState } from 'react';
import { TodoList } from '../components/TodoList';
import { TodoForm } from '../components/TodoForm';
import { TodoFilter } from '../components/TodoFilter';
import type { TodoViewModel, FilterType } from '../../../adapters/presenters/TodoPresenter';
import type { TodoController } from '../../../adapters/controllers/TodoController';

interface TodoPageProps {
  controller: TodoController;
}

export function TodoPage({ controller }: TodoPageProps) {
  const [todos, setTodos] = useState<TodoViewModel[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Todoの数を計算
  const todoCount = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  };

  // Todoの読み込み
  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedTodos = await controller.getAllTodos();
      setTodos(loadedTodos);
    } catch (err) {
      setError('Todoの読み込みに失敗しました');
      console.error('Todoの読み込みエラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    loadTodos();
  }, []);

  // フィルター変更時
  useEffect(() => {
    controller.setFilter(currentFilter);
    loadTodos();
  }, [currentFilter]);

  // Todoの追加
  const handleAddTodo = async (title: string) => {
    try {
      await controller.createTodo(title);
      loadTodos();
    } catch (err) {
      setError('Todoの追加に失敗しました');
      console.error('Todoの追加エラー:', err);
    }
  };

  // Todoの完了状態切り替え
  const handleToggleComplete = async (id: string) => {
    try {
      await controller.toggleTodoCompletion(id);
      loadTodos();
    } catch (err) {
      setError('Todoの更新に失敗しました');
      console.error('Todoの更新エラー:', err);
    }
  };

  // Todoのタイトル更新
  const handleUpdateTitle = async (id: string, title: string) => {
    try {
      await controller.updateTodoTitle(id, title);
      loadTodos();
    } catch (err) {
      setError('Todoの更新に失敗しました');
      console.error('Todoの更新エラー:', err);
    }
  };

  // Todoの削除
  const handleDeleteTodo = async (id: string) => {
    try {
      await controller.deleteTodo(id);
      loadTodos();
    } catch (err) {
      setError('Todoの削除に失敗しました');
      console.error('Todoの削除エラー:', err);
    }
  };

  // フィルター変更
  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
  };

  return (
    <div className="todo-page">
      <header className="todo-header">
        <h1>Todoアプリ</h1>
      </header>

      <main className="todo-main">
        <TodoForm onAddTodo={handleAddTodo} />

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">読み込み中...</div>
        ) : (
          <>
            <TodoFilter
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
              todoCount={todoCount}
            />

            <TodoList
              todos={todos}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
              onUpdateTitle={handleUpdateTitle}
            />
          </>
        )}
      </main>
    </div>
  );
}
