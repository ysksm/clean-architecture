import React, { useState } from 'react';
import { Task } from '@domain/entities/Task';
import { TaskStatus, TaskPriority } from '@shared/idl/generator';
import { useTaskContext } from '../contexts/TaskContext';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, loading } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate.toISOString().slice(0, 16)
  );

  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    await updateTask({
      id: task.id,
      title: editTitle.trim(),
      description: editDescription.trim(),
      status: editStatus,
      priority: editPriority,
      dueDate: new Date(editDueDate)
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate.toISOString().slice(0, 16));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW: return '#6c757d';
      case TaskPriority.MEDIUM: return '#ffc107';
      case TaskPriority.HIGH: return '#fd7e14';
      case TaskPriority.URGENT: return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING: return '#ffc107';
      case TaskStatus.IN_PROGRESS: return '#007bff';
      case TaskStatus.COMPLETED: return '#28a745';
      case TaskStatus.CANCELLED: return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (isEditing) {
    return (
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={256}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            maxLength={1024}
            rows={3}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Status:</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(Number(e.target.value) as TaskStatus)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value={TaskStatus.PENDING}>Pending</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
              <option value={TaskStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Priority:</label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(Number(e.target.value) as TaskPriority)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.URGENT}>Urgent</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Due Date:</label>
            <input
              type="datetime-local"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      backgroundColor: task.isCompleted() ? '#f8f9fa' : 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <h4 style={{ 
          margin: 0, 
          textDecoration: task.isCompleted() ? 'line-through' : 'none',
          color: task.isCompleted() ? '#6c757d' : 'inherit'
        }}>
          {task.title}
        </h4>
        <div style={{ display: 'flex', gap: '5px' }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: getPriorityColor(task.priority),
            color: 'white',
            fontSize: '12px'
          }}>
            {task.getPriorityLabel()}
          </span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: getStatusColor(task.status),
            color: 'white',
            fontSize: '12px'
          }}>
            {task.getStatusLabel()}
          </span>
        </div>
      </div>

      {task.description && (
        <p style={{ 
          margin: '0 0 10px 0', 
          color: task.isCompleted() ? '#6c757d' : '#666',
          textDecoration: task.isCompleted() ? 'line-through' : 'none'
        }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
        <div>
          <div>Due: {task.dueDate.toLocaleString()}</div>
          <div>Created: {task.createdAt.toLocaleString()}</div>
          {task.updatedAt.getTime() !== task.createdAt.getTime() && (
            <div>Updated: {task.updatedAt.toLocaleString()}</div>
          )}
          {task.isOverdue() && (
            <div style={{ color: '#dc3545', fontWeight: 'bold' }}>OVERDUE</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};