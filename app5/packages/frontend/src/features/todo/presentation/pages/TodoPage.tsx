import React, { useEffect, useState, useCallback } from 'react';
import { Todo } from '../../domain/entities/Todo.ts'; // Todoエンティティをインポート
import type { AddTodoUseCase } from '../../application/use-cases/AddTodoUseCase.ts';
import type { GetTodosUseCase } from '../../application/use-cases/GetTodosUseCase.ts';
import type { UpdateTodoUseCase } from '../../application/use-cases/UpdateTodoUseCase.ts';
import type { DeleteTodoUseCase } from '../../application/use-cases/DeleteTodoUseCase.ts';
import { TodoForm } from '../components/TodoForm.tsx';
import { TodoList } from '../components/TodoList.tsx';

interface TodoPageProps {
  addTodoUseCase: AddTodoUseCase;
  getTodosUseCase: GetTodosUseCase;
  updateTodoUseCase: UpdateTodoUseCase;
  deleteTodoUseCase: DeleteTodoUseCase;
}

export const TodoPage: React.FC<TodoPageProps> = ({
  addTodoUseCase,
  getTodosUseCase,
  updateTodoUseCase,
  deleteTodoUseCase,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    const fetchedTodos = await getTodosUseCase.execute();
    setTodos(fetchedTodos);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = useCallback(async (title: string) => {
    await addTodoUseCase.execute(title);
    fetchTodos();
  }, [fetchTodos]);

  const handleToggleComplete = useCallback(async (id: string, completed: boolean) => {
    await updateTodoUseCase.execute(id, undefined, completed);
    fetchTodos();
  }, [fetchTodos]);

  const handleDeleteTodo = useCallback(async (id: string) => {
    await deleteTodoUseCase.execute(id);
    fetchTodos();
  }, [fetchTodos]);

  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Todoリスト (DDDサンプル)</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos.map(todo => Todo.toPrimitives(todo))}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
};
