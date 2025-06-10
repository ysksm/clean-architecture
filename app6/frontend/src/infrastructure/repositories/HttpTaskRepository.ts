import { Task } from '@domain/entities/Task';
import { ITaskRepository, CreateTaskRequest, UpdateTaskRequest, TaskSearchCriteria, TaskStats } from '@domain/repositories/ITaskRepository';
import { BinaryProtocol } from '@shared/idl/generator';

export class HttpTaskRepository implements ITaskRepository {
  private readonly baseUrl = '/api';

  async createTask(request: CreateTaskRequest): Promise<Task> {
    const binaryRequest = BinaryProtocol.serializeCreateTaskRequest({
      title: { length: request.title.length, value: request.title },
      description: { length: request.description.length, value: request.description },
      priority: request.priority,
      dueDate: { timestamp: request.dueDate.getTime() }
    });

    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: binaryRequest
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const buffer = await response.arrayBuffer();
    const result = BinaryProtocol.deserializeCreateTaskResponse(buffer);

    if (!result.success) {
      throw new Error(result.errorMessage);
    }

    // Get the created task by fetching all tasks and finding the one with matching ID
    const tasks = await this.getTasks();
    const createdTask = tasks.find(task => task.id === result.taskId.value);
    
    if (!createdTask) {
      throw new Error('Created task not found');
    }

    return createdTask;
  }

  async getTasks(criteria?: TaskSearchCriteria): Promise<Task[]> {
    let url = `${this.baseUrl}/tasks`;
    let body: ArrayBuffer | undefined;

    if (criteria) {
      const binaryRequest = BinaryProtocol.serializeGetTasksRequest({
        offset: criteria.offset || 0,
        limit: criteria.limit || 100,
        statusFilter: criteria.status || 0
      });
      body = binaryRequest.buffer;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: body ? {
        'Content-Type': 'application/octet-stream'
      } : {},
      body
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const buffer = await response.arrayBuffer();
    const result = BinaryProtocol.deserializeGetTasksResponse(buffer);

    if (!result.success) {
      throw new Error(result.errorMessage);
    }

    return result.tasks.map(taskData => new Task(
      taskData.id.value,
      taskData.title.value,
      taskData.description.value,
      taskData.status,
      taskData.priority,
      new Date(taskData.dueDate.timestamp),
      new Date(taskData.createdAt),
      new Date(taskData.updatedAt)
    ));
  }

  async updateTask(request: UpdateTaskRequest): Promise<Task> {
    const binaryRequest = BinaryProtocol.serializeUpdateTaskRequest({
      id: { value: request.id },
      title: { length: request.title.length, value: request.title },
      description: { length: request.description.length, value: request.description },
      status: request.status,
      priority: request.priority,
      dueDate: { timestamp: request.dueDate.getTime() }
    });

    const response = await fetch(`${this.baseUrl}/tasks/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: binaryRequest
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const buffer = await response.arrayBuffer();
    const result = BinaryProtocol.deserializeUpdateTaskResponse(buffer);

    if (!result.success) {
      throw new Error(result.errorMessage);
    }

    // Return the updated task
    return new Task(
      request.id,
      request.title,
      request.description,
      request.status,
      request.priority,
      request.dueDate,
      new Date(), // We don't know the original createdAt, so use current time
      new Date()
    );
  }

  async deleteTask(id: number): Promise<boolean> {
    const binaryRequest = BinaryProtocol.serializeDeleteTaskRequest({
      id: { value: id }
    });

    const response = await fetch(`${this.baseUrl}/tasks/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: binaryRequest
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    const buffer = await response.arrayBuffer();
    const result = BinaryProtocol.deserializeDeleteTaskResponse(buffer);

    return result.success;
  }

  async getTaskStats(): Promise<TaskStats> {
    const response = await fetch(`${this.baseUrl}/tasks/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task stats');
    }

    const buffer = await response.arrayBuffer();
    const result = BinaryProtocol.deserializeGetTaskStatsResponse(buffer);

    if (!result.success) {
      throw new Error(result.errorMessage);
    }

    return result.stats;
  }
}