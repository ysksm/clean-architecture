import { TodoId } from '../value-objects/TodoId.ts';
import { TodoTitle } from '../value-objects/TodoTitle.ts';
import { TodoStatus } from '../value-objects/TodoStatus.ts';

export interface TodoPrimitive {
  id: string;
  title: string;
  status: 'pending' | 'completed';
}

export class Todo {
  readonly id: TodoId;
  private title: TodoTitle;
  private status: TodoStatus;

  private constructor(id: TodoId, title: TodoTitle, status: TodoStatus) {
    this.id = id;
    this.title = title;
    this.status = status;
  }

  static create(id: TodoId, title: TodoTitle, status: TodoStatus): Todo {
    return new Todo(id, title, status);
  }

  static new(title: TodoTitle): Todo {
    return new Todo(TodoId.generate(), title, TodoStatus.create('pending'));
  }

  changeTitle(title: TodoTitle): void {
    this.title = title;
  }

  markAsCompleted(): void {
    this.status = TodoStatus.create('completed');
  }

  markAsPending(): void {
    this.status = TodoStatus.create('pending');
  }

  getTitle(): TodoTitle {
    return this.title;
  }

  getStatus(): TodoStatus {
    return this.status;
  }

  toPrimitives(): TodoPrimitive {
    return {
      id: this.id.value,
      title: this.title.value,
      status: this.status.value,
    };
  }
}
