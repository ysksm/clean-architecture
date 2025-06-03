import { DIContainer } from './Container';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { JsonTodoRepository } from '../repositories/JsonTodoRepository';
import { TodoUseCase } from '../../application/usecases/TodoUseCase';
import { TodoController } from '../../presentation/controllers/TodoController';

// Service identifiers
export const TYPES = {
  TodoRepository: Symbol.for('TodoRepository'),
  TodoUseCase: Symbol.for('TodoUseCase'),
  TodoController: Symbol.for('TodoController'),
};

export function createContainer(): DIContainer {
  const container = new DIContainer();

  // Repository bindings
  container.bind<TodoRepository>(TYPES.TodoRepository).toSingleton(JsonTodoRepository);

  // Use case bindings
  container.bind<TodoUseCase>(TYPES.TodoUseCase).toFactory(() => {
    const todoRepository = container.get<TodoRepository>(TYPES.TodoRepository);
    return new TodoUseCase(todoRepository);
  });

  // Controller bindings
  container.bind<TodoController>(TYPES.TodoController).toFactory(() => {
    const todoUseCase = container.get<TodoUseCase>(TYPES.TodoUseCase);
    return new TodoController(todoUseCase);
  });

  return container;
}
