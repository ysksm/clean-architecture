type Status = 'pending' | 'completed';

export class TodoStatus {
  readonly value: Status;

  private constructor(value: Status) {
    this.value = value;
  }

  static create(value: string): TodoStatus {
    if (value !== 'pending' && value !== 'completed') {
      throw new Error('Invalid todo status.');
    }
    return new TodoStatus(value as Status);
  }

  isCompleted(): boolean {
    return this.value === 'completed';
  }

  isPending(): boolean {
    return this.value === 'pending';
  }

  equals(other: TodoStatus): boolean {
    return this.value === other.value;
  }
}
