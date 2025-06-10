import { Task } from '@domain/entities/Task';
import { ITaskRepository, CreateTaskRequest, UpdateTaskRequest, TaskSearchCriteria, TaskStats } from '@domain/repositories/ITaskRepository';

export class TaskUseCases {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async createTask(request: CreateTaskRequest): Promise<Task> {
    if (!request.title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    if (request.title.length > 256) {
      throw new Error('Task title cannot exceed 256 characters');
    }

    if (request.description.length > 1024) {
      throw new Error('Task description cannot exceed 1024 characters');
    }

    return await this.taskRepository.createTask(request);
  }

  async getTasks(criteria?: TaskSearchCriteria): Promise<Task[]> {
    return await this.taskRepository.getTasks(criteria);
  }

  async updateTask(request: UpdateTaskRequest): Promise<Task> {
    if (!request.title.trim()) {
      throw new Error('Task title cannot be empty');
    }

    if (request.title.length > 256) {
      throw new Error('Task title cannot exceed 256 characters');
    }

    if (request.description.length > 1024) {
      throw new Error('Task description cannot exceed 1024 characters');
    }

    return await this.taskRepository.updateTask(request);
  }

  async deleteTask(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('Invalid task ID');
    }

    return await this.taskRepository.deleteTask(id);
  }

  async getTaskStats(): Promise<TaskStats> {
    return await this.taskRepository.getTaskStats();
  }
}