import { TodoPage } from './features/todo/presentation/pages/TodoPage';
import './App.css'; // 必要であれば残す、今回はシンプルなスタイルなので残します

import { AddTodoUseCase } from './features/todo/application/use-cases/AddTodoUseCase.ts';
import { GetTodosUseCase } from './features/todo/application/use-cases/GetTodosUseCase.ts';
import { UpdateTodoUseCase } from './features/todo/application/use-cases/UpdateTodoUseCase.ts';
import { DeleteTodoUseCase } from './features/todo/application/use-cases/DeleteTodoUseCase.ts';

// DDDの依存関係をここでインスタンス化
import { InMemoryTodoRepository } from './features/todo/infrastructure/repositories/InMemoryTodoRepository.ts';


const todoRepository = new InMemoryTodoRepository();
const addTodoUseCase = new AddTodoUseCase(todoRepository);
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

function App() {
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
