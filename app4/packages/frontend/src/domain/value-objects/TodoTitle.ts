export class TodoTitle {
  readonly value: string;

  private constructor(value: string) {
    if (value.length === 0) {
      throw new Error('Todo title cannot be empty.');
    }
    if (value.length > 100) {
      throw new Error('Todo title cannot be longer than 100 characters.');
    }
    this.value = value;
  }

  static create(value: string): TodoTitle {
    return new TodoTitle(value);
  }

  equals(other: TodoTitle): boolean {
    return this.value === other.value;
  }
}
