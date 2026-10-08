import { supabase } from './supabase';
import { Clip } from './clips';

export async function getUnratedClips(userId: string): Promise<Clip[]> {
  // Get evaluated clip IDs for this user
  const { data: evaluations, error: evalError } = await supabase
    .from('evaluations')
    .select('clip_id')
    .eq('user_id', userId);

  if (evalError) throw evalError;

  const evaluatedClipIds = new Set(evaluations.map((e: any) => e.clip_id));

  // Get all clips
  const { data: allClips, error: clipsError } = await supabase
    .from('clips')
    .select('*')
    .order('created_at', { ascending: false });

  if (clipsError) throw clipsError;

  // Filter out evaluated ones
  return allClips.filter((clip: Clip) => !evaluatedClipIds.has(clip.id));
}

export async function submitEvaluation(
  userId: string,
  clipId: string,
  ratings: { question_id: string; rating: number }[]
) {
  // First insert all ratings
  const ratingsData = ratings.map(r => ({
    user_id: userId,
    clip_id: clipId,
    question_id: r.question_id,
    rating: r.rating,
  }));

  const { error: ratingsError } = await supabase
    .from('ratings')
    .insert(ratingsData);

  if (ratingsError) throw ratingsError;

  // Then insert the evaluation record to mark it completed
  const { error: evaluationError } = await supabase
    .from('evaluations')
    .insert({
      user_id: userId,
      clip_id: clipId,
    });

  if (evaluationError) {
    // If this fails, ideally we rollback ratings, but no easy transaction in supabase-js without RPC
    throw evaluationError;
  }
}
