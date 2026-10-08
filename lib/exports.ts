import { supabase } from './supabase';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportRatingsToCSV() {
  // We need to fetch ratings joined with users, clips, and questions
  // Since we don't have a view, we fetch them individually and join in JS
  // For a small college project, this is acceptable.

  const [
    { data: ratings },
    { data: users },
    { data: clips },
    { data: questions },
  ] = await Promise.all([
    supabase.from('ratings').select('*'),
    supabase.from('users').select('*'),
    supabase.from('clips').select('*'),
    supabase.from('questions').select('*'),
  ]);

  if (!ratings || !users || !clips || !questions) {
    throw new Error('Failed to fetch data for export');
  }

  // Create lookup maps
  const userMap = new Map(users.map(u => [u.id, u.email]));
  const clipMap = new Map(clips.map(c => [c.id, c.title]));
  const questionMap = new Map(questions.map(q => [q.id, q.question_text]));

  // CSV Header: User ID,User Email,Clip ID,Clip Title,Question ID,Question,Rating,Submitted At
  let csvContent = 'User ID,User Email,Clip ID,Clip Title,Question ID,Question,Rating,Submitted At\n';

  for (const r of ratings) {
    const email = userMap.get(r.user_id) || 'Unknown';
    const title = clipMap.get(r.clip_id) || 'Unknown';
    const qText = questionMap.get(r.question_id) || 'Unknown';
    
    // Escape quotes in text
    const safeEmail = `"${email.replace(/"/g, '""')}"`;
    const safeTitle = `"${title.replace(/"/g, '""')}"`;
    const safeQText = `"${qText.replace(/"/g, '""')}"`;
    
    csvContent += `${r.user_id},${safeEmail},${r.clip_id},${safeTitle},${r.question_id},${safeQText},${r.rating},${r.created_at}\n`;
  }

  // Save to file system using the new API
  const file = new File(Paths.document, 'results.csv');
  if (!file.exists) {
    file.create();
  }
  file.write(csvContent);
  const fileUri = file.uri;

  // Share file
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Results CSV'
    });
  } else {
    throw new Error('Sharing is not available on this device');
  }
}
