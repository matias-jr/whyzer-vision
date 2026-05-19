import { supabase } from './supabase';
import type { Article, ArticleDraft, ArticleSummary } from '@/types/article';

const SUMMARY_COLS =
  'id, slug, title, excerpt, cover_image_url, author, published_at';

export async function listPublishedArticles(): Promise<ArticleSummary[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(SUMMARY_COLS)
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return (data as Article) ?? null;
}

// ---- admin (authenticated) ----

export async function listAllArticles(): Promise<ArticleSummary[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`${SUMMARY_COLS}, status, updated_at`)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data as ArticleSummary[]) ?? [];
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as Article) ?? null;
}

export async function createArticle(draft: ArticleDraft): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .insert(draft)
    .select('*')
    .single();
  if (error) throw error;
  return data as Article;
}

export async function updateArticle(
  id: string,
  patch: Partial<ArticleDraft>,
): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Article;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadCoverImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin';
  const path = `covers/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('article-images')
    .upload(path, file, { cacheControl: '31536000', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('article-images').getPublicUrl(path);
  return data.publicUrl;
}
