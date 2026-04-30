import { TodoList} from '../types/todo-list';

export const toggle = (list: TodoList, id: string): TodoList => {
  let cursor = list.head;
  while (cursor) {
    if (cursor.id === id) {
      cursor.done = !cursor.done;
      break;
    }
    cursor = cursor.next;
  }
  return { head: list.head, size: list.size };
};
