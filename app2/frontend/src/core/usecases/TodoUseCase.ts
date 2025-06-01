import type { Todo, CreateTodoDTO, UpdateTodoDTO } from '../entities/Todo';
import type { TodoRepository } from '../repositories/TodoRepository';

/**
 * Todoに関するユースケースを実装するクラス
 * アプリケーションの主要なビジネスロジックを担当
 */
export class TodoUseCase {
  private repository: TodoRepository;

  constructor(repository: TodoRepository) {
    this.repository = repository;
  }

  /**
   * すべてのTodoを取得
   */
  async getAllTodos(): Promise<Todo[]> {
    return this.repository.getAll();
  }

  /**
   * 指定されたIDのTodoを取得
   */
  async getTodoById(id: string): Promise<Todo | null> {
    return this.repository.getById(id);
  }

  /**
   * 新しいTodoを作成
   */
  async createTodo(todoData: CreateTodoDTO): Promise<Todo> {
    if (!todoData.title.trim()) {
      throw new Error('Todoのタイトルは空にできません');
    }
    
    return this.repository.create(todoData);
  }

  /**
   * Todoの完了状態を切り替え
   */
  async toggleTodoCompletion(id: string): Promise<Todo | null> {
    const todo = await this.repository.getById(id);
    
    if (!todo) {
      return null;
    }
    
    return this.repository.update({
      id,
      completed: !todo.completed
    });
  }

  /**
   * Todoのタイトルを更新
   */
  async updateTodoTitle(id: string, title: string): Promise<Todo | null> {
    if (!title.trim()) {
      throw new Error('Todoのタイトルは空にできません');
    }
    
    return this.repository.update({
      id,
      title
    });
  }

  /**
   * 指定されたIDのTodoを削除
   */
  async deleteTodo(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
