import './App.css';
import { TodoPresenter } from './adapters/presenters/TodoPresenter';
import { TodoList } from './adapters/controllers/TodoList';
import { TodoUseCase } from './application/usecases/TodoUseCase';
import { LocalStorageTodoRepository } from './infrastructure/api/LocalStorageTodoRepository';

function App() {
  // クリーンアーキテクチャに従って依存関係を注入
  const todoRepository = new LocalStorageTodoRepository();
  const todoUseCase = new TodoUseCase(todoRepository);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo アプリケーション</h1>
        <p>クリーンアーキテクチャ採用 - React + TypeScript</p>
      </header>
      
      <main className="app-content">
        <TodoPresenter todoUseCase={todoUseCase}>
          <TodoList />
        </TodoPresenter>
      </main>
      
      <footer className="app-footer">
        <p>© 2025 クリーンアーキテクチャ Todo アプリ</p>
      </footer>
    </div>
  )
}

export default App
