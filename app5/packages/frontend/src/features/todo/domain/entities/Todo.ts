import { TodoId } from '../value-objects/TodoId.ts';
import { TodoTitle } from '../value-objects/TodoTitle.ts';
import { TodoStatus } from '../value-objects/TodoStatus.ts';

export interface TodoPrimitive {
  id: string;
  title: string;
  status: 'pending' | 'completed';
}

export type Todo = {
   id: TodoId;
   title: TodoTitle;
   status: TodoStatus;
}

export const Todo = {
  create: (id: TodoId, title: TodoTitle, status: TodoStatus) => ({
    id,
    title,
    status,
  }),
  new: (title: TodoTitle) => ({
    id: TodoId.generate(),
    title,
    status: TodoStatus.create('pending'),
  }),
  changeTitle: (todo: Todo, title: TodoTitle): Todo => ({
    ...todo,
    title,
  }),
  markAsCompleted: (todo: Todo): Todo => ({
    ...todo,
    status: TodoStatus.create('completed'),
  }),
  markAsPending: (todo: Todo): Todo => ({
    ...todo,
    status: TodoStatus.create('pending'),
  }),
  getTitle: (todo: Todo): TodoTitle => todo.title,
  getStatus: (todo: Todo): TodoStatus => todo.status,
  toPrimitives(todo: Todo): TodoPrimitive {
    return {
      id: todo.id.value,
      title: todo.title.value,
      status: todo.status.value,
    };
  }
}
