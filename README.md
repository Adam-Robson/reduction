# reduction

A small todo app built on a singly-linked list. React 19 + TypeScript on the front end, Supabase (Postgres + Auth) on the back end, bundled with Webpack 5.

The "reduction" name comes from how the UI talks to state: a list is a `head` node plus pointers, and every change runs through a pure reducer-style util (`append`, `toggle`, `remove`) that returns a new list.

## Stack

- React 19, TypeScript
- Webpack 5 + webpack-dev-server (port 3210), Workbox service worker in production
- Supabase JS client for email/password auth and a `todos` table
- Biome for lint + format, Prettier for fallback formatting
- Jest + Testing Library + jsdom

## Getting started

```bash
npm install
```

Create a `.env` file at the project root with your Supabase project credentials:

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
```

These are read by [webpack.config.ts](webpack.config.ts) via `dotenv` and inlined through `DefinePlugin` so they're available as `process.env.SUPABASE_URL` / `process.env.SUPABASE_ANON_KEY` in the browser bundle.

### Supabase schema

The app expects a `todos` table with row-level security keyed to `auth.uid()`:

```sql
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

create policy "todos are private" on public.todos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Webpack dev server with HMR on http://localhost:3210 |
| `npm run build` | Production build to `dist/` (includes Workbox SW) |
| `npm run build:dev` | Development build to `dist/` |
| `npm run watch` | Webpack watch mode |
| `npm test` | Jest |
| `npm run fix` | `biome check --write` (lint + format + organize imports) |

## Project layout

```
src/
  app.tsx              Auth gate → AuthForm or TodoListView
  index.tsx            React root + global CSS
  lib/
    auth.tsx           AuthProvider / useAuth context
    auth-form.tsx      Sign in / sign up form
    supabase.ts        Supabase client (reads env)
    todos-repo.ts      fetch / insert / update / delete against `todos`
    todo-list-view.tsx Main UI, optimistic toggle/remove
  types/
    todo-list.ts       { head, size }
    todo-node.ts       { id, text, done, next }
  utils/
    append, toggle, remove, to-array, create-list, make-id
  styles/              index.css, reset.css
```

## Notes

- The list is a real linked list end-to-end — `todos-repo.rowsToList` rebuilds `next` pointers from a Supabase query ordered by `created_at`, and the view uses `toArray` only to render.
- Mutations are optimistic: `onToggle` flips state locally, calls `updateDone`, and re-toggles on failure. `onRemove` runs a 180ms exit animation before pruning the node.
- The service worker registration in [index.html](index.html) only resolves in production, since `workbox-webpack-plugin` runs in the production branch of the Webpack config.
