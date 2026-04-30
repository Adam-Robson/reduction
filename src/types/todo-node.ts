export type TodoNode = {
  id: string;
  text: string;
  done: boolean;
  next: TodoNode | null;
};
