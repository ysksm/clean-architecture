import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Task } from '@domain/entities/Task';
import { TaskUseCases } from '@application/usecases/TaskUseCases';
import { HttpTaskRepository } from '@infrastructure/repositories/HttpTaskRepository';
import { CreateTaskRequest, UpdateTaskRequest, TaskSearchCriteria, TaskStats } from '@domain/repositories/ITaskRepository';

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats | null;
  loading: boolean;
  error: string | null;
  createTask: (request: CreateTaskRequest) => Promise<void>;
  getTasks: (criteria?: TaskSearchCriteria) => Promise<void>;
  updateTask: (request: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  getTaskStats: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskRepository = new HttpTaskRepository();
const taskUseCases = new TaskUseCases(taskRepository);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (request: CreateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await taskUseCases.createTask(request);
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTasks = useCallback(async (criteria?: TaskSearchCriteria) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskUseCases.getTasks(criteria);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (request: UpdateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskUseCases.updateTask(request);
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const success = await taskUseCases.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTaskStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedStats = await taskUseCases.getTaskStats();
      setStats(fetchedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const value: TaskContextType = {
    tasks,
    stats,
    loading,
    error,
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskStats
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};