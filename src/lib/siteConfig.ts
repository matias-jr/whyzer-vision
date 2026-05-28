import { supabase } from './supabase';

export async function getNextSessionAt(): Promise<string | null> {
  const { data, error } = await supabase
    .from('site_config')
    .select('next_session_at')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return (data?.next_session_at as string | null) ?? null;
}

export async function updateNextSessionAt(iso: string | null): Promise<void> {
  const { error } = await supabase
    .from('site_config')
    .update({ next_session_at: iso })
    .eq('id', 1);
  if (error) throw error;
}
