export enum TaskStatus {
  PENDING = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3
}

export namespace TaskStatus {
  export function isValid(status: number): status is TaskStatus {
    return Object.values(TaskStatus).includes(status);
  }

  export function toString(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'PENDING';
      case TaskStatus.IN_PROGRESS:
        return 'IN_PROGRESS';
      case TaskStatus.COMPLETED:
        return 'COMPLETED';
      case TaskStatus.CANCELLED:
        return 'CANCELLED';
      default:
        throw new Error(`Unknown TaskStatus: ${status}`);
    }
  }
}