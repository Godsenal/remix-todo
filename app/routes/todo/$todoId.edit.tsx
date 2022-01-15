import { ActionFunction, redirect } from "remix";
import invariant from "tiny-invariant";
import Todo from "~/db/Todo.server";

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();

  const description = body.get("description");
  const completed = body.get("completed") === "true";

  invariant(typeof description === "string");

  await Todo.updateTodo(Number(params.todoId), { description, completed });

  return redirect("/todo");
};

const TodoEdit = () => {
  return null;
};

export default TodoEdit;
