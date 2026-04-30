import { TodoList } from '../types/todo-list';

export const remove = (list: TodoList, id: string): TodoList => {
  if (!list.head) return list;
  if (list.head.id === id) return { head: list.head.next, size: list.size - 1 };
  let cursor = list.head;
  while (cursor.next && cursor.next.id !== id) cursor = cursor.next;
  if (cursor.next) cursor.next = cursor.next.next;
  return { head: list.head, size: list.size - 1 };
};
