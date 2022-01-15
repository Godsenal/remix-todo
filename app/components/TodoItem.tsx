import {
  Button,
  Center,
  Checkbox,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
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

  const optimisticDescription =
    submission?.action === editAction &&
    submission?.formData?.has("description")
      ? String(submission.formData.get("description"))
      : todo.description;

  if (submission?.action === deleteAction) {
    return null;
  }

  return (
    <HStack>
      {editMode ? (
        <Form
          style={{ width: "100%" }}
          method="put"
          action={editAction}
          replace={true}
          onSubmit={() => {
            setEditMode(false);
          }}
        >
          <Input
            autoFocus={true}
            name="description"
            defaultValue={todo.description}
          />
        </Form>
      ) : (
        <>
          <Form
            method="put"
            action={editAction}
            replace={true}
            style={{ flex: 1 }}
            onChange={(e) => submit(e.currentTarget)}
          >
            <HStack>
              <input type="hidden" name="completed" value="false" />
              <Checkbox
                name="completed"
                value="true"
                defaultChecked={todo.completed}
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
                {optimisticDescription}
              </Text>
            </HStack>
          </Form>
          <Form method="delete" action={deleteAction} replace={true}>
            <Button type="submit">Delete</Button>
          </Form>
        </>
      )}
    </HStack>
  );
};

export default TodoItem;
