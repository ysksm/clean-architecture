import type { Todo } from '../../core/entities/Todo';

/**
 * Todoの表示状態を表す型
 */
export interface TodoViewModel {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // 表示用にフォーマットされた日付
}

/**
 * フィルタリングの種類
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Todoの表示ロジックを担当するプレゼンター
 */
export class TodoPresenter {
  /**
   * Todoエンティティを表示用のViewModelに変換
   */
  toViewModel(todo: Todo): TodoViewModel {
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: this.formatDate(todo.createdAt)
    };
  }

  /**
   * 複数のTodoエンティティを表示用のViewModelに変換
   */
  toViewModels(todos: Todo[]): TodoViewModel[] {
    return todos.map(todo => this.toViewModel(todo));
  }

  /**
   * フィルタータイプに基づいてTodoをフィルタリング
   */
  filterTodos(todos: TodoViewModel[], filterType: FilterType): TodoViewModel[] {
    switch (filterType) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  }

  /**
   * 日付を表示用にフォーマット
   */
  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
