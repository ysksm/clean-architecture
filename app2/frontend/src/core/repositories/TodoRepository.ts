import type { Todo, CreateTodoDTO, UpdateTodoDTO } from '../entities/Todo';

/**
 * Todoリポジトリのインターフェース
 * データの永続化に関する抽象的な操作を定義
 */
export interface TodoRepository {
  /**
   * すべてのTodoを取得
   */
  getAll(): Promise<Todo[]>;
  
  /**
   * 指定されたIDのTodoを取得
   */
  getById(id: string): Promise<Todo | null>;
  
  /**
   * 新しいTodoを作成
   */
  create(todoData: CreateTodoDTO): Promise<Todo>;
  
  /**
   * 既存のTodoを更新
   */
  update(todoData: UpdateTodoDTO): Promise<Todo | null>;
  
  /**
   * 指定されたIDのTodoを削除
   */
  delete(id: string): Promise<boolean>;
}
