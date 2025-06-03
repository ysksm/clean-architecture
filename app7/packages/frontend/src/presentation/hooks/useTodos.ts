import { useState, useEffect, useCallback } from 'react';
import { TodoEntity } from '../../domain/entities/Todo';
import { getContainer, TYPES } from '../../infrastructure/di/containerConfig';
import { TodoUseCase } from '../../application/usecases/TodoUseCase';

export function useTodos() {
  const [todos, setTodos] = useState<TodoEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todoUseCase = getContainer().get<TodoUseCase>(TYPES.TodoUseCase);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const todoList = await todoUseCase.getAllTodos();
      setTodos(todoList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [todoUseCase]);

  const createTodo = useCallback(async (title: string, description?: string) => {
    setError(null);
    try {
      const newTodo = await todoUseCase.createTodo(title, description);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [todoUseCase]);

  const updateTodo = useCallback(async (id: string, title?: string, description?: string) => {
    setError(null);
    try {
      const updatedTodo = await todoUseCase.updateTodo(id, title, description);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      return updatedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [todoUseCase]);

  const completeTodo = useCallback(async (id: string) => {
    setError(null);
    try {
      const completedTodo = await todoUseCase.completeTodo(id);
      setTodos(prev => prev.map(todo => todo.id === id ? completedTodo : todo));
      return completedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [todoUseCase]);

  const uncompleteTodo = useCallback(async (id: string) => {
    setError(null);
    try {
      const uncompletedTodo = await todoUseCase.uncompleteTodo(id);
      setTodos(prev => prev.map(todo => todo.id === id ? uncompletedTodo : todo));
      return uncompletedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to uncomplete todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [todoUseCase]);

  const deleteTodo = useCallback(async (id: string) => {
    setError(null);
    try {
      await todoUseCase.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [todoUseCase]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos,
    loading,
    error,
    loadTodos,
    createTodo,
    updateTodo,
    completeTodo,
    uncompleteTodo,
    deleteTodo,
  };
}
