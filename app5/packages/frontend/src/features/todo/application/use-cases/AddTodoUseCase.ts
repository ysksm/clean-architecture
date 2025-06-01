import type { ITodoRepository } from '../../domain/repositories/ITodoRepository.ts';
import { Todo } from '../../domain/entities/Todo.ts';
import { TodoTitle } from '../../domain/value-objects/TodoTitle.ts';

export class AddTodoUseCase {
  private todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async execute(title: string): Promise<Todo> {
    const todoTitle = TodoTitle.create(title);
    const newTodo = Todo.new(todoTitle);
    await this.todoRepository.save(newTodo);
    return newTodo;
  }
}
