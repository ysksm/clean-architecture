import { Task } from '../entities/Task';
import { TaskStatus, TaskPriority } from '@shared/idl/generator';

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date;
}

export interface UpdateTaskRequest {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
}

export interface TaskSearchCriteria {
  status?: TaskStatus;
  offset?: number;
  limit?: number;
}

export interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  cancelledTasks: number;
}

export interface ITaskRepository {
  createTask(request: CreateTaskRequest): Promise<Task>;
  getTasks(criteria?: TaskSearchCriteria): Promise<Task[]>;
  updateTask(request: UpdateTaskRequest): Promise<Task>;
  deleteTask(id: number): Promise<boolean>;
  getTaskStats(): Promise<TaskStats>;
}