import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getNextSessionAt, updateNextSessionAt } from '@/lib/siteConfig';

function isoToLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToIso(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export default function LiveSessionConfig() {
  const [iso, setIso] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNextSessionAt()
      .then((value) => {
        setIso(value);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message ?? 'Failed to load');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      await updateNextSessionAt(iso);
      setSaved(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 md:px-12">
      <header className="max-w-[640px] mx-auto mb-10">
        <Link
          to="/admin/articles"
          className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-foreground"
        >
          ← Articles
        </Link>
        <h1 className="font-display text-3xl uppercase tracking-tight mt-2">
          Live Session
        </h1>
        <p className="font-body text-sm text-text-secondary mt-2">
          Controls the countdown timer on the /live-session page.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-[640px] mx-auto border border-foreground/10 rounded-lg p-6 bg-card"
      >
        {loading ? (
          <p className="font-mono text-sm text-text-secondary">Loading…</p>
        ) : (
          <>
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
                Next session start
              </span>
              <input
                type="datetime-local"
                value={isoToLocalInput(iso)}
                onChange={(e) => {
                  setIso(localInputToIso(e.target.value));
                  setSaved(false);
                }}
                className="w-full bg-background border border-foreground/15 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary"
              />
              <span className="font-mono text-[10px] text-text-secondary block mt-2">
                Local time in your timezone. The countdown converts to UTC automatically.
              </span>
            </label>

            <p className="font-mono text-[11px] text-text-tertiary mt-4">
              ⚠ This only changes the countdown timer. Dated copy on the page
              (e.g. "June 9 · 12PM ET", "Tuesday, June 9, 2026") is hardcoded
              and still requires a code edit.
            </p>

            {error && (
              <p className="font-mono text-xs text-destructive mt-4">{error}</p>
            )}
            {saved && (
              <p className="font-mono text-xs text-primary mt-4">Saved.</p>
            )}

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider px-5 py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
