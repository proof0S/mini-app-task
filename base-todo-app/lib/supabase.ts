import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mwuxqocsvvkdtiuzdgqg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXhxb2NzdnZrZHRpdXpkZ3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDM1MDksImV4cCI6MjA4MzM3OTUwOX0.JkAhbLhDwaz7n1R2JoTgRTpupVwT1SlHfks5aQDkMj4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeaderboardEntry {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string | null;
  score: number;
  tasks_completed: number;
  streak: number;
}

// Skor güncelle veya ekle
export async function updateScore(
  fid: number,
  username: string,
  displayName: string,
  pfpUrl: string | null,
  score: number,
  tasksCompleted: number,
  streak: number
) {
  const { data, error } = await supabase
    .from('leaderboard')
    .upsert({
      fid,
      username,
      display_name: displayName,
      pfp_url: pfpUrl,
      score,
      tasks_completed: tasksCompleted,
      streak,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'fid'
    });

  if (error) {
    console.error('Error updating score:', error);
    return null;
  }
  return data;
}

// Top 50 leaderboard çek
export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data || [];
}

// Kullanıcının sırasını bul
export async function getUserRank(fid: number): Promise<number | null> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('fid, score')
    .order('score', { ascending: false });

  if (error || !data) return null;
  
  const index = data.findIndex(entry => entry.fid === fid);
  return index === -1 ? null : index + 1;
}
