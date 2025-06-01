import { Todo, TodoCreateDTO, TodoUpdateDTO } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

/**
 * Todoアイテム関連のユースケースを管理するクラス
 */
export class TodoUseCase {
  private repository: TodoRepository;

  constructor(repository: TodoRepository) {
    this.repository = repository;
  }

  /**
   * すべてのTodoアイテムを取得
   */
  async getAllTodos(): Promise<Todo[]> {
    return this.repository.getAll();
  }

  /**
   * 指定されたIDのTodoアイテムを取得
   */
  async getTodoById(id: string): Promise<Todo | null> {
    return this.repository.getById(id);
  }

  /**
   * 新しいTodoアイテムを作成
   */
  async createTodo(title: string): Promise<Todo> {
    const todoData: TodoCreateDTO = {
      title: title.trim()
    };
    return this.repository.create(todoData);
  }

  /**
   * Todoアイテムのタイトルを更新
   */
  async updateTodoTitle(id: string, title: string): Promise<Todo | null> {
    const updateData: TodoUpdateDTO = {
      id,
      title: title.trim()
    };
    return this.repository.update(updateData);
  }

  /**
   * Todoアイテムの完了状態を更新
   */
  async toggleTodoCompleted(id: string, completed: boolean): Promise<Todo | null> {
    const updateData: TodoUpdateDTO = {
      id,
      completed
    };
    return this.repository.update(updateData);
  }

  /**
   * Todoアイテムを削除
   */
  async deleteTodo(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
