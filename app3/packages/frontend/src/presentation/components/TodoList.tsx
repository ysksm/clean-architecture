import type { Todo } from '../../domain/entities/todo';

interface TodoListProps {
  todos: Todo[];
}


const TodoList = ({todos }: TodoListProps ) => {
    return ( 
      <div>
        {todos.map(todo => {
          return (
            <div>
              <span>{todo.id}</span>
              <span>{todo.title}</span></div>
            )
          })}
      </div>
    );
}

export default TodoList;