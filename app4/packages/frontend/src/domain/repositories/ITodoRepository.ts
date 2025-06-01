import { Todo } from '../entities/Todo.ts';
import { TodoId } from '../value-objects/TodoId.ts';

export interface ITodoRepository {
  findById(id: TodoId): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  delete(id: TodoId): Promise<void>;
}
