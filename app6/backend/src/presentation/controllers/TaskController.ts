import { Request, Response } from 'express';
import { TaskApplicationService } from '../../application/services/TaskApplicationService.js';
import { BinaryProtocol } from '../../../../shared/idl/generator.js';
import type { CreateTaskRequest, UpdateTaskRequest, GetTasksRequest, DeleteTaskRequest, GetTaskStatsRequest } from '../../../../shared/idl/generator.js';

export class TaskController {
  constructor(private readonly taskApplicationService: TaskApplicationService) {}

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const requestData = BinaryProtocol.deserializeCreateTaskRequest(req.body.buffer);
      
      const taskDto = await this.taskApplicationService.createTask({
        title: requestData.title.value,
        description: requestData.description.value,
        priority: requestData.priority,
        dueDate: requestData.dueDate.timestamp
      });

      const response = {
        success: true,
        taskId: { value: taskDto.id },
        errorMessage: ''
      };

      const binaryResponse = BinaryProtocol.serializeCreateTaskResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(Buffer.from(binaryResponse));
    } catch (error) {
      const response = {
        success: false,
        taskId: { value: 0 },
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };

      const binaryResponse = BinaryProtocol.serializeCreateTaskResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.status(400).send(Buffer.from(binaryResponse));
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      let criteria = {};
      
      if (req.headers['content-type'] === 'application/octet-stream' && req.body.length > 0) {
        const requestData = BinaryProtocol.deserializeGetTasksRequest(req.body.buffer);
        criteria = {
          offset: requestData.offset,
          limit: requestData.limit,
          status: requestData.statusFilter
        };
      }

      const tasks = await this.taskApplicationService.getTasks(criteria);

      const response = {
        success: true,
        totalCount: tasks.length,
        taskCount: tasks.length,
        tasks: tasks.map(task => ({
          id: { value: task.id },
          title: { length: task.title.length, value: task.title },
          description: { length: task.description.length, value: task.description },
          status: task.status,
          priority: task.priority,
          dueDate: { timestamp: task.dueDate },
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        })),
        errorMessage: ''
      };

      const binaryResponse = BinaryProtocol.serializeGetTasksResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(Buffer.from(binaryResponse));
    } catch (error) {
      const response = {
        success: false,
        totalCount: 0,
        taskCount: 0,
        tasks: [],
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };

      const binaryResponse = BinaryProtocol.serializeGetTasksResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.status(400).send(Buffer.from(binaryResponse));
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const requestData = BinaryProtocol.deserializeUpdateTaskRequest(req.body.buffer);
      
      await this.taskApplicationService.updateTask({
        id: requestData.id.value,
        title: requestData.title.value,
        description: requestData.description.value,
        status: requestData.status,
        priority: requestData.priority,
        dueDate: requestData.dueDate.timestamp
      });

      const response = {
        success: true,
        errorMessage: ''
      };

      const binaryResponse = BinaryProtocol.serializeUpdateTaskResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(Buffer.from(binaryResponse));
    } catch (error) {
      const response = {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };

      const binaryResponse = BinaryProtocol.serializeUpdateTaskResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.status(400).send(Buffer.from(binaryResponse));
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const requestData = BinaryProtocol.deserializeDeleteTaskRequest(req.body.buffer);
      
      const deleted = await this.taskApplicationService.deleteTask(requestData.id.value);

      const response = {
        success: deleted,
        errorMessage: deleted ? '' : 'Task not found'
      };

      const binaryResponse = BinaryProtocol.serializeDeleteTaskResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(Buffer.from(binaryResponse));
    } catch (error) {
      const response = {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };

      const binaryResponse = BinaryProtocol.serializeDeleteTaskResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.status(400).send(Buffer.from(binaryResponse));
    }
  }

  async getTaskStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.taskApplicationService.getTaskStats();

      const response = {
        success: true,
        stats,
        errorMessage: ''
      };

      const binaryResponse = BinaryProtocol.serializeGetTaskStatsResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(Buffer.from(binaryResponse));
    } catch (error) {
      const response = {
        success: false,
        stats: {
          totalTasks: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
          cancelledTasks: 0
        },
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };

      const binaryResponse = BinaryProtocol.serializeGetTaskStatsResponse(response);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.status(400).send(Buffer.from(binaryResponse));
    }
  }
}