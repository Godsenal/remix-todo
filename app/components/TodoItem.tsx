import { Button, Checkbox, HStack, Input, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Form, useSubmit, useTransition } from "remix";
import type { TTodo } from "~/db/Todo.server";

const TodoItem = (todo: TTodo) => {
  const $form = useRef<HTMLFormElement>(null);
  const [editMode, setEditMode] = useState(false);
  const submit = useSubmit();

  const { submission } = useTransition();
  const editAction = `/todo/${todo.id}/edit`;
  const deleteAction = `/todo/${todo.id}/delete`;

  const submittedForm =
    submission?.action === editAction
      ? Object.fromEntries(submission?.formData.entries() || [])
      : null;

  const { description, completed } = {
    description: submittedForm
      ? String(submittedForm.description)
      : todo.description,
    completed: submittedForm
      ? submittedForm.completed === "on"
      : todo.completed,
  };

  if (submission?.action === deleteAction) {
    return null;
  }

  return (
    <HStack>
      <Form
        style={{ flex: 1 }}
        ref={$form}
        method="put"
        action={editAction}
        replace={true}
        onSubmit={() => {
          setEditMode(false);
        }}
      >
        <HStack>
          <input type="hidden" name="description" defaultValue={description} />
          {editMode ? (
            <>
              <input
                type="hidden"
                name="completed"
                value={String(todo.completed)}
              />
              <Input
                autoFocus={true}
                name="description"
                defaultValue={description}
              />
            </>
          ) : (
            <>
              <Checkbox
                name="completed"
                value="true"
                defaultChecked={completed}
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
      <Form method="delete" action={deleteAction} replace={true}>
        <Button type="submit">Delete</Button>
      </Form>
    </HStack>
  );
};

export default TodoItem;
