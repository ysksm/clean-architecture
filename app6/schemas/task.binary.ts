// Task Management System - Binary Schema Definition
// TypeScript Decorator-based IDL for binary communication

import { Binary, Field, Message } from '../shared/midl/decorators/index.js';

/**
 * Task Status Enumeration
 */
export enum TaskStatus {
  PENDING = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3
}

/**
 * Task Priority Enumeration
 */
export enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3
}

/**
 * Task ID Value Object
 */
@Binary.packed()
export class TaskId {
  @Field.u32(0)
  value!: number;
}

/**
 * Task Title Value Object
 */
@Binary.size(258) // 2 bytes for length + 256 bytes for data
export class TaskTitle {
  @Field.string(0, { maxLength: 256 })
  value!: string;

  get length(): number {
    return this.value?.length || 0;
  }
}

/**
 * Task Description Value Object
 */
@Binary.size(1026) // 2 bytes for length + 1024 bytes for data
export class TaskDescription {
  @Field.string(0, { maxLength: 1024 })
  value!: string;

  get length(): number {
    return this.value?.length || 0;
  }
}

/**
 * Task Due Date Value Object
 */
@Binary.packed()
export class TaskDueDate {
  @Field.timestamp(0)
  timestamp!: Date;
}

/**
 * Main Task Entity
 */
@Binary.struct({
  packed: true,
  size: 1310,
  endian: 'little'
})
export class Task {
  @Field.u32(0)
  id!: number;

  @Field.string(4, { maxLength: 256 })
  title!: string;

  @Field.string(262, { maxLength: 1024 })
  description!: string;

  @Field.enumField(TaskStatus, 1288, { size: 4 })
  status!: TaskStatus;

  @Field.enumField(TaskPriority, 1292, { size: 4 })
  priority!: TaskPriority;

  @Field.timestamp(1296)
  dueDate!: Date;

  @Field.timestamp(1304)
  createdAt!: Date;

  @Field.timestamp(1312)
  updatedAt!: Date;

  // Domain logic methods
  isCompleted(): boolean {
    return this.status === TaskStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === TaskStatus.PENDING;
  }

  isInProgress(): boolean {
    return this.status === TaskStatus.IN_PROGRESS;
  }

  isCancelled(): boolean {
    return this.status === TaskStatus.CANCELLED;
  }

  isOverdue(): boolean {
    return this.dueDate < new Date() && !this.isCompleted();
  }

  getPriorityLabel(): string {
    switch (this.priority) {
      case TaskPriority.LOW: return 'Low';
      case TaskPriority.MEDIUM: return 'Medium';
      case TaskPriority.HIGH: return 'High';
      case TaskPriority.URGENT: return 'Urgent';
      default: return 'Unknown';
    }
  }

  getStatusLabel(): string {
    switch (this.status) {
      case TaskStatus.PENDING: return 'Pending';
      case TaskStatus.IN_PROGRESS: return 'In Progress';
      case TaskStatus.COMPLETED: return 'Completed';
      case TaskStatus.CANCELLED: return 'Cancelled';
      default: return 'Unknown';
    }
  }
}

/**
 * Create Task Request Message
 */
@Message.request(0x01)
export class CreateTaskRequest {
  @Field.string(0, { maxLength: 256 })
  title!: string;

  @Field.string(258, { maxLength: 1024 })
  description!: string;

  @Field.enumField(TaskPriority, 1282, { size: 4 })
  priority!: TaskPriority;

  @Field.timestamp(1286)
  dueDate!: Date;
}

/**
 * Create Task Response Message
 */
@Message.response(0x01)
export class CreateTaskResponse {
  @Field.bool(0)
  success!: boolean;

  @Field.u32(1)
  taskId!: number;

  @Field.string(5, { maxLength: 256 })
  errorMessage!: string;
}

/**
 * Get Tasks Request Message
 */
@Message.request(0x02)
export class GetTasksRequest {
  @Field.u32(0)
  offset!: number;

  @Field.u32(4)
  limit!: number;

  @Field.enumField(TaskStatus, 8, { size: 4 })
  statusFilter!: TaskStatus;
}

/**
 * Get Tasks Response Message
 */
@Message.response(0x02)
export class GetTasksResponse {
  @Field.bool(0)
  success!: boolean;

  @Field.u32(1)
  totalCount!: number;

  @Field.u32(5)
  taskCount!: number;

  // Note: Array handling will be implemented in code generator
  // @Field.array('Task', 100, 9)
  // tasks!: Task[];

  @Field.string(131009, { maxLength: 256 })
  errorMessage!: string;
}

/**
 * Update Task Request Message
 */
@Message.request(0x03)
export class UpdateTaskRequest {
  @Field.u32(0)
  id!: number;

  @Field.string(4, { maxLength: 256 })
  title!: string;

  @Field.string(262, { maxLength: 1024 })
  description!: string;

  @Field.enumField(TaskStatus, 1286, { size: 4 })
  status!: TaskStatus;

  @Field.enumField(TaskPriority, 1290, { size: 4 })
  priority!: TaskPriority;

  @Field.timestamp(1294)
  dueDate!: Date;
}

/**
 * Update Task Response Message
 */
@Message.response(0x03)
export class UpdateTaskResponse {
  @Field.bool(0)
  success!: boolean;

  @Field.string(1, { maxLength: 256 })
  errorMessage!: string;
}

/**
 * Delete Task Request Message
 */
@Message.request(0x04)
export class DeleteTaskRequest {
  @Field.u32(0)
  id!: number;
}

/**
 * Delete Task Response Message
 */
@Message.response(0x04)
export class DeleteTaskResponse {
  @Field.bool(0)
  success!: boolean;

  @Field.string(1, { maxLength: 256 })
  errorMessage!: string;
}

/**
 * Get Task Statistics Request Message
 */
@Message.request(0x05)
export class GetTaskStatsRequest {
  // Empty message - no fields needed
}

/**
 * Task Statistics Data
 */
@Binary.struct({ packed: true, size: 20 })
export class TaskStats {
  @Field.u32(0)
  totalTasks!: number;

  @Field.u32(4)
  pendingTasks!: number;

  @Field.u32(8)
  inProgressTasks!: number;

  @Field.u32(12)
  completedTasks!: number;

  @Field.u32(16)
  cancelledTasks!: number;
}

/**
 * Get Task Statistics Response Message
 */
@Message.response(0x05)
export class GetTaskStatsResponse {
  @Field.bool(0)
  success!: boolean;

  // Embedded struct
  @Field.custom('struct', 20, 1)
  stats!: TaskStats;

  @Field.string(21, { maxLength: 256 })
  errorMessage!: string;
}

// Export all types for external use
export type {
  TaskStatus,
  TaskPriority
};

export {
  Task,
  TaskId,
  TaskTitle,
  TaskDescription,
  TaskDueDate,
  CreateTaskRequest,
  CreateTaskResponse,
  GetTasksRequest,
  GetTasksResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskRequest,
  DeleteTaskResponse,
  GetTaskStatsRequest,
  TaskStats,
  GetTaskStatsResponse
};