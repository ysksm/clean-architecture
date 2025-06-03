import { Request, Response } from 'express';
import { TodoUseCase } from '../../application/usecases/TodoUseCase';

export class TodoController {
  constructor(private todoUseCase: TodoUseCase) {}

  async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const todos = await this.todoUseCase.getAllTodos();
      res.json(todos);
    } catch (error) {
      console.error('Error getting all todos:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await this.todoUseCase.getTodoById(id);
      
      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }
      
      res.json(todo);
    } catch (error) {
      console.error('Error getting todo by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      
      if (!title || typeof title !== 'string') {
        res.status(400).json({ error: 'Title is required and must be a string' });
        return;
      }
      
      const todo = await this.todoUseCase.createTodo(title, description);
      res.status(201).json(todo);
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      
      const todo = await this.todoUseCase.updateTodo(id, title, description);
      res.json(todo);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async completeTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await this.todoUseCase.completeTodo(id);
      res.json(todo);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }
      console.error('Error completing todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async uncompleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await this.todoUseCase.uncompleteTodo(id);
      res.json(todo);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }
      console.error('Error uncompleting todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.todoUseCase.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }
      console.error('Error deleting todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
