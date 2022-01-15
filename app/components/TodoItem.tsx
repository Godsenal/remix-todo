import {
  Box,
  Button,
  Checkbox,
  HStack,
  Text,
  VisuallyHiddenInput,
} from "@chakra-ui/react";
import type { TTodo } from "~/db/Todo.server";

const TodoItem = ({ id, description, completed }: TTodo) => {
  return (
    <HStack>
      <VisuallyHiddenInput name="id" defaultValue={id} />
      <Checkbox name="completed" defaultChecked={completed} />
      <Text
        flex={1}
        {...(completed && {
          textDecoration: "line-through",
          color: "gray",
        })}
      >
        {description}
      </Text>
      <Button>Delete</Button>
    </HStack>
  );
};

export default TodoItem;
