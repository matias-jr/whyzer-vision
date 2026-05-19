export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  body: string;
  author: string | null;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ArticleSummary = Pick<
  Article,
  'id' | 'slug' | 'title' | 'excerpt' | 'cover_image_url' | 'author' | 'published_at'
>;

export type ArticleDraft = Omit<
  Article,
  'id' | 'created_at' | 'updated_at'
>;
