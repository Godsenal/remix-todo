import { Button, Checkbox, HStack, Input, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Form, useSubmit } from "remix";
import type { TTodo } from "~/db/Todo.server";

const TodoItem = ({ id, description, completed }: TTodo) => {
  const $form = useRef<HTMLFormElement>(null);
  const [editMode, setEditMode] = useState(false);
  const submit = useSubmit();

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
      <Form method="delete" replace={true}>
        <input type="hidden" name="id" defaultValue={id} />
        <Button type="submit">Delete</Button>
      </Form>
    </HStack>
  );
};

export default TodoItem;
