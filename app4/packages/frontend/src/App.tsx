import React from 'react';
import { TodoPage } from './presentation/pages/TodoPage';
import './App.css'; // 必要であれば残す、今回はシンプルなスタイルなので残します

import type { AddTodoUseCase } from './application/use-cases/AddTodoUseCase.ts';
import type { GetTodosUseCase } from './application/use-cases/GetTodosUseCase.ts';
import type { UpdateTodoUseCase } from './application/use-cases/UpdateTodoUseCase.ts';
import type { DeleteTodoUseCase } from './application/use-cases/DeleteTodoUseCase.ts';

interface AppProps {
  addTodoUseCase: AddTodoUseCase;
  getTodosUseCase: GetTodosUseCase;
  updateTodoUseCase: UpdateTodoUseCase;
  deleteTodoUseCase: DeleteTodoUseCase;
}

function App({ addTodoUseCase, getTodosUseCase, updateTodoUseCase, deleteTodoUseCase }: AppProps) {
  return (
    <TodoPage
      addTodoUseCase={addTodoUseCase}
      getTodosUseCase={getTodosUseCase}
      updateTodoUseCase={updateTodoUseCase}
      deleteTodoUseCase={deleteTodoUseCase}
    />
  );
}

export default App;
