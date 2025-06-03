import React from 'react';
import { AddTodo } from './presentation/components/AddTodo';
import { TodoList } from './presentation/components/TodoList';
import { useTodos } from './presentation/hooks/useTodos';
import './App.css';

function App() {
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    completeTodo,
    uncompleteTodo,
    deleteTodo,
  } = useTodos();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        <p>A clean architecture todo application</p>
      </header>
      
      <main className="app-main">
        <section className="add-todo-section">
          <AddTodo onAdd={createTodo} />
        </section>
        
        <section className="todo-list-section">
          <TodoList
            todos={todos}
            loading={loading}
            error={error}
            onComplete={completeTodo}
            onUncomplete={uncompleteTodo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
