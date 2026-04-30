import { TodoNode } from '../types/todo-node';
import { TodoList } from '../types/todo-list';

export const toArray = (list: TodoList): TodoNode[] => {
  const out: TodoNode[] = [];
  let cursor = list.head;
  while (cursor) {
    out.push(cursor);
    cursor = cursor.next;
  }
  return out;
};
