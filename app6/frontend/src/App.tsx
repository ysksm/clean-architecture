import React from 'react';
import { TaskProvider } from './presentation/contexts/TaskContext';
import { TaskForm } from './presentation/components/TaskForm';
import { TaskList } from './presentation/components/TaskList';
import { TaskStats } from './presentation/components/TaskStats';

function App() {
  return (
    <TaskProvider>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ 
            color: '#343a40', 
            marginBottom: '10px',
            fontSize: '2.5rem'
          }}>
            Task Management System
          </h1>
          <p style={{ 
            color: '#6c757d', 
            fontSize: '1.1rem',
            margin: 0
          }}>
            Built with Domain-Driven Design and Binary Communication
          </p>
        </header>

        <main>
          <TaskStats />
          <TaskForm />
          <TaskList />
        </main>

        <footer style={{ 
          marginTop: '40px', 
          padding: '20px 0', 
          textAlign: 'center', 
          borderTop: '1px solid #dee2e6',
          color: '#6c757d',
          fontSize: '14px'
        }}>
          <p>
            Frontend: React + TypeScript with DDD Architecture<br />
            Backend: Bun.sh + Express with Layered Architecture<br />
            Communication: Binary Protocol using IDL-defined structures
          </p>
        </footer>
      </div>
    </TaskProvider>
  );
}

export default App;