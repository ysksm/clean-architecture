import React, { useState } from 'react';
import { TaskPriority } from '@shared/idl/generator';
import { useTaskContext } from '../contexts/TaskContext';

export const TaskForm: React.FC = () => {
  const { createTask, loading } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (!dueDate) {
      alert('Please select a due date');
      return;
    }

    await createTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: new Date(dueDate)
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Create New Task</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          maxLength={256}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          maxLength={1024}
          rows={3}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="priority" style={{ display: 'block', marginBottom: '5px' }}>Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value) as TaskPriority)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value={TaskPriority.LOW}>Low</option>
          <option value={TaskPriority.MEDIUM}>Medium</option>
          <option value={TaskPriority.HIGH}>High</option>
          <option value={TaskPriority.URGENT}>Urgent</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="dueDate" style={{ display: 'block', marginBottom: '5px' }}>Due Date:</label>
        <input
          id="dueDate"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};