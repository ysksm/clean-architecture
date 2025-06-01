import { useState } from 'react'
import './App.css'
import TodoList from './presentation/components/TodoList';
import type { Todo } from './domain/entities/todo';
import TodoForm from './presentation/components/TodoForm';

function App() {

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Learn React' },
    { id: 2, title: 'Learn TypeScript' },
    { id: 3, title: 'Build a Todo App' }
  ]);

  const onAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const titleInput = e.currentTarget.querySelector('input[name="title"]');
    const newTodoTitle = (titleInput as HTMLInputElement).value;
    if (newTodoTitle.trim() === '') return;
    const newTodo: Todo = {
      id: todos.length + 1,
      title: newTodoTitle
    }
    setTodos([...todos, newTodo]);
  };

  return (
    <>
      <TodoForm onAddTodo={onAdd} />
      <TodoList todos={todos} />
    </>
  )
}

export default App
