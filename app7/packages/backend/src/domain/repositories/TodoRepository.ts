import { TodoEntity } from '../entities/Todo';

export interface TodoRepository {
  findAll(): Promise<TodoEntity[]>;
  findById(id: string): Promise<TodoEntity | null>;
  save(todo: TodoEntity): Promise<TodoEntity>;
  delete(id: string): Promise<void>;
}
