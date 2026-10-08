import { supabase } from './supabase';
import { Database } from '../types/database';

export type Clip = Database['public']['Tables']['clips']['Row'];

export async function getClips() {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Clip[];
}

export async function deleteClip(id: string, filePath: string) {
  // First delete from storage
  const { error: storageError } = await supabase.storage
    .from('audio-clips')
    .remove([filePath]);

  if (storageError) {
    console.error('Failed to delete file from storage:', storageError);
    // Continue anyway to delete the database row
  }

  // Then delete from database
  const { error: dbError } = await supabase
    .from('clips')
    .delete()
    .eq('id', id);

  if (dbError) throw dbError;
}

export function getPublicUrl(filePath: string) {
  const { data } = supabase.storage
    .from('audio-clips')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}
