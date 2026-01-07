'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard, updateScore, LeaderboardEntry } from '../lib/supabase';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null;
  userScore: number;
  tasksCompleted: number;
  streak: number;
}

export default function Leaderboard({ 
  isOpen, 
  onClose, 
  currentUser,
  userScore,
  tasksCompleted,
  streak
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Leaderboard verilerini çek
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await getLeaderboard(50);
      setEntries(data);
      
      // Kullanıcının sırasını bul
      if (currentUser?.fid) {
        const rank = data.findIndex(e => e.fid === currentUser.fid) + 1;
        setUserRank(rank > 0 ? rank : null);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [isOpen, currentUser?.fid]);

  // Kullanıcı skorunu güncelle
  useEffect(() => {
    if (!currentUser?.fid || !isOpen) return;

    const syncScore = async () => {
      await updateScore(
        currentUser.fid!,
        currentUser.username || 'anonymous',
        currentUser.displayName || 'Anonymous',
        currentUser.pfpUrl || null,
        userScore,
        tasksCompleted,
        streak
      );
      
      // Güncel leaderboard'u çek
      const data = await getLeaderboard(50);
      setEntries(data);
    };

    syncScore();
  }, [currentUser, userScore, tasksCompleted, streak, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-3xl p-5 w-full max-w-[380px] max-h-[80vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-xl font-bold text-white">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User's rank */}
        {currentUser?.fid && userRank && (
          <div className="mb-4 p-3 bg-cyan-500/20 border border-cyan-400/30 rounded-xl">
            <p className="text-cyan-200 text-sm text-center">
              Your rank: <span className="font-bold text-white">#{userRank}</span> with <span className="font-bold text-white">{userScore}</span> points
            </p>
          </div>
        )}

        {/* Leaderboard list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/60">No entries yet. Be the first!</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={entry.fid}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  entry.fid === currentUser?.fid 
                    ? 'bg-cyan-500/30 border border-cyan-400/50' 
                    : 'bg-white/10'
                }`}
              >
                {/* Rank */}
                <span className="text-xl font-bold text-white/80 w-8 text-center">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>

                {/* Avatar */}
                {entry.pfp_url ? (
                  <img 
                    src={entry.pfp_url} 
                    alt="" 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {entry.display_name || entry.username}
                    {entry.fid === currentUser?.fid && (
                      <span className="text-cyan-300 ml-1">(You)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <span>{entry.tasks_completed} tasks</span>
                    {entry.streak > 0 && (
                      <span className="flex items-center gap-0.5">
                        🔥 {entry.streak}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-white font-bold">{entry.score.toLocaleString()}</p>
                  <p className="text-white/60 text-xs">points</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Complete tasks to climb the leaderboard! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
