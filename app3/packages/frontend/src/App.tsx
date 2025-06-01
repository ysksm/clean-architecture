import { useState } from 'react'
import './App.css'
import TodoList from './presentation/components/TodoList';
import type { Todo } from './domain/entities/todo';
import TodoForm from './presentation/components/TodoForm';

function App() {

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Learn React', isCompleted: false },
    { id: 2, title: 'Learn TypeScript', isCompleted: false },
    { id: 3, title: 'Build a Todo App', isCompleted: false }
  ]);

  const onAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const titleInput = e.currentTarget.querySelector('input[name="title"]');
    const newTodoTitle = (titleInput as HTMLInputElement).value;
    if (newTodoTitle.trim() === '') return;
    const newTodo: Todo = {
      id: todos.length + 1,
      title: newTodoTitle,
      isCompleted: false
    }
    setTodos([...todos, newTodo]);
  };

  const onToggle = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  return (
    <>
      <TodoForm onAddTodo={onAdd} />
      <TodoList todos={todos} onToggle={onToggle} />
    </>
  )
}

export default App
