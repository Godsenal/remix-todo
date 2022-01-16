import { ActionFunction, redirect } from "remix";
import invariant from "tiny-invariant";
import Todo from "~/db/Todo.server";

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();

  const form = Object.fromEntries(body.entries() || []);
  const updateTodo: Record<string, string | boolean> = {
    ...form,
    ...("completed" in form && { completed: form.completed === "true" }),
  };

  await Todo.updateTodo(Number(params.todoId), updateTodo);

  return null;
};
