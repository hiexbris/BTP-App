import { supabase } from './supabase';
import { Database } from '../types/database';

export type Question = Database['public']['Tables']['questions']['Row'];

export async function getQuestions(activeOnly = false) {
  let query = supabase
    .from('questions')
    .select('*')
    .order('display_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Question[];
}

export async function addQuestion(questionText: string, displayOrder: number) {
  const { error } = await supabase
    .from('questions')
    .insert({
      question_text: questionText,
      display_order: displayOrder,
      active: true,
    });

  if (error) throw error;
}

export async function toggleQuestionActive(id: string, currentActive: boolean) {
  const { error } = await supabase
    .from('questions')
    .update({ active: !currentActive })
    .eq('id', id);

  if (error) throw error;
}
