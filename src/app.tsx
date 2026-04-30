import TodoListView from './lib/todo-list-view';
import AuthForm from './lib/auth-form';
import { AuthProvider, useAuth } from './lib/auth';

function Gate() {
  const { user, loading, signOut } = useAuth();
  if (loading) {
    return <p className="todo__hint">Loading…</p>;
  }
  if (!user) return <AuthForm />;
  return (
    <>
      <button type="button" className="signout" onClick={() => signOut()}>
        Sign out
      </button>
      <TodoListView />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <main className="app">
        <Gate />
      </main>
    </AuthProvider>
  );
}
