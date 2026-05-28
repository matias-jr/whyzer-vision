import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { listAllArticles, deleteArticle } from '@/lib/articles';
import type { ArticleSummary } from '@/types/article';

type RowWithStatus = ArticleSummary & {
  status?: 'draft' | 'published';
  updated_at?: string;
};

export default function ArticlesList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<RowWithStatus[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    listAllArticles()
      .then((data) => setRows(data as RowWithStatus[]))
      .catch((e) => setError(e.message ?? 'Failed to load'));
  };

  useEffect(refresh, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteArticle(id);
      refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Delete failed';
      alert(msg);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 md:px-12">
      <header className="flex items-center justify-between mb-12 max-w-[1100px] mx-auto">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary mb-1">
            Admin
          </p>
          <h1 className="font-display text-3xl uppercase tracking-tight">Articles</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/live-session"
            className="border border-foreground/15 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded hover:bg-foreground/5 transition-colors"
          >
            Live Session
          </Link>
          <Link
            to="/admin/articles/new"
            className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider px-4 py-2 rounded hover:brightness-110 transition-all"
          >
            + New article
          </Link>
          <button
            onClick={handleSignOut}
            className="border border-foreground/15 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded hover:bg-foreground/5 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto">
        {error && <p className="font-mono text-sm text-destructive mb-4">{error}</p>}
        {rows === null && (
          <p className="font-mono text-sm text-text-secondary">Loading…</p>
        )}
        {rows && rows.length === 0 && (
          <div className="border border-dashed border-foreground/15 rounded-lg p-12 text-center">
            <p className="font-body text-text-secondary mb-4">No articles yet.</p>
            <Link
              to="/admin/articles/new"
              className="font-mono text-sm uppercase tracking-wider text-primary hover:underline"
            >
              Create the first one →
            </Link>
          </div>
        )}
        {rows && rows.length > 0 && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="font-mono text-xs uppercase tracking-wider text-text-secondary pb-3 pr-4">
                  Title
                </th>
                <th className="font-mono text-xs uppercase tracking-wider text-text-secondary pb-3 pr-4">
                  Status
                </th>
                <th className="font-mono text-xs uppercase tracking-wider text-text-secondary pb-3 pr-4 hidden md:table-cell">
                  Slug
                </th>
                <th className="font-mono text-xs uppercase tracking-wider text-text-secondary pb-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-foreground/5">
                  <td className="py-4 pr-4">
                    <Link
                      to={`/admin/articles/${r.id}/edit`}
                      className="font-body text-foreground hover:text-primary"
                    >
                      {r.title}
                    </Link>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded ${
                        r.status === 'published'
                          ? 'bg-primary/15 text-primary'
                          : 'bg-foreground/10 text-text-secondary'
                      }`}
                    >
                      {r.status ?? 'draft'}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <code className="font-mono text-xs text-text-secondary">{r.slug}</code>
                  </td>
                  <td className="py-4 text-right">
                    {r.status === 'published' && (
                      <Link
                        to={`/newsletter/${r.slug}`}
                        target="_blank"
                        className="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-foreground mr-4"
                      >
                        View
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(r.id, r.title)}
                      className="font-mono text-xs uppercase tracking-wider text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
