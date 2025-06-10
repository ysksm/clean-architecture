import React, { useEffect } from 'react';
import { TaskStatus } from '@shared/idl/generator';
import { useTaskContext } from '../contexts/TaskContext';
import { TaskItem } from './TaskItem';

export const TaskList: React.FC = () => {
  const { tasks, loading, error, getTasks } = useTaskContext();

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  if (loading && tasks.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading tasks...</div>;
  }

  if (error) {
    return (
      <div style={{ 
        color: 'red', 
        padding: '10px', 
        backgroundColor: '#ffe6e6', 
        borderRadius: '4px', 
        marginBottom: '20px' 
      }}>
        Error: {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}>
        No tasks found. Create your first task above!
      </div>
    );
  }

  const groupedTasks = {
    pending: tasks.filter(task => task.status === TaskStatus.PENDING),
    inProgress: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    completed: tasks.filter(task => task.status === TaskStatus.COMPLETED),
    cancelled: tasks.filter(task => task.status === TaskStatus.CANCELLED)
  };

  return (
    <div>
      <h3>Tasks</h3>
      
      {groupedTasks.pending.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#ffc107', borderBottom: '2px solid #ffc107', paddingBottom: '5px' }}>
            Pending ({groupedTasks.pending.length})
          </h4>
          {groupedTasks.pending.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {groupedTasks.inProgress.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
            In Progress ({groupedTasks.inProgress.length})
          </h4>
          {groupedTasks.inProgress.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {groupedTasks.completed.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '5px' }}>
            Completed ({groupedTasks.completed.length})
          </h4>
          {groupedTasks.completed.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {groupedTasks.cancelled.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#6c757d', borderBottom: '2px solid #6c757d', paddingBottom: '5px' }}>
            Cancelled ({groupedTasks.cancelled.length})
          </h4>
          {groupedTasks.cancelled.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};