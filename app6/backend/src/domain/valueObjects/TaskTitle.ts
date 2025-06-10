export class TaskTitle {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('TaskTitle cannot be empty');
    }
    if (_value.length > 256) {
      throw new Error('TaskTitle cannot exceed 256 characters');
    }
  }

  static create(value: string): TaskTitle {
    return new TaskTitle(value.trim());
  }

  get value(): string {
    return this._value;
  }

  get length(): number {
    return this._value.length;
  }

  equals(other: TaskTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}