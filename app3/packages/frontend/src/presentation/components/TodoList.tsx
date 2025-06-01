import type { Todo } from '../../domain/entities/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
}


const TodoList = ({todos, onToggle }: TodoListProps ) => {
    return ( 
      <div>
        {todos.map(todo => {
          return (
            <div>
              <span>{todo.id}</span>
              <span>{todo.title}</span>
              <span>
                <label>
                  <input 
                    type="checkbox" 
                    checked={todo.isCompleted} 
                    aria-label={`${todo.title}を完了としてマーク`}
                    onChange={() => onToggle(todo.id)}
                  />
                </label>
              </span>
              </div>
            )
          })}
      </div>
    );
}

export default TodoList;