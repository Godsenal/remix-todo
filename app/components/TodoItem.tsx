import { Button, Checkbox, HStack, Input, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Form, useSubmit, useTransition } from "remix";
import type { TTodo } from "~/db/Todo.server";

const TodoItem = (todo: TTodo) => {
  const $form = useRef<HTMLFormElement>(null);
  const [editMode, setEditMode] = useState(false);
  const submit = useSubmit();

  const { submission } = useTransition();
  const isCurrentSubmission =
    submission?.formData?.get("id") === String(todo.id);

  const submittedForm = isCurrentSubmission
    ? Object.fromEntries(submission?.formData.entries() || [])
    : null;

  const { id, description, completed } = {
    id: todo.id,
    description: submittedForm
      ? String(submittedForm.description)
      : todo.description,
    completed: submittedForm ? "completed" in submittedForm : todo.completed,
  };

  if (isCurrentSubmission && submission.method === "DELETE") {
    return null;
  }

  return (
    <HStack>
      <Form
        style={{ flex: 1 }}
        ref={$form}
        method="put"
        replace={true}
        onSubmit={() => {
          setEditMode(false);
        }}
      >
        <HStack>
          <input type="hidden" name="id" defaultValue={id} />
          <input type="hidden" name="description" defaultValue={description} />
          {editMode ? (
            <Input
              autoFocus={true}
              name="description"
              defaultValue={description}
            />
          ) : (
            <>
              <Checkbox
                name="completed"
                checked={completed}
                onChange={() => {
                  submit($form.current, { method: "put", replace: true });
                }}
              />
              <Text
                onDoubleClick={() => setEditMode(true)}
                flex={1}
                sx={{
                  "label[data-checked] + &": {
                    textDecoration: "line-through",
                    color: "gray",
                  },
                }}
              >
                {description}
              </Text>
            </>
          )}
        </HStack>
      </Form>
      <Form method="delete" replace={true}>
        <input type="hidden" name="id" defaultValue={id} />
        <Button type="submit">Delete</Button>
      </Form>
    </HStack>
  );
};

export default TodoItem;
