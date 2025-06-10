export class TaskId {
  private constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new Error('TaskId must be a positive number');
    }
  }

  static create(value: number): TaskId {
    return new TaskId(value);
  }

  static generate(): TaskId {
    return new TaskId(Math.floor(Math.random() * 1000000) + 1);
  }

  get value(): number {
    return this._value;
  }

  equals(other: TaskId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}