import { Button, Checkbox, HStack, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useFetcher } from "remix";
import type { TTodo } from "~/db/Todo.server";

const TodoItem = (todo: TTodo) => {
  const editFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const [editMode, setEditMode] = useState(false);

  const editAction = `/todo/${todo.id}/edit`;
  const deleteAction = `/todo/${todo.id}/delete`;

  const optimisticDescription =
    editFetcher.submission?.action === editAction &&
    editFetcher.submission?.formData?.has("description")
      ? String(editFetcher.submission.formData.get("description"))
      : todo.description;

  if (deleteFetcher.submission?.action === deleteAction) {
    return null;
  }

  return (
    <HStack>
      {editMode ? (
        <editFetcher.Form
          style={{ width: "100%" }}
          method="put"
          action={editAction}
          onSubmit={() => {
            setEditMode(false);
          }}
        >
          <Input
            autoFocus={true}
            name="description"
            defaultValue={todo.description}
          />
        </editFetcher.Form>
      ) : (
        <>
          <editFetcher.Form
            method="put"
            action={editAction}
            style={{ flex: 1 }}
            onChange={(e) => editFetcher.submit(e.currentTarget)}
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
          </editFetcher.Form>
          <deleteFetcher.Form method="delete" action={deleteAction}>
            <Button type="submit">Delete</Button>
          </deleteFetcher.Form>
        </>
      )}
    </HStack>
  );
};

export default TodoItem;
