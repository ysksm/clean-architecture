import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';

export function createTodoRoutes(todoController: TodoController): Router {
  const router = Router();

  router.get('/todos', (req, res) => todoController.getAllTodos(req, res));
  router.get('/todos/:id', (req, res) => todoController.getTodoById(req, res));
  router.post('/todos', (req, res) => todoController.createTodo(req, res));
  router.put('/todos/:id', (req, res) => todoController.updateTodo(req, res));
  router.patch('/todos/:id/complete', (req, res) => todoController.completeTodo(req, res));
  router.patch('/todos/:id/uncomplete', (req, res) => todoController.uncompleteTodo(req, res));
  router.delete('/todos/:id', (req, res) => todoController.deleteTodo(req, res));

  return router;
}
