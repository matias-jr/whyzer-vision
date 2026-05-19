import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseConfigured } from '@/lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/articles', { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) {
      setError('Supabase env vars missing. See .env.example.');
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate('/admin/articles', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-foreground/10 rounded-lg p-8 bg-card"
      >
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-2">
          Admin
        </p>
        <h1 className="font-display text-3xl uppercase tracking-tight mb-8">Sign in</h1>

        <label className="block mb-4">
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-foreground/15 rounded px-3 py-2 font-body text-sm focus:outline-none focus:border-primary"
            autoComplete="email"
          />
        </label>

        <label className="block mb-6">
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-foreground/15 rounded px-3 py-2 font-body text-sm focus:outline-none focus:border-primary"
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="font-mono text-xs text-destructive mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider py-3 rounded hover:brightness-110 transition-all disabled:opacity-50"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
