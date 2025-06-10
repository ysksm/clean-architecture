import express from 'express';
import cors from 'cors';
import { TaskController } from './presentation/controllers/TaskController.js';
import { TaskApplicationService } from './application/services/TaskApplicationService.js';
import { InMemoryTaskRepository } from './infrastructure/repositories/InMemoryTaskRepository.js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

// Dependency Injection
const taskRepository = new InMemoryTaskRepository();
const taskApplicationService = new TaskApplicationService(taskRepository);
const taskController = new TaskController(taskApplicationService);

// Routes
app.post('/api/tasks', (req, res) => taskController.createTask(req, res));
app.get('/api/tasks', (req, res) => taskController.getTasks(req, res));
app.post('/api/tasks/update', (req, res) => taskController.updateTask(req, res));
app.post('/api/tasks/delete', (req, res) => taskController.deleteTask(req, res));
app.get('/api/tasks/stats', (req, res) => taskController.getTaskStats(req, res));

app.listen(port, () => {
  console.log(`Task Management Backend running on port ${port}`);
});