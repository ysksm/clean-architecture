import { Task } from '../../domain/entities/Task.js';
import { TaskId } from '../../domain/valueObjects/TaskId.js';
import { TaskTitle } from '../../domain/valueObjects/TaskTitle.js';
import { TaskDescription } from '../../domain/valueObjects/TaskDescription.js';
import { TaskStatus } from '../../domain/enums/TaskStatus.js';
import { TaskPriority } from '../../domain/enums/TaskPriority.js';
import { ITaskRepository, TaskSearchCriteria, TaskStats } from '../../domain/repositories/ITaskRepository.js';
import { CreateTaskDto } from '../dto/CreateTaskDto.js';
import { UpdateTaskDto } from '../dto/UpdateTaskDto.js';
import { TaskDto } from '../dto/TaskDto.js';

export class TaskApplicationService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async createTask(dto: CreateTaskDto): Promise<TaskDto> {
    const title = TaskTitle.create(dto.title);
    const description = TaskDescription.create(dto.description);
    const priority = dto.priority as TaskPriority;
    const dueDate = new Date(dto.dueDate);

    if (!TaskPriority.isValid(priority)) {
      throw new Error('Invalid task priority');
    }

    const task = Task.create(title, description, priority, dueDate);
    await this.taskRepository.save(task);

    return this.taskToDto(task);
  }

  async getTasks(criteria?: TaskSearchCriteria): Promise<TaskDto[]> {
    const tasks = await this.taskRepository.findAll(criteria);
    return tasks.map(task => this.taskToDto(task));
  }

  async getTaskById(id: number): Promise<TaskDto | null> {
    const taskId = TaskId.create(id);
    const task = await this.taskRepository.findById(taskId);
    return task ? this.taskToDto(task) : null;
  }

  async updateTask(dto: UpdateTaskDto): Promise<TaskDto> {
    const taskId = TaskId.create(dto.id);
    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      throw new Error('Task not found');
    }

    const title = TaskTitle.create(dto.title);
    const description = TaskDescription.create(dto.description);
    const status = dto.status as TaskStatus;
    const priority = dto.priority as TaskPriority;
    const dueDate = new Date(dto.dueDate);

    if (!TaskStatus.isValid(status)) {
      throw new Error('Invalid task status');
    }

    if (!TaskPriority.isValid(priority)) {
      throw new Error('Invalid task priority');
    }

    existingTask.update(title, description, status, priority, dueDate);
    await this.taskRepository.save(existingTask);

    return this.taskToDto(existingTask);
  }

  async deleteTask(id: number): Promise<boolean> {
    const taskId = TaskId.create(id);
    return await this.taskRepository.delete(taskId);
  }

  async getTaskStats(): Promise<TaskStats> {
    return await this.taskRepository.getStats();
  }

  private taskToDto(task: Task): TaskDto {
    return {
      id: task.id.value,
      title: task.title.value,
      description: task.description.value,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.getTime(),
      createdAt: task.createdAt.getTime(),
      updatedAt: task.updatedAt.getTime()
    };
  }
}