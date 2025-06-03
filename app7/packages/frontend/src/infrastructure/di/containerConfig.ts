import { DIContainer } from './Container';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { TodoApiClient } from '../api/TodoApiClient';
import { InMemoryTodoRepository } from '../repositories/InMemoryTodoRepository';
import { TodoUseCase } from '../../application/usecases/TodoUseCase';

// Service identifiers
export const TYPES = {
  TodoRepository: Symbol.for('TodoRepository'),
  TodoUseCase: Symbol.for('TodoUseCase'),
};

export function createContainer(useInMemory: boolean = false): DIContainer {
  const container = new DIContainer();

  // Repository bindings
  if (useInMemory) {
    container.bind<TodoRepository>(TYPES.TodoRepository).toSingleton(InMemoryTodoRepository);
  } else {
    container.bind<TodoRepository>(TYPES.TodoRepository).toSingleton(TodoApiClient);
  }

  // Use case bindings
  container.bind<TodoUseCase>(TYPES.TodoUseCase).toFactory(() => {
    const todoRepository = container.get<TodoRepository>(TYPES.TodoRepository);
    return new TodoUseCase(todoRepository);
  });

  return container;
}

// Global container instance
let globalContainer: DIContainer | null = null;

export function getContainer(): DIContainer {
  if (!globalContainer) {
    const useInMemory = import.meta.env.VITE_USE_IN_MEMORY === 'true';
    globalContainer = createContainer(useInMemory);
  }
  return globalContainer;
}

export function resetContainer(): void {
  globalContainer = null;
}
