import { randomUUID } from 'crypto';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoEntity implements Todo {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly completed: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly description?: string
  ) {
    if (!title.trim()) {
      throw new Error('Title cannot be empty');
    }
  }

  static create(title: string, description?: string): TodoEntity {
    const now = new Date();
    const id = randomUUID();
    return new TodoEntity(id, title, false, now, now, description);
  }

  complete(): TodoEntity {
    return new TodoEntity(
      this.id,
      this.title,
      true,
      this.createdAt,
      new Date(),
      this.description
    );
  }

  uncomplete(): TodoEntity {
    return new TodoEntity(
      this.id,
      this.title,
      false,
      this.createdAt,
      new Date(),
      this.description
    );
  }

  updateTitle(newTitle: string): TodoEntity {
    if (!newTitle.trim()) {
      throw new Error('Title cannot be empty');
    }
    return new TodoEntity(
      this.id,
      newTitle,
      this.completed,
      this.createdAt,
      new Date(),
      this.description
    );
  }

  updateDescription(newDescription?: string): TodoEntity {
    return new TodoEntity(
      this.id,
      this.title,
      this.completed,
      this.createdAt,
      new Date(),
      newDescription
    );
  }
}
