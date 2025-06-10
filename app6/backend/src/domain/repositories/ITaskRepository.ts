import { Task } from '../entities/Task.js';
import { TaskId } from '../valueObjects/TaskId.js';
import { TaskStatus } from '../enums/TaskStatus.js';

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
  save(task: Task): Promise<void>;
  findById(id: TaskId): Promise<Task | null>;
  findAll(criteria?: TaskSearchCriteria): Promise<Task[]>;
  delete(id: TaskId): Promise<boolean>;
  count(status?: TaskStatus): Promise<number>;
  getStats(): Promise<TaskStats>;
}