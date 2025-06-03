import { TodoEntity } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

export class TodoUseCase {
  constructor(private todoRepository: TodoRepository) {}

  async getAllTodos(): Promise<TodoEntity[]> {
    return await this.todoRepository.findAll();
  }

  async getTodoById(id: string): Promise<TodoEntity | null> {
    return await this.todoRepository.findById(id);
  }

  async createTodo(title: string, description?: string): Promise<TodoEntity> {
    const todo = TodoEntity.create(title, description);
    return await this.todoRepository.save(todo);
  }

  async updateTodo(id: string, title?: string, description?: string): Promise<TodoEntity> {
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    let updatedTodo = existingTodo;
    if (title !== undefined) {
      updatedTodo = updatedTodo.updateTitle(title);
    }
    if (description !== undefined) {
      updatedTodo = updatedTodo.updateDescription(description);
    }

    return await this.todoRepository.save(updatedTodo);
  }

  async completeTodo(id: string): Promise<TodoEntity> {
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    const completedTodo = existingTodo.complete();
    return await this.todoRepository.save(completedTodo);
  }

  async uncompleteTodo(id: string): Promise<TodoEntity> {
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    const uncompletedTodo = existingTodo.uncomplete();
    return await this.todoRepository.save(uncompletedTodo);
  }

  async deleteTodo(id: string): Promise<void> {
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    await this.todoRepository.delete(id);
  }
}
