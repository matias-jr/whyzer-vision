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
      className="group flex flex-col rounded-xl border border-foreground/[0.06] bg-background-secondary overflow-hidden hover:border-foreground/[0.14] transition-all duration-300"
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
        <p className="font-mono-brand text-[11px] uppercase tracking-[0.15em] text-text-tertiary mb-3">
          {formatDate(article.published_at)}
          {article.author ? ` · ${article.author}` : ''}
        </p>
        <h3 className="font-display text-xl leading-tight text-foreground mb-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="font-body text-sm text-text-secondary leading-[1.7] line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <span className="font-mono-brand text-xs uppercase tracking-wider text-primary mt-4">
          Read →
        </span>
      </div>
    </Link>
  );
}
