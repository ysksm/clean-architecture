import { v4 as uuidv4 } from 'uuid';

export class TodoId {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): TodoId {
    // ここでUUIDの形式バリデーションを行うことも可能
    return new TodoId(value);
  }

  static generate(): TodoId {
    return new TodoId(uuidv4());
  }

  equals(other: TodoId): boolean {
    return this.value === other.value;
  }
}
