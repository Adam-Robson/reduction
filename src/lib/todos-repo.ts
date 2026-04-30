import { supabase } from './supabase';
import type { TodoList } from '../types/todo-list';
import type { TodoNode } from '../types/todo-node';

type Row = { id: string; text: string; done: boolean; created_at: string };

const rowsToList = (rows: Row[]): TodoList => {
  if (rows.length === 0) return { head: null, size: 0 };
  const nodes: TodoNode[] = rows.map((r) => ({
    id: r.id,
    text: r.text,
    done: r.done,
    next: null,
  }));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  return { head: nodes[0], size: nodes.length };
};

export const fetchTodos = async (): Promise<TodoList> => {
  const { data, error } = await supabase
    .from('todos')
    .select('id, text, done, created_at')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return rowsToList((data ?? []) as Row[]);
};

export const insertTodo = async (text: string): Promise<TodoNode> => {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('todos')
    .insert({ text, done: false, user_id: userId })
    .select('id, text, done')
    .single();
  if (error) throw error;
  return { id: data.id, text: data.text, done: data.done, next: null };
};

export const updateDone = async (id: string, done: boolean): Promise<void> => {
  const { error } = await supabase.from('todos').update({ done }).eq('id', id);
  if (error) throw error;
};

export const deleteTodo = async (id: string): Promise<void> => {
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) throw error;
};
