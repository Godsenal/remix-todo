import { ActionFunction, redirect } from "remix";
import Todo from "~/db/Todo.server";

export const action: ActionFunction = async ({ params }) => {
  await Todo.deleteTodo(Number(params.todoId));

  return null;
};
