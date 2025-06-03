import { TodoEntity } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

interface TodoApiData {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class TodoApiClient implements TodoRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private apiDataToEntity(data: TodoApiData): TodoEntity {
    return new TodoEntity(
      data.id,
      data.title,
      data.completed,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.description
    );
  }

  async findAll(): Promise<TodoEntity[]> {
    const data = await this.request<TodoApiData[]>('/todos');
    return data.map(item => this.apiDataToEntity(item));
  }

  async findById(id: string): Promise<TodoEntity | null> {
    try {
      const data = await this.request<TodoApiData>(`/todos/${id}`);
      return this.apiDataToEntity(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async save(todo: TodoEntity): Promise<TodoEntity> {
    const existingTodo = await this.findById(todo.id);
    
    if (existingTodo) {
      // Update existing todo
      const data = await this.request<TodoApiData>(`/todos/${todo.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
        }),
      });
      return this.apiDataToEntity(data);
    } else {
      // Create new todo
      const data = await this.request<TodoApiData>('/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
        }),
      });
      return this.apiDataToEntity(data);
    }
  }

  async delete(id: string): Promise<void> {
    await this.request<void>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async completeTodo(id: string): Promise<TodoEntity> {
    const data = await this.request<TodoApiData>(`/todos/${id}/complete`, {
      method: 'PATCH',
    });
    return this.apiDataToEntity(data);
  }

  async uncompleteTodo(id: string): Promise<TodoEntity> {
    const data = await this.request<TodoApiData>(`/todos/${id}/uncomplete`, {
      method: 'PATCH',
    });
    return this.apiDataToEntity(data);
  }
}
