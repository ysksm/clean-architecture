/**
 * Todoエンティティ
 * アプリケーションのコアとなるビジネスルールを表現するエンティティ
 */
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

/**
 * 新しいTodoを作成するためのデータ型
 */
export interface CreateTodoDTO {
  title: string;
}

/**
 * Todoを更新するためのデータ型
 */
export interface UpdateTodoDTO {
  id: string;
  title?: string;
  completed?: boolean;
}
