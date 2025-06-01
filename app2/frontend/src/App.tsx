import React from 'react';
import './App.css';
import { TodoPage } from './frameworks/react/pages/TodoPage';
import { TodoController } from './adapters/controllers/TodoController';
import { TodoPresenter } from './adapters/presenters/TodoPresenter';
import { TodoUseCase } from './core/usecases/TodoUseCase';
import { LocalStorageAdapter } from './adapters/storage/LocalStorageAdapter';

function App() {
  // 依存関係の注入
  const todoRepository = new LocalStorageAdapter();
  const todoUseCase = new TodoUseCase(todoRepository);
  const todoPresenter = new TodoPresenter();
  const todoController = new TodoController(todoUseCase, todoPresenter);

  return (
    <div className="app-container">
      <TodoPage controller={todoController} />
    </div>
  );
}

export default App;
