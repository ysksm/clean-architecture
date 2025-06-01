import type { TodoUseCase } from '../../core/usecases/TodoUseCase';
import type { TodoPresenter, TodoViewModel, FilterType } from '../presenters/TodoPresenter';

/**
 * Todoの入力処理を担当するコントローラー
 */
export class TodoController {
  private useCase: TodoUseCase;
  private presenter: TodoPresenter;
  private currentFilter: FilterType = 'all';

  constructor(useCase: TodoUseCase, presenter: TodoPresenter) {
    this.useCase = useCase;
    this.presenter = presenter;
  }

  /**
   * すべてのTodoを取得
   */
  async getAllTodos(): Promise<TodoViewModel[]> {
    const todos = await this.useCase.getAllTodos();
    const viewModels = this.presenter.toViewModels(todos);
    return this.presenter.filterTodos(viewModels, this.currentFilter);
  }

  /**
   * フィルタータイプを設定
   */
  setFilter(filterType: FilterType): void {
    this.currentFilter = filterType;
  }

  /**
   * 現在のフィルタータイプを取得
   */
  getCurrentFilter(): FilterType {
    return this.currentFilter;
  }

  /**
   * 新しいTodoを作成
   */
  async createTodo(title: string): Promise<TodoViewModel> {
    try {
      const newTodo = await this.useCase.createTodo({ title });
      return this.presenter.toViewModel(newTodo);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Todoの作成に失敗しました: ${error.message}`);
      }
      throw new Error('Todoの作成に失敗しました');
    }
  }

  /**
   * Todoの完了状態を切り替え
   */
  async toggleTodoCompletion(id: string): Promise<TodoViewModel | null> {
    const updatedTodo = await this.useCase.toggleTodoCompletion(id);
    
    if (!updatedTodo) {
      return null;
    }
    
    return this.presenter.toViewModel(updatedTodo);
  }

  /**
   * Todoのタイトルを更新
   */
  async updateTodoTitle(id: string, title: string): Promise<TodoViewModel | null> {
    try {
      const updatedTodo = await this.useCase.updateTodoTitle(id, title);
      
      if (!updatedTodo) {
        return null;
      }
      
      return this.presenter.toViewModel(updatedTodo);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Todoの更新に失敗しました: ${error.message}`);
      }
      throw new Error('Todoの更新に失敗しました');
    }
  }

  /**
   * Todoを削除
   */
  async deleteTodo(id: string): Promise<boolean> {
    return this.useCase.deleteTodo(id);
  }
}
