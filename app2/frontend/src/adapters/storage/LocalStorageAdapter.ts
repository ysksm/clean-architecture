import type { Todo, CreateTodoDTO, UpdateTodoDTO } from '../../core/entities/Todo';
import type { TodoRepository } from '../../core/repositories/TodoRepository';

/**
 * ブラウザのLocalStorageを使用したTodoリポジトリの実装
 */
export class LocalStorageAdapter implements TodoRepository {
  private readonly storageKey = 'todos';

  /**
   * すべてのTodoを取得
   */
  async getAll(): Promise<Todo[]> {
    const todosJson = localStorage.getItem(this.storageKey);
    if (!todosJson) {
      return [];
    }
    
    try {
      const todos = JSON.parse(todosJson) as Todo[];
      // 日付文字列をDateオブジェクトに変換
      return todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    } catch (error) {
      console.error('LocalStorageからのTodo取得に失敗しました:', error);
      return [];
    }
  }

  /**
   * 指定されたIDのTodoを取得
   */
  async getById(id: string): Promise<Todo | null> {
    const todos = await this.getAll();
    const todo = todos.find(todo => todo.id === id);
    return todo || null;
  }

  /**
   * 新しいTodoを作成
   */
  async create(todoData: CreateTodoDTO): Promise<Todo> {
    const todos = await this.getAll();
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: todoData.title,
      completed: false,
      createdAt: new Date()
    };
    
    const updatedTodos = [...todos, newTodo];
    this.saveTodos(updatedTodos);
    
    return newTodo;
  }

  /**
   * 既存のTodoを更新
   */
  async update(todoData: UpdateTodoDTO): Promise<Todo | null> {
    const todos = await this.getAll();
    const todoIndex = todos.findIndex(todo => todo.id === todoData.id);
    
    if (todoIndex === -1) {
      return null;
    }
    
    const updatedTodo = {
      ...todos[todoIndex],
      ...todoData
    };
    
    todos[todoIndex] = updatedTodo;
    this.saveTodos(todos);
    
    return updatedTodo;
  }

  /**
   * 指定されたIDのTodoを削除
   */
  async delete(id: string): Promise<boolean> {
    const todos = await this.getAll();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    
    if (filteredTodos.length === todos.length) {
      return false;
    }
    
    this.saveTodos(filteredTodos);
    return true;
  }

  /**
   * TodosをLocalStorageに保存
   */
  private saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(todos));
    } catch (error) {
      console.error('TodosのLocalStorageへの保存に失敗しました:', error);
    }
  }
}
