import { useEffect, useState, type SyntheticEvent } from 'react';
import { append } from '../utils/append';
import { toggle } from '../utils/toggle';
import { remove } from '../utils/remove';
import { toArray } from '../utils/to-array';
import { createList } from '../utils/create-list';
import { TodoNode } from '../types/todo-node';
import { TodoList } from '../types/todo-list';
import { deleteTodo, fetchTodos, insertTodo, updateDone } from './todos-repo';

type Status = 'loading' | 'ready' | 'error';

export default function TodoListView() {
  const [list, setList] = useState<TodoList>(createList);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<Status>('loading');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exiting, setExiting] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTodos()
      .then((l) => {
        setList(l);
        setStatus('ready');
      })
      .catch((e) => {
        setError(e.message ?? 'Failed to load todos');
        setStatus('error');
      });
  }, []);

  const items = toArray(list);
  const remaining = items.filter((i: TodoNode) => !i.done).length;

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    try {
      await insertTodo(text);
      const fresh = await fetchTodos();
      setList(fresh);
      setDraft('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setBusy(false);
    }
  };

  const onToggle = async (item: TodoNode) => {
    const nextDone = !item.done;
    setList((l) => toggle(l, item.id));
    try {
      await updateDone(item.id, nextDone);
    } catch (err) {
      setList((l) => toggle(l, item.id));
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const onRemove = async (item: TodoNode) => {
    setExiting((s) => new Set(s).add(item.id));
    try {
      await deleteTodo(item.id);
      setTimeout(() => {
        setList((l) => remove(l, item.id));
        setExiting((s) => {
          const next = new Set(s);
          next.delete(item.id);
          return next;
        });
      }, 180);
    } catch (err) {
      setExiting((s) => {
        const next = new Set(s);
        next.delete(item.id);
        return next;
      });
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <section className="todo">
      <header className="todo__header">
        <div>
          <h1>Today</h1>
          <p className="todo__subtitle">
            {remaining === 0
              ? 'You are all caught up.'
              : `${remaining} task${remaining === 1 ? '' : 's'} remaining`}
          </p>
        </div>
        <span className="todo__count" data-empty={remaining === 0}>
          {remaining}
        </span>
      </header>

      <form className="todo__form" onSubmit={onSubmit}>
        <input
          className="todo__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task…"
          aria-label="New todo"
          disabled={status !== 'ready' || busy}
        />
        <button
          type="submit"
          className="todo__add"
          disabled={!draft.trim() || busy || status !== 'ready'}
          aria-label="Add task"
        >
          {busy ? '…' : 'Add'}
        </button>
      </form>

      {error && <p className="todo__error" role="alert">{error}</p>}

      {status === 'loading' && <p className="todo__hint">Loading…</p>}

      {status === 'ready' && items.length === 0 && (
        <p className="todo__hint">All clear.</p>
      )}

      {status === 'ready' && items.length > 0 && (
        <ul className="todo__list">
          {items.map((item: TodoNode) => {
            const isExiting = exiting.has(item.id);
            return (
              <li
                key={item.id}
                className={`todo__item${item.done ? ' is-done' : ''}${isExiting ? ' is-exiting' : ''}`}
              >
                <label className="todo__label">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => onToggle(item)}
                  />
                  <span className="todo__check" aria-hidden />
                  <span className="todo__text">{item.text}</span>
                </label>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onRemove(item)}
                  aria-label={`Remove ${item.text}`}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
