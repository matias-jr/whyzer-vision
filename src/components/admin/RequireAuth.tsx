import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type State =
  | { kind: 'loading' }
  | { kind: 'signed-in'; session: Session }
  | { kind: 'signed-out' };

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState(
        data.session ? { kind: 'signed-in', session: data.session } : { kind: 'signed-out' },
      );
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session ? { kind: 'signed-in', session } : { kind: 'signed-out' });
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (state.kind === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="font-mono text-sm text-text-secondary">Checking session…</p>
      </div>
    );
  }

  if (state.kind === 'signed-out') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
