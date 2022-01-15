import {
  Box,
  Button,
  Checkbox,
  HStack,
  Input,
  Text,
  VisuallyHiddenInput,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Form, useSubmit, useTransition } from "remix";
import type { TTodo } from "~/db/Todo.server";

const TodoItem = ({ id, description, completed }: TTodo) => {
  const $form = useRef<HTMLFormElement>(null);
  const [editMode, setEditMode] = useState(false);
  const submit = useSubmit();

  return (
    <Form
      ref={$form}
      method="put"
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
              defaultChecked={completed}
              onChange={() => {
                submit($form.current, { method: "put" });
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
            <Button>Delete</Button>
          </>
        )}
      </HStack>
    </Form>
  );
};

export default TodoItem;
