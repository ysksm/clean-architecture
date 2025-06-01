import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Todo } from '../../domain/entities/Todo';
import { TodoUseCase } from '../../application/usecases/TodoUseCase';

// TodoPresenterの型定義
interface TodoPresenterContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (title: string) => Promise<void>;
  updateTodoTitle: (id: string, title: string) => Promise<void>;
  toggleTodoCompleted: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

// TodoPresenterのコンテキスト作成
const TodoPresenterContext = createContext<TodoPresenterContextType | undefined>(undefined);

// TodoPresenterのプロパティ
interface TodoPresenterProps {
  children: ReactNode;
  todoUseCase: TodoUseCase;
}

/**
 * TodoPresenter - プレゼンテーション層とビジネスロジック層を橋渡しするコンポーネント
 */
export const TodoPresenter = ({ children, todoUseCase }: TodoPresenterProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初期ロード
  useEffect(() => {
    fetchTodos();
  }, []);

  // すべてのTodoアイテムを取得
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await todoUseCase.getAllTodos();
      setTodos(result);
    } catch (err) {
      setError('Todoリストの取得中にエラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 新しいTodoアイテムを追加
  const addTodo = async (title: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const newTodo = await todoUseCase.createTodo(title);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setError('Todoの追加中にエラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Todoアイテムのタイトルを更新
  const updateTodoTitle = async (id: string, title: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedTodo = await todoUseCase.updateTodoTitle(id, title);
      
      if (updatedTodo) {
        setTodos(prev => 
          prev.map(todo => todo.id === id ? updatedTodo : todo)
        );
      }
    } catch (err) {
      setError('Todoの更新中にエラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Todoアイテムの完了状態を更新
  const toggleTodoCompleted = async (id: string, completed: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedTodo = await todoUseCase.toggleTodoCompleted(id, completed);
      
      if (updatedTodo) {
        setTodos(prev => 
          prev.map(todo => todo.id === id ? updatedTodo : todo)
        );
      }
    } catch (err) {
      setError('Todoのステータス更新中にエラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Todoアイテムを削除
  const deleteTodo = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await todoUseCase.deleteTodo(id);
      
      if (success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      }
    } catch (err) {
      setError('Todoの削除中にエラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: TodoPresenterContextType = {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodoTitle,
    toggleTodoCompleted,
    deleteTodo
  };

  return (
    <TodoPresenterContext.Provider value={value}>
      {children}
    </TodoPresenterContext.Provider>
  );
};

/**
 * TodoPresenterコンテキストを使用するためのカスタムフック
 */
export const useTodoPresenter = (): TodoPresenterContextType => {
  const context = useContext(TodoPresenterContext);
  
  if (context === undefined) {
    throw new Error('useTodoPresenter must be used within a TodoPresenter');
  }
  
  return context;
};
