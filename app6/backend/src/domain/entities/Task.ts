import { TaskId } from '../valueObjects/TaskId.js';
import { TaskTitle } from '../valueObjects/TaskTitle.js';
import { TaskDescription } from '../valueObjects/TaskDescription.js';
import { TaskStatus } from '../enums/TaskStatus.js';
import { TaskPriority } from '../enums/TaskPriority.js';

export class Task {
  private constructor(
    private readonly _id: TaskId,
    private _title: TaskTitle,
    private _description: TaskDescription,
    private _status: TaskStatus,
    private _priority: TaskPriority,
    private _dueDate: Date,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    title: TaskTitle,
    description: TaskDescription,
    priority: TaskPriority,
    dueDate: Date
  ): Task {
    const now = new Date();
    return new Task(
      TaskId.generate(),
      title,
      description,
      TaskStatus.PENDING,
      priority,
      dueDate,
      now,
      now
    );
  }

  static reconstruct(
    id: TaskId,
    title: TaskTitle,
    description: TaskDescription,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: Date,
    createdAt: Date,
    updatedAt: Date
  ): Task {
    return new Task(
      id,
      title,
      description,
      status,
      priority,
      dueDate,
      createdAt,
      updatedAt
    );
  }

  get id(): TaskId {
    return this._id;
  }

  get title(): TaskTitle {
    return this._title;
  }

  get description(): TaskDescription {
    return this._description;
  }

  get status(): TaskStatus {
    return this._status;
  }

  get priority(): TaskPriority {
    return this._priority;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateTitle(title: TaskTitle): void {
    this._title = title;
    this._updatedAt = new Date();
  }

  updateDescription(description: TaskDescription): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateStatus(status: TaskStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  updatePriority(priority: TaskPriority): void {
    this._priority = priority;
    this._updatedAt = new Date();
  }

  updateDueDate(dueDate: Date): void {
    this._dueDate = dueDate;
    this._updatedAt = new Date();
  }

  update(
    title: TaskTitle,
    description: TaskDescription,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: Date
  ): void {
    this._title = title;
    this._description = description;
    this._status = status;
    this._priority = priority;
    this._dueDate = dueDate;
    this._updatedAt = new Date();
  }

  isCompleted(): boolean {
    return this._status === TaskStatus.COMPLETED;
  }

  isPending(): boolean {
    return this._status === TaskStatus.PENDING;
  }

  isInProgress(): boolean {
    return this._status === TaskStatus.IN_PROGRESS;
  }

  isCancelled(): boolean {
    return this._status === TaskStatus.CANCELLED;
  }

  isOverdue(): boolean {
    return this._dueDate < new Date() && !this.isCompleted();
  }

  equals(other: Task): boolean {
    return this._id.equals(other._id);
  }
}