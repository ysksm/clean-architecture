import type { ITodoRepository } from '../../domain/repositories/ITodoRepository.ts';
import { Todo } from '../../domain/entities/Todo.ts';

export class GetTodosUseCase {
  private todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }
}
