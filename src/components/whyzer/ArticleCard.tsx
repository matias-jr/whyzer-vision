import { Link } from 'react-router-dom';
import type { ArticleSummary } from '@/types/article';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      to={`/newsletter/${article.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.08)',
        textDecoration: 'none',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.2s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 4px 20px rgba(99,102,241,0.10)';
        el.style.borderColor = 'rgba(255,255,255,0.16)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
        el.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      {article.cover_image_url && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.cover_image_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <p
          className="font-mono-brand text-[11px] uppercase tracking-[0.15em] mb-3"
          style={{ color: '#555E75' }}
        >
          {formatDate(article.published_at)}
          {article.author ? ` · ${article.author}` : ''}
        </p>
        <h3
          className="text-xl leading-tight mb-2"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#F9FAFB', letterSpacing: '-0.015em' }}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="font-body text-sm leading-[1.7] line-clamp-3" style={{ color: '#9CA3AF' }}>
            {article.excerpt}
          </p>
        )}
        <span
          className="font-mono-brand text-xs uppercase tracking-wider mt-4"
          style={{ color: '#818CF8' }}
        >
          Read →
        </span>
      </div>
    </Link>
  );
}
