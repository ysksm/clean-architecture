// Binary Protocol Generator for Task Management System
// Generates TypeScript types and serialization/deserialization functions

export interface TaskId {
  value: number;
}

export interface TaskTitle {
  length: number;
  value: string;
}

export interface TaskDescription {
  length: number;
  value: string;
}

export enum TaskStatus {
  PENDING = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3
}

export enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3
}

export interface TaskDueDate {
  timestamp: number;
}

export interface Task {
  id: TaskId;
  title: TaskTitle;
  description: TaskDescription;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: TaskDueDate;
  createdAt: number;
  updatedAt: number;
}

export interface CreateTaskRequest {
  title: TaskTitle;
  description: TaskDescription;
  priority: TaskPriority;
  dueDate: TaskDueDate;
}

export interface CreateTaskResponse {
  success: boolean;
  taskId: TaskId;
  errorMessage: string;
}

export interface GetTasksRequest {
  offset: number;
  limit: number;
  statusFilter: TaskStatus;
}

export interface GetTasksResponse {
  success: boolean;
  totalCount: number;
  taskCount: number;
  tasks: Task[];
  errorMessage: string;
}

export interface UpdateTaskRequest {
  id: TaskId;
  title: TaskTitle;
  description: TaskDescription;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: TaskDueDate;
}

export interface UpdateTaskResponse {
  success: boolean;
  errorMessage: string;
}

export interface DeleteTaskRequest {
  id: TaskId;
}

export interface DeleteTaskResponse {
  success: boolean;
  errorMessage: string;
}

export interface GetTaskStatsRequest {}

export interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  cancelledTasks: number;
}

export interface GetTaskStatsResponse {
  success: boolean;
  stats: TaskStats;
  errorMessage: string;
}

// Binary Serialization/Deserialization Functions
export class BinaryProtocol {
  private static textEncoder = new TextEncoder();
  private static textDecoder = new TextDecoder();

  static serializeString(str: string, maxLength: number): Uint8Array {
    const buffer = new ArrayBuffer(2 + maxLength);
    const view = new DataView(buffer);
    const bytes = this.textEncoder.encode(str.slice(0, maxLength));
    
    view.setUint16(0, bytes.length, true);
    new Uint8Array(buffer, 2).set(bytes);
    
    return new Uint8Array(buffer);
  }

  static deserializeString(buffer: ArrayBuffer, offset: number, maxLength: number): { value: string; length: number; nextOffset: number } {
    const view = new DataView(buffer, offset);
    const length = view.getUint16(0, true);
    const bytes = new Uint8Array(buffer, offset + 2, length);
    const value = this.textDecoder.decode(bytes);
    
    return {
      value,
      length,
      nextOffset: offset + 2 + maxLength
    };
  }

  static serializeTask(task: Task): Uint8Array {
    const buffer = new ArrayBuffer(1024 + 256 + 32); // Estimated size
    const view = new DataView(buffer);
    let offset = 0;

    // TaskId
    view.setUint32(offset, task.id.value, true);
    offset += 4;

    // TaskTitle
    const titleBytes = this.serializeString(task.title.value, 256);
    new Uint8Array(buffer, offset).set(titleBytes);
    offset += titleBytes.length;

    // TaskDescription
    const descBytes = this.serializeString(task.description.value, 1024);
    new Uint8Array(buffer, offset).set(descBytes);
    offset += descBytes.length;

    // TaskStatus
    view.setUint32(offset, task.status, true);
    offset += 4;

    // TaskPriority
    view.setUint32(offset, task.priority, true);
    offset += 4;

    // TaskDueDate
    view.setBigUint64(offset, BigInt(task.dueDate.timestamp), true);
    offset += 8;

    // createdAt
    view.setBigUint64(offset, BigInt(task.createdAt), true);
    offset += 8;

    // updatedAt
    view.setBigUint64(offset, BigInt(task.updatedAt), true);
    offset += 8;

    return new Uint8Array(buffer, 0, offset);
  }

  static deserializeTask(buffer: ArrayBuffer, offset: number = 0): Task {
    const view = new DataView(buffer, offset);
    let currentOffset = offset;

    // TaskId
    const id = { value: view.getUint32(currentOffset, true) };
    currentOffset += 4;

    // TaskTitle
    const titleResult = this.deserializeString(buffer, currentOffset, 256);
    const title = { length: titleResult.length, value: titleResult.value };
    currentOffset = titleResult.nextOffset;

    // TaskDescription
    const descResult = this.deserializeString(buffer, currentOffset, 1024);
    const description = { length: descResult.length, value: descResult.value };
    currentOffset = descResult.nextOffset;

    // TaskStatus
    const status = view.getUint32(currentOffset, true) as TaskStatus;
    currentOffset += 4;

    // TaskPriority
    const priority = view.getUint32(currentOffset, true) as TaskPriority;
    currentOffset += 4;

    // TaskDueDate
    const dueDate = { timestamp: Number(view.getBigUint64(currentOffset, true)) };
    currentOffset += 8;

    // createdAt
    const createdAt = Number(view.getBigUint64(currentOffset, true));
    currentOffset += 8;

    // updatedAt
    const updatedAt = Number(view.getBigUint64(currentOffset, true));
    currentOffset += 8;

    return {
      id,
      title,
      description,
      status,
      priority,
      dueDate,
      createdAt,
      updatedAt
    };
  }

  static serializeCreateTaskRequest(request: CreateTaskRequest): Uint8Array {
    const buffer = new ArrayBuffer(1024 + 256 + 16);
    const view = new DataView(buffer);
    let offset = 0;

    // TaskTitle
    const titleBytes = this.serializeString(request.title.value, 256);
    new Uint8Array(buffer, offset).set(titleBytes);
    offset += titleBytes.length;

    // TaskDescription
    const descBytes = this.serializeString(request.description.value, 1024);
    new Uint8Array(buffer, offset).set(descBytes);
    offset += descBytes.length;

    // TaskPriority
    view.setUint32(offset, request.priority, true);
    offset += 4;

    // TaskDueDate
    view.setBigUint64(offset, BigInt(request.dueDate.timestamp), true);
    offset += 8;

    return new Uint8Array(buffer, 0, offset);
  }

  static deserializeCreateTaskRequest(buffer: ArrayBuffer): CreateTaskRequest {
    const view = new DataView(buffer);
    let offset = 0;

    // TaskTitle
    const titleResult = this.deserializeString(buffer, offset, 256);
    const title = { length: titleResult.length, value: titleResult.value };
    offset = titleResult.nextOffset;

    // TaskDescription
    const descResult = this.deserializeString(buffer, offset, 1024);
    const description = { length: descResult.length, value: descResult.value };
    offset = descResult.nextOffset;

    // TaskPriority
    const priority = view.getUint32(offset, true) as TaskPriority;
    offset += 4;

    // TaskDueDate
    const dueDate = { timestamp: Number(view.getBigUint64(offset, true)) };
    offset += 8;

    return {
      title,
      description,
      priority,
      dueDate
    };
  }

  static serializeCreateTaskResponse(response: CreateTaskResponse): Uint8Array {
    const buffer = new ArrayBuffer(1 + 4 + 256);
    const view = new DataView(buffer);
    let offset = 0;

    // success
    view.setUint8(offset, response.success ? 1 : 0);
    offset += 1;

    // taskId
    view.setUint32(offset, response.taskId.value, true);
    offset += 4;

    // errorMessage
    const errorBytes = this.serializeString(response.errorMessage, 256);
    new Uint8Array(buffer, offset).set(errorBytes);
    offset += errorBytes.length;

    return new Uint8Array(buffer, 0, offset);
  }

  static serializeGetTasksResponse(response: GetTasksResponse): Uint8Array {
    const buffer = new ArrayBuffer(1 + 4 + 4 + (response.tasks.length * 1500) + 256);
    const view = new DataView(buffer);
    let offset = 0;

    // success
    view.setUint8(offset, response.success ? 1 : 0);
    offset += 1;

    // totalCount
    view.setUint32(offset, response.totalCount, true);
    offset += 4;

    // taskCount
    view.setUint32(offset, response.taskCount, true);
    offset += 4;

    // tasks
    for (const task of response.tasks) {
      const taskBytes = this.serializeTask(task);
      new Uint8Array(buffer, offset).set(taskBytes);
      offset += taskBytes.length;
    }

    // errorMessage
    const errorBytes = this.serializeString(response.errorMessage, 256);
    new Uint8Array(buffer, offset).set(errorBytes);
    offset += errorBytes.length;

    return new Uint8Array(buffer, 0, offset);
  }

  static deserializeGetTasksRequest(buffer: ArrayBuffer): GetTasksRequest {
    const view = new DataView(buffer);
    let offset = 0;

    // offset
    const requestOffset = view.getUint32(offset, true);
    offset += 4;

    // limit
    const limit = view.getUint32(offset, true);
    offset += 4;

    // statusFilter
    const statusFilter = view.getUint32(offset, true) as TaskStatus;
    offset += 4;

    return {
      offset: requestOffset,
      limit,
      statusFilter
    };
  }

  static serializeUpdateTaskResponse(response: UpdateTaskResponse): Uint8Array {
    const buffer = new ArrayBuffer(1 + 256);
    const view = new DataView(buffer);
    let offset = 0;

    // success
    view.setUint8(offset, response.success ? 1 : 0);
    offset += 1;

    // errorMessage
    const errorBytes = this.serializeString(response.errorMessage, 256);
    new Uint8Array(buffer, offset).set(errorBytes);
    offset += errorBytes.length;

    return new Uint8Array(buffer, 0, offset);
  }

  static deserializeUpdateTaskRequest(buffer: ArrayBuffer): UpdateTaskRequest {
    const view = new DataView(buffer);
    let offset = 0;

    // TaskId
    const id = { value: view.getUint32(offset, true) };
    offset += 4;

    // TaskTitle
    const titleResult = this.deserializeString(buffer, offset, 256);
    const title = { length: titleResult.length, value: titleResult.value };
    offset = titleResult.nextOffset;

    // TaskDescription
    const descResult = this.deserializeString(buffer, offset, 1024);
    const description = { length: descResult.length, value: descResult.value };
    offset = descResult.nextOffset;

    // TaskStatus
    const status = view.getUint32(offset, true) as TaskStatus;
    offset += 4;

    // TaskPriority
    const priority = view.getUint32(offset, true) as TaskPriority;
    offset += 4;

    // TaskDueDate
    const dueDate = { timestamp: Number(view.getBigUint64(offset, true)) };
    offset += 8;

    return {
      id,
      title,
      description,
      status,
      priority,
      dueDate
    };
  }

  static serializeDeleteTaskResponse(response: DeleteTaskResponse): Uint8Array {
    const buffer = new ArrayBuffer(1 + 256);
    const view = new DataView(buffer);
    let offset = 0;

    // success
    view.setUint8(offset, response.success ? 1 : 0);
    offset += 1;

    // errorMessage
    const errorBytes = this.serializeString(response.errorMessage, 256);
    new Uint8Array(buffer, offset).set(errorBytes);
    offset += errorBytes.length;

    return new Uint8Array(buffer, 0, offset);
  }

  static deserializeDeleteTaskRequest(buffer: ArrayBuffer): DeleteTaskRequest {
    const view = new DataView(buffer);
    let offset = 0;

    // TaskId
    const id = { value: view.getUint32(offset, true) };
    offset += 4;

    return { id };
  }

  static serializeGetTaskStatsResponse(response: GetTaskStatsResponse): Uint8Array {
    const buffer = new ArrayBuffer(1 + 20 + 256);
    const view = new DataView(buffer);
    let offset = 0;

    // success
    view.setUint8(offset, response.success ? 1 : 0);
    offset += 1;

    // stats
    view.setUint32(offset, response.stats.totalTasks, true);
    offset += 4;
    view.setUint32(offset, response.stats.pendingTasks, true);
    offset += 4;
    view.setUint32(offset, response.stats.inProgressTasks, true);
    offset += 4;
    view.setUint32(offset, response.stats.completedTasks, true);
    offset += 4;
    view.setUint32(offset, response.stats.cancelledTasks, true);
    offset += 4;

    // errorMessage
    const errorBytes = this.serializeString(response.errorMessage, 256);
    new Uint8Array(buffer, offset).set(errorBytes);
    offset += errorBytes.length;

    return new Uint8Array(buffer, 0, offset);
  }

  static serializeGetTasksRequest(request: GetTasksRequest): Uint8Array {
    const buffer = new ArrayBuffer(12);
    const view = new DataView(buffer);
    let offset = 0;

    // offset
    view.setUint32(offset, request.offset, true);
    offset += 4;

    // limit
    view.setUint32(offset, request.limit, true);
    offset += 4;

    // statusFilter
    view.setUint32(offset, request.statusFilter, true);
    offset += 4;

    return new Uint8Array(buffer, 0, offset);
  }

  static serializeUpdateTaskRequest(request: UpdateTaskRequest): Uint8Array {
    const buffer = new ArrayBuffer(4 + 256 + 1024 + 16);
    const view = new DataView(buffer);
    let offset = 0;

    // TaskId
    view.setUint32(offset, request.id.value, true);
    offset += 4;

    // TaskTitle
    const titleBytes = this.serializeString(request.title.value, 256);
    new Uint8Array(buffer, offset).set(titleBytes);
    offset += titleBytes.length;

    // TaskDescription
    const descBytes = this.serializeString(request.description.value, 1024);
    new Uint8Array(buffer, offset).set(descBytes);
    offset += descBytes.length;

    // TaskStatus
    view.setUint32(offset, request.status, true);
    offset += 4;

    // TaskPriority
    view.setUint32(offset, request.priority, true);
    offset += 4;

    // TaskDueDate
    view.setBigUint64(offset, BigInt(request.dueDate.timestamp), true);
    offset += 8;

    return new Uint8Array(buffer, 0, offset);
  }

  static serializeDeleteTaskRequest(request: DeleteTaskRequest): Uint8Array {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    let offset = 0;

    // TaskId
    view.setUint32(offset, request.id.value, true);
    offset += 4;

    return new Uint8Array(buffer, 0, offset);
  }

  static deserializeCreateTaskResponse(buffer: ArrayBuffer): CreateTaskResponse {
    const view = new DataView(buffer);
    let offset = 0;

    // success
    const success = view.getUint8(offset) === 1;
    offset += 1;

    // taskId
    const taskId = { value: view.getUint32(offset, true) };
    offset += 4;

    // errorMessage
    const errorResult = this.deserializeString(buffer, offset, 256);
    const errorMessage = errorResult.value;

    return {
      success,
      taskId,
      errorMessage
    };
  }

  static deserializeGetTasksResponse(buffer: ArrayBuffer): GetTasksResponse {
    const view = new DataView(buffer);
    let offset = 0;

    // success
    const success = view.getUint8(offset) === 1;
    offset += 1;

    // totalCount
    const totalCount = view.getUint32(offset, true);
    offset += 4;

    // taskCount
    const taskCount = view.getUint32(offset, true);
    offset += 4;

    // tasks
    const tasks: Task[] = [];
    for (let i = 0; i < taskCount; i++) {
      const task = this.deserializeTask(buffer, offset);
      tasks.push(task);
      offset += 1500; // Estimated task size
    }

    // errorMessage
    const errorResult = this.deserializeString(buffer, offset, 256);
    const errorMessage = errorResult.value;

    return {
      success,
      totalCount,
      taskCount,
      tasks,
      errorMessage
    };
  }

  static deserializeUpdateTaskResponse(buffer: ArrayBuffer): UpdateTaskResponse {
    const view = new DataView(buffer);
    let offset = 0;

    // success
    const success = view.getUint8(offset) === 1;
    offset += 1;

    // errorMessage
    const errorResult = this.deserializeString(buffer, offset, 256);
    const errorMessage = errorResult.value;

    return {
      success,
      errorMessage
    };
  }

  static deserializeDeleteTaskResponse(buffer: ArrayBuffer): DeleteTaskResponse {
    const view = new DataView(buffer);
    let offset = 0;

    // success
    const success = view.getUint8(offset) === 1;
    offset += 1;

    // errorMessage
    const errorResult = this.deserializeString(buffer, offset, 256);
    const errorMessage = errorResult.value;

    return {
      success,
      errorMessage
    };
  }

  static deserializeGetTaskStatsResponse(buffer: ArrayBuffer): GetTaskStatsResponse {
    const view = new DataView(buffer);
    let offset = 0;

    // success
    const success = view.getUint8(offset) === 1;
    offset += 1;

    // stats
    const stats = {
      totalTasks: view.getUint32(offset, true),
      pendingTasks: view.getUint32(offset + 4, true),
      inProgressTasks: view.getUint32(offset + 8, true),
      completedTasks: view.getUint32(offset + 12, true),
      cancelledTasks: view.getUint32(offset + 16, true)
    };
    offset += 20;

    // errorMessage
    const errorResult = this.deserializeString(buffer, offset, 256);
    const errorMessage = errorResult.value;

    return {
      success,
      stats,
      errorMessage
    };
  }
}