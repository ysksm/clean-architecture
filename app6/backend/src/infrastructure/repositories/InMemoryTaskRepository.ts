import { Task } from '../../domain/entities/Task.js';
import { TaskId } from '../../domain/valueObjects/TaskId.js';
import { TaskTitle } from '../../domain/valueObjects/TaskTitle.js';
import { TaskDescription } from '../../domain/valueObjects/TaskDescription.js';
import { TaskStatus } from '../../domain/enums/TaskStatus.js';
import { TaskPriority } from '../../domain/enums/TaskPriority.js';
import { ITaskRepository, TaskSearchCriteria, TaskStats } from '../../domain/repositories/ITaskRepository.js';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<number, Task> = new Map();

  async save(task: Task): Promise<void> {
    this.tasks.set(task.id.value, task);
  }

  async findById(id: TaskId): Promise<Task | null> {
    const task = this.tasks.get(id.value);
    return task || null;
  }

  async findAll(criteria?: TaskSearchCriteria): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values());

    if (criteria?.status !== undefined) {
      tasks = tasks.filter(task => task.status === criteria.status);
    }

    // Sort by creation date (newest first)
    tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const offset = criteria?.offset || 0;
    const limit = criteria?.limit || tasks.length;

    return tasks.slice(offset, offset + limit);
  }

  async delete(id: TaskId): Promise<boolean> {
    return this.tasks.delete(id.value);
  }

  async count(status?: TaskStatus): Promise<number> {
    if (status === undefined) {
      return this.tasks.size;
    }

    return Array.from(this.tasks.values()).filter(task => task.status === status).length;
  }

  async getStats(): Promise<TaskStats> {
    const tasks = Array.from(this.tasks.values());
    
    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(task => task.status === TaskStatus.PENDING).length,
      inProgressTasks: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length,
      completedTasks: tasks.filter(task => task.status === TaskStatus.COMPLETED).length,
      cancelledTasks: tasks.filter(task => task.status === TaskStatus.CANCELLED).length
    };
  }
}