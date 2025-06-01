/**
 * Todoアイテムを表すエンティティ
 */
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

/**
 * 新しいTodoアイテム作成時のデータ構造
 */
export type TodoCreateDTO = {
  title: string;
};

/**
 * Todoアイテム更新時のデータ構造
 */
export type TodoUpdateDTO = {
  id: string;
  title?: string;
  completed?: boolean;
};
