export class TaskDescription {
  private constructor(private readonly _value: string) {
    if (_value.length > 1024) {
      throw new Error('TaskDescription cannot exceed 1024 characters');
    }
  }

  static create(value: string): TaskDescription {
    return new TaskDescription(value.trim());
  }

  get value(): string {
    return this._value;
  }

  get length(): number {
    return this._value.length;
  }

  equals(other: TaskDescription): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}