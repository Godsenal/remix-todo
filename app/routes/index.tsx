import { Heading, Input, Stack } from "@chakra-ui/react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import invariant from "tiny-invariant";
import Todo, { TTodo } from "~/db/Todo.server";
import TodoItem from "~/components/TodoItem";
import { useRef, useEffect } from "react";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  if (request.method === "DELETE") {
    const id = body.get("id");
    invariant(typeof id === "string");

    await Todo.deleteTodo(Number(id));

    return null;
  }

  if (request.method === "PUT") {
    const id = body.get("id");
    const description = body.get("description");
    const completed = body.has("completed");

    invariant(typeof id === "string");
    invariant(typeof description === "string");

    await Todo.updateTodo(Number(id), { description, completed });

    return null;
  }

  const description = body.get("description");

  if (!description) {
    return { error: "description is required", method: request.method };
  }

  invariant(typeof description === "string");

  await Todo.addTodo(description);

  return null;
};

export const loader: LoaderFunction = async () => {
  const todos = await Todo.getTodos();

  return todos;
};

export default function Index() {
  const $form = useRef<HTMLFormElement>(null);
  const todos = useLoaderData<TTodo[]>();
  const actionData = useActionData();
  const transition = useTransition();

  const postError = actionData?.error && actionData?.method === "POST";
  const postedTodo =
    transition.submission?.method === "POST" &&
    String(transition.submission?.formData?.get("description"));

  const optimisticTodos: TTodo[] = postedTodo
    ? [
        { id: Math.random(), description: postedTodo, completed: false },
        ...todos,
      ]
    : todos;

  useEffect(() => {
    transition.state === "submitting" &&
      transition.submission?.method === "POST" &&
      $form.current?.reset();
  }, [transition.state]);

  return (
    <Stack maxW="container.sm" mx="auto" mt="10">
      <Heading textAlign="center">TODO</Heading>
      <Form ref={$form} method="post" replace={true}>
        <Input
          isInvalid={postError}
          errorBorderColor="red.300"
          name="description"
        />
      </Form>
      <Stack>
        {optimisticTodos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </Stack>
    </Stack>
  );
}
