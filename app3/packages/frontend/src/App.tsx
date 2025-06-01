import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


interface Todo {
  id: number;
  title: string;
}

function App() {

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Learn React' },
    { id: 2, title: 'Learn TypeScript' },
    { id: 3, title: 'Build a Todo App' }
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Add a new todo" />
          <button type="submit">Add Todo</button>
        </form>
      </div>
      <div>
        {todos.map(todo => {
          return (
            <div>

              <span>{todo.id}</span>
              <span>{todo.title}</span></div>
            )
          })}
      </div>
    </>
  )
}

export default App
