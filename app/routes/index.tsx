import { Box, Heading, Input, Stack } from "@chakra-ui/react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";
import Todo, { TTodo } from "~/db/Todo.server";
import TodoItem from "~/components/TodoItem";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
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
  const todos = useLoaderData<TTodo[]>();
  const actionData = useActionData();

  const postError = actionData?.error && actionData?.method === "POST";

  return (
    <Stack maxW="container.sm" mx="auto" mt="10">
      <Heading textAlign="center">TODO</Heading>
      <Form method="post">
        <Input
          isInvalid={postError}
          errorBorderColor="red.300"
          name="description"
        />
      </Form>
      <Stack>
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </Stack>
    </Stack>
  );
}
