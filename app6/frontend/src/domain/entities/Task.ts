import { TaskStatus } from '@shared/idl/generator';
import { TaskPriority } from '@shared/idl/generator';

export class Task {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly dueDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static fromDto(dto: any): Task {
    return new Task(
      dto.id,
      dto.title,
      dto.description,
      dto.status,
      dto.priority,
      new Date(dto.dueDate),
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }

  isCompleted(): boolean {
    return this.status === TaskStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === TaskStatus.PENDING;
  }

  isInProgress(): boolean {
    return this.status === TaskStatus.IN_PROGRESS;
  }

  isCancelled(): boolean {
    return this.status === TaskStatus.CANCELLED;
  }

  isOverdue(): boolean {
    return this.dueDate < new Date() && !this.isCompleted();
  }

  getPriorityLabel(): string {
    switch (this.priority) {
      case TaskPriority.LOW:
        return 'Low';
      case TaskPriority.MEDIUM:
        return 'Medium';
      case TaskPriority.HIGH:
        return 'High';
      case TaskPriority.URGENT:
        return 'Urgent';
      default:
        return 'Unknown';
    }
  }

  getStatusLabel(): string {
    switch (this.status) {
      case TaskStatus.PENDING:
        return 'Pending';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.COMPLETED:
        return 'Completed';
      case TaskStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}