import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// DDDの依存関係をここでインスタンス化
import { InMemoryTodoRepository } from './infrastructure/repositories/InMemoryTodoRepository.ts';
import { AddTodoUseCase } from './application/use-cases/AddTodoUseCase.ts';
import { GetTodosUseCase } from './application/use-cases/GetTodosUseCase.ts';
import { UpdateTodoUseCase } from './application/use-cases/UpdateTodoUseCase.ts';
import { DeleteTodoUseCase } from './application/use-cases/DeleteTodoUseCase.ts';

const todoRepository = new InMemoryTodoRepository();
const addTodoUseCase = new AddTodoUseCase(todoRepository);
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      addTodoUseCase={addTodoUseCase}
      getTodosUseCase={getTodosUseCase}
      updateTodoUseCase={updateTodoUseCase}
      deleteTodoUseCase={deleteTodoUseCase}
    />
  </StrictMode>,
);
