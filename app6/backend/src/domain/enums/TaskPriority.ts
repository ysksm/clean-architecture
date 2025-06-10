export enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3
}

export namespace TaskPriority {
  export function isValid(priority: number): priority is TaskPriority {
    return Object.values(TaskPriority).includes(priority);
  }

  export function toString(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return 'LOW';
      case TaskPriority.MEDIUM:
        return 'MEDIUM';
      case TaskPriority.HIGH:
        return 'HIGH';
      case TaskPriority.URGENT:
        return 'URGENT';
      default:
        throw new Error(`Unknown TaskPriority: ${priority}`);
    }
  }
}