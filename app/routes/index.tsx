import { Heading, Input, Stack } from "@chakra-ui/react";
import {
  ActionFunction,
  LoaderFunction,
  useFetcher,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";
import Todo, { TTodo } from "~/db/Todo.server";
import TodoItem from "~/components/TodoItem";
import { useRef, useEffect } from "react";

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
  const $form = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const todos = useLoaderData<TTodo[]>();
  const postedTodo =
    fetcher.submission &&
    String(fetcher.submission?.formData?.get("description"));

  const optimisticTodos: TTodo[] = postedTodo
    ? [
        { id: Math.random(), description: postedTodo, completed: false },
        ...todos,
      ]
    : todos;

  useEffect(() => {
    fetcher.type === "actionSubmission" && $form.current?.reset();
  }, [fetcher]);

  return (
    <Stack maxW="container.sm" mx="auto" mt="10">
      <Heading textAlign="center">TODO</Heading>
      <fetcher.Form ref={$form} method="post">
        <Input
          isInvalid={!!fetcher.data?.error}
          errorBorderColor="red.300"
          name="description"
        />
      </fetcher.Form>
      <Stack>
        {optimisticTodos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </Stack>
    </Stack>
  );
}
