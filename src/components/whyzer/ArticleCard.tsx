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

// Newsletter issue card in the v8 design (rendered inside a .wzsite page).
export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link to={`/newsletter/${article.slug}`} className="wzsite-articlecard" style={{ textDecoration: 'none' }}>
      {article.cover_image_url && (
        <div style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
          <img src={article.cover_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8A8AA0', marginBottom: 10 }}>
          {formatDate(article.published_at)}
          {article.author ? ` · ${article.author}` : ''}
        </p>
        <h3 style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 8 }}>{article.title}</h3>
        {article.excerpt && (
          <p className="line-clamp-3" style={{ fontSize: 14, lineHeight: 1.7, color: '#55556B' }}>
            {article.excerpt}
          </p>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#4a4ad1', marginTop: 16 }}>Read →</span>
      </div>
    </Link>
  );
}
