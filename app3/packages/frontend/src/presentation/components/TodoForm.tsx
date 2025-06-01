
import React from 'react';

interface TodoFormProps {
    onAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TodoForm = ({ onAddTodo }: TodoFormProps) => {
    return (
        <>
            <div>
                <form onSubmit={onAddTodo}>
                <input type="text" name="title" placeholder="Add a new todo" />
                <button type="submit">Add Todo</button>
                </form>
            </div>
        </>
    )
}

export default TodoForm;
