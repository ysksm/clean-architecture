import type { ITodoRepository } from '../../domain/repositories/ITodoRepository.ts';
import { Todo } from '../../domain/entities/Todo.ts';
import { TodoId } from '../../domain/value-objects/TodoId.ts';

export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Map<string, Todo>;

  constructor() {
    this.todos = new Map<string, Todo>();
  }

  async findById(id: TodoId): Promise<Todo | null> {
    return this.todos.get(id.value) || null;
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values());
  }

  async save(todo: Todo): Promise<void> {
    const newTodos = new Map(this.todos);
    newTodos.set(todo.id.value, todo);
    this.todos = newTodos;
  }

  async delete(id: TodoId): Promise<void> {
    const newTodos = new Map(this.todos);
    newTodos.delete(id.value);
    this.todos = newTodos;
  }
}
