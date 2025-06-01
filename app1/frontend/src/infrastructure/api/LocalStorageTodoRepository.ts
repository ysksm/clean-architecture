import { Todo, TodoCreateDTO, TodoUpdateDTO } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { v4 as uuidv4 } from 'uuid';

/**
 * ローカルストレージを利用したTodoリポジトリの実装
 */
export class LocalStorageTodoRepository implements TodoRepository {
  private readonly STORAGE_KEY = 'todos';

  /**
   * ローカルストレージからすべてのTodoアイテムを取得
   */
  async getAll(): Promise<Todo[]> {
    const todosJSON = localStorage.getItem(this.STORAGE_KEY);
    if (!todosJSON) return [];
    
    try {
      const todos: Todo[] = JSON.parse(todosJSON);
      // Date文字列をDateオブジェクトに変換
      return todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    } catch (error) {
      console.error('Failed to parse todos from localStorage:', error);
      return [];
    }
  }

  /**
   * 指定されたIDのTodoアイテムを取得
   */
  async getById(id: string): Promise<Todo | null> {
    const todos = await this.getAll();
    const todo = todos.find(todo => todo.id === id);
    return todo || null;
  }

  /**
   * 新しいTodoアイテムを作成
   */
  async create(data: TodoCreateDTO): Promise<Todo> {
    const todos = await this.getAll();
    
    const newTodo: Todo = {
      id: uuidv4(),
      title: data.title,
      completed: false,
      createdAt: new Date()
    };
    
    todos.push(newTodo);
    this.saveToLocalStorage(todos);
    
    return newTodo;
  }

  /**
   * Todoアイテムを更新
   */
  async update(data: TodoUpdateDTO): Promise<Todo | null> {
    const todos = await this.getAll();
    const index = todos.findIndex(todo => todo.id === data.id);
    
    if (index === -1) return null;
    
    const updatedTodo: Todo = {
      ...todos[index],
      ...data
    };
    
    todos[index] = updatedTodo;
    this.saveToLocalStorage(todos);
    
    return updatedTodo;
  }

  /**
   * Todoアイテムを削除
   */
  async delete(id: string): Promise<boolean> {
    const todos = await this.getAll();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    
    if (filteredTodos.length === todos.length) return false;
    
    this.saveToLocalStorage(filteredTodos);
    return true;
  }

  /**
   * Todoリストをローカルストレージに保存
   */
  private saveToLocalStorage(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }
}
