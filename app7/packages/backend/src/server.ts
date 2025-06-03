import express from 'express';
import cors from 'cors';
import { createContainer, TYPES } from './infrastructure/di/containerConfig';
import { createTodoRoutes } from './presentation/routes/todoRoutes';
import { TodoController } from './presentation/controllers/TodoController';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// DI Container setup
const container = createContainer();
const todoController = container.get<TodoController>(TYPES.TodoController);

// Routes
app.use('/api', createTodoRoutes(todoController));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
