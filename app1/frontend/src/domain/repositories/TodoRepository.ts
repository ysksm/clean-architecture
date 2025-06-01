import { Todo, TodoCreateDTO, TodoUpdateDTO } from '../entities/Todo';

/**
 * Todoリポジトリのインターフェース
 * データの永続化や取得の抽象化を行う
 */
export interface TodoRepository {
  /**
   * すべてのTodoアイテムを取得
   */
  getAll(): Promise<Todo[]>;
  
  /**
   * 指定されたIDのTodoアイテムを取得
   */
  getById(id: string): Promise<Todo | null>;
  
  /**
   * 新しいTodoアイテムを作成
   */
  create(data: TodoCreateDTO): Promise<Todo>;
  
  /**
   * Todoアイテムを更新
   */
  update(data: TodoUpdateDTO): Promise<Todo | null>;
  
  /**
   * Todoアイテムを削除
   */
  delete(id: string): Promise<boolean>;
}
