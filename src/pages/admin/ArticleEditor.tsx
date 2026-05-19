import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  createArticle,
  getArticleById,
  updateArticle,
  uploadCoverImage,
} from '@/lib/articles';
import type { Article, ArticleDraft } from '@/types/article';
import RichTextEditor from '@/components/admin/RichTextEditor';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const emptyDraft: ArticleDraft = {
  slug: '',
  title: '',
  excerpt: '',
  cover_image_url: null,
  body: '',
  author: '',
  status: 'draft',
  published_at: null,
};

export default function ArticleEditor() {
  const { id } = useParams<{ id?: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const [draft, setDraft] = useState<ArticleDraft>(emptyDraft);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getArticleById(id!)
      .then((a) => {
        if (!a) {
          setError('Article not found');
          setLoading(false);
          return;
        }
        const { id: _omit, created_at: _c, updated_at: _u, ...rest } = a as Article;
        void _omit;
        void _c;
        void _u;
        setDraft(rest);
        setSlugTouched(true);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message ?? 'Failed to load');
        setLoading(false);
      });
  }, [id, isNew]);

  const update = <K extends keyof ArticleDraft>(key: K, val: ArticleDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: val }));
  };

  const handleTitle = (title: string) => {
    update('title', title);
    if (!slugTouched) update('slug', slugify(title));
  };

  const handleCoverUpload = async (file: File) => {
    try {
      const url = await uploadCoverImage(file);
      update('cover_image_url', url);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const save = async (publish: boolean) => {
    setError(null);
    setSaving(true);
    const next: ArticleDraft = {
      ...draft,
      slug: draft.slug || slugify(draft.title),
      status: publish ? 'published' : draft.status,
      published_at: publish && !draft.published_at ? new Date().toISOString() : draft.published_at,
    };
    try {
      if (isNew) {
        const created = await createArticle(next);
        navigate(`/admin/articles/${created.id}/edit`, { replace: true });
      } else {
        await updateArticle(id!, next);
        setDraft(next);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    save(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="font-mono text-sm text-text-secondary">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 md:px-12">
      <header className="flex items-center justify-between mb-10 max-w-[920px] mx-auto">
        <div>
          <Link
            to="/admin/articles"
            className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary hover:text-foreground"
          >
            ← Articles
          </Link>
          <h1 className="font-display text-3xl uppercase tracking-tight mt-2">
            {isNew ? 'New article' : 'Edit article'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="border border-foreground/15 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded hover:bg-foreground/5 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider px-4 py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            {draft.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-[920px] mx-auto space-y-6">
        {error && <p className="font-mono text-sm text-destructive">{error}</p>}

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
            Title
          </span>
          <input
            type="text"
            required
            value={draft.title}
            onChange={(e) => handleTitle(e.target.value)}
            className="w-full bg-background border border-foreground/15 rounded px-3 py-2 font-display text-2xl uppercase focus:outline-none focus:border-primary"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block md:col-span-2">
            <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
              Slug (URL)
            </span>
            <input
              type="text"
              required
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update('slug', e.target.value);
              }}
              className="w-full bg-background border border-foreground/15 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary"
            />
            <span className="font-mono text-[10px] text-text-secondary block mt-1">
              /newsletter/{draft.slug || '…'}
            </span>
          </label>
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
              Author
            </span>
            <input
              type="text"
              value={draft.author ?? ''}
              onChange={(e) => update('author', e.target.value)}
              className="w-full bg-background border border-foreground/15 rounded px-3 py-2 font-body text-sm focus:outline-none focus:border-primary"
              placeholder="Jamal Reimer"
            />
          </label>
        </div>

        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
            Excerpt
          </span>
          <textarea
            value={draft.excerpt ?? ''}
            onChange={(e) => update('excerpt', e.target.value)}
            rows={3}
            className="w-full bg-background border border-foreground/15 rounded px-3 py-2 font-body text-sm focus:outline-none focus:border-primary resize-y"
            placeholder="One or two sentences. Used in previews and the article header."
          />
        </label>

        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
            Cover image
          </span>
          {draft.cover_image_url ? (
            <div className="relative">
              <img
                src={draft.cover_image_url}
                alt=""
                className="w-full max-h-[280px] object-cover rounded border border-foreground/10"
              />
              <button
                type="button"
                onClick={() => update('cover_image_url', null)}
                className="absolute top-2 right-2 bg-background/90 border border-foreground/15 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="block border border-dashed border-foreground/20 rounded p-8 text-center cursor-pointer hover:border-foreground/40 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleCoverUpload(f);
                }}
              />
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                Click to upload
              </span>
            </label>
          )}
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-text-secondary block mb-2">
            Body
          </span>
          <RichTextEditor value={draft.body} onChange={(html) => update('body', html)} />
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
          <p className="font-mono text-xs text-text-secondary">
            Status: <strong className="text-foreground">{draft.status}</strong>
            {draft.published_at && (
              <>
                {' · '}
                Published {new Date(draft.published_at).toLocaleString()}
              </>
            )}
          </p>
          {draft.status === 'published' && draft.slug && (
            <Link
              to={`/newsletter/${draft.slug}`}
              target="_blank"
              className="font-mono text-xs uppercase tracking-wider text-primary hover:underline"
            >
              View live →
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
