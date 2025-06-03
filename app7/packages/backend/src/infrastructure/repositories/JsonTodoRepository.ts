import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { TodoEntity } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';

interface TodoData {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class JsonTodoRepository implements TodoRepository {
  private readonly filePath: string;

  constructor(filePath: string = './data/todos.json') {
    this.filePath = filePath;
  }

  private async ensureDataDirectory(): Promise<void> {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }

  private async readTodos(): Promise<TodoData[]> {
    await this.ensureDataDirectory();
    
    if (!existsSync(this.filePath)) {
      return [];
    }

    try {
      const data = await readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading todos file:', error);
      return [];
    }
  }

  private async writeTodos(todos: TodoData[]): Promise<void> {
    await this.ensureDataDirectory();
    
    try {
      await writeFile(this.filePath, JSON.stringify(todos, null, 2));
    } catch (error) {
      console.error('Error writing todos file:', error);
      throw error;
    }
  }

  private todoDataToEntity(data: TodoData): TodoEntity {
    return new TodoEntity(
      data.id,
      data.title,
      data.completed,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.description
    );
  }

  private entityToTodoData(entity: TodoEntity): TodoData {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      completed: entity.completed,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  async findAll(): Promise<TodoEntity[]> {
    const todos = await this.readTodos();
    return todos.map(todo => this.todoDataToEntity(todo));
  }

  async findById(id: string): Promise<TodoEntity | null> {
    const todos = await this.readTodos();
    const todo = todos.find(t => t.id === id);
    return todo ? this.todoDataToEntity(todo) : null;
  }

  async save(todo: TodoEntity): Promise<TodoEntity> {
    const todos = await this.readTodos();
    const existingIndex = todos.findIndex(t => t.id === todo.id);
    const todoData = this.entityToTodoData(todo);

    if (existingIndex >= 0) {
      todos[existingIndex] = todoData;
    } else {
      todos.push(todoData);
    }

    await this.writeTodos(todos);
    return todo;
  }

  async delete(id: string): Promise<void> {
    const todos = await this.readTodos();
    const filteredTodos = todos.filter(t => t.id !== id);
    await this.writeTodos(filteredTodos);
  }
}
