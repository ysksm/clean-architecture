import type { ITodoRepository } from '../../domain/repositories/ITodoRepository.ts';
import { TodoId } from '../../domain/value-objects/TodoId.ts';

export class DeleteTodoUseCase {
  private todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(id: string): Promise<void> {
    const todoId = TodoId.create(id);
    await this.todoRepository.delete(todoId);
  }
}
