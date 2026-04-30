import { TodoList } from '../types/todo-list';
import { TodoNode } from '../types/todo-node';
import { makeId } from './make-id';

export const append = (list: TodoList, text: string): TodoList => {
  const node: TodoNode = { id: makeId(), text, done: false, next: null };
  if (!list.head) return { head: node, size: 1 };
  let cursor = list.head;
  while (cursor.next) cursor = cursor.next;
  cursor.next = node;
  return { head: list.head, size: list.size + 1 };
};
