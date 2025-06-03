import { TodoEntity } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

export class InMemoryTodoRepository implements TodoRepository {
  private todos: Map<string, TodoEntity> = new Map();

  constructor(initialTodos: TodoEntity[] = []) {
    initialTodos.forEach(todo => {
      this.todos.set(todo.id, todo);
    });
  }

  async findAll(): Promise<TodoEntity[]> {
    return Array.from(this.todos.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: string): Promise<TodoEntity | null> {
    return this.todos.get(id) || null;
  }

  async save(todo: TodoEntity): Promise<TodoEntity> {
    this.todos.set(todo.id, todo);
    return todo;
  }

  async delete(id: string): Promise<void> {
    this.todos.delete(id);
  }

  // Helper methods for testing
  clear(): void {
    this.todos.clear();
  }

  size(): number {
    return this.todos.size;
  }
}
