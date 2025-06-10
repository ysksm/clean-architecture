import React, { useEffect } from 'react';
import { useTaskContext } from '../contexts/TaskContext';

export const TaskStats: React.FC = () => {
  const { stats, loading, error, getTaskStats } = useTaskContext();

  useEffect(() => {
    getTaskStats();
  }, [getTaskStats]);

  if (loading && !stats) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading stats...</div>;
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
        Error loading stats: {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    { label: 'Total Tasks', value: stats.totalTasks, color: '#007bff' },
    { label: 'Pending', value: stats.pendingTasks, color: '#ffc107' },
    { label: 'In Progress', value: stats.inProgressTasks, color: '#17a2b8' },
    { label: 'Completed', value: stats.completedTasks, color: '#28a745' },
    { label: 'Cancelled', value: stats.cancelledTasks, color: '#6c757d' }
  ];

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3>Task Statistics</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px' 
      }}>
        {statItems.map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: item.color,
                marginBottom: '8px'
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#666',
                fontWeight: '500'
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};