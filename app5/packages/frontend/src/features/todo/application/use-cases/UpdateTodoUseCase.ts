import type { ITodoRepository } from '../../domain/repositories/ITodoRepository.ts';
import { TodoId } from '../../domain/value-objects/TodoId.ts';
import { TodoTitle } from '../../domain/value-objects/TodoTitle.ts';

export class UpdateTodoUseCase {
  private todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(id: string, title?: string, completed?: boolean): Promise<void> {
    const todoId = TodoId.create(id);
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      throw new Error('Todo not found.');
    }

    if (title !== undefined) {
      todo.changeTitle(TodoTitle.create(title));
    }

    if (completed !== undefined) {
      if (completed) {
        todo.markAsCompleted();
      } else {
        todo.markAsPending();
      }
    }

    await this.todoRepository.save(todo);
  }
}
