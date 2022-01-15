function delay<T extends (...args: any[]) => any>(fn: T, delay = 1000) {
  return (...args: Parameters<T>) => {
    return new Promise<ReturnType<T>>((res) => {
      setTimeout(() => {
        res(fn(...args));
      }, delay);
    });
  };
}

export type TTodo = {
  id: number;
  description: string;
  completed: boolean;
};

let id = 0;

class Todo {
  todos: TTodo[] = [];
  constructor() {
    console.log("aa");
  }

  getTodos = delay(() => {
    return this.todos;
  });

  addTodo = delay((description: string) => {
    this.todos.push({ id: id++, description, completed: false });
    console.log(this.todos);
  });

  deleteTodo = delay((id: number) => {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  });

  updateTodo = delay((id: number, newTodo: Partial<Omit<TTodo, "id">>) => {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, ...newTodo };
      }
      return todo;
    });
  });
}

declare global {
  var todo: Todo | undefined;
}

let todo: Todo;

if (process.env.NODE_ENV === "production") {
  todo = new Todo();
} else {
  if (!global.todo) {
    global.todo = new Todo();
  }
  todo = global.todo;
}

export default todo;
