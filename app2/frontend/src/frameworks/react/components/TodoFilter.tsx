import React from 'react';
import type { FilterType } from '../../../adapters/presenters/TodoPresenter';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todoCount: {
    total: number;
    active: number;
    completed: number;
  };
}

export function TodoFilter({ currentFilter, onFilterChange, todoCount }: TodoFilterProps) {
  return (
    <div className="todo-filter">
      <div className="filter-buttons">
        <button
          className={`filter-button ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
          aria-pressed={currentFilter === 'all' ? 'true' : 'false'}
        >
          すべて <span className="count">({todoCount.total})</span>
        </button>
        <button
          className={`filter-button ${currentFilter === 'active' ? 'active' : ''}`}
          onClick={() => onFilterChange('active')}
          aria-pressed={currentFilter === 'active' ? 'true' : 'false'}
        >
          未完了 <span className="count">({todoCount.active})</span>
        </button>
        <button
          className={`filter-button ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
          aria-pressed={currentFilter === 'completed' ? 'true' : 'false'}
        >
          完了済み <span className="count">({todoCount.completed})</span>
        </button>
      </div>
    </div>
  );
}
