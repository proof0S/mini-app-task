'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard, updateScore, LeaderboardEntry } from '../lib/supabase';
import Achievements from './Achievements';
import ShareModal from './ShareModal';

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
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [showShare, setShowShare] = useState(false);
  const [shareData, setShareData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await getLeaderboard(50);
      setEntries(data);
      
      if (currentUser?.fid) {
        const rank = data.findIndex(e => e.fid === currentUser.fid) + 1;
        setUserRank(rank > 0 ? rank : null);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [isOpen, currentUser?.fid]);

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
      
      const data = await getLeaderboard(50);
      setEntries(data);
    };

    syncScore();
  }, [currentUser, userScore, tasksCompleted, streak, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white drop-shadow-lg flex items-center gap-2">
            <span>🏆</span> Leaderboard
          </h1>
          <p className="text-white/80 text-sm font-medium">Compete with others</p>
        </div>
      </div>

      {/* User's rank card */}
      {currentUser?.fid && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl backdrop-blur-xl animate-slideUp">
          <div className="flex items-center gap-4">
            {currentUser.pfpUrl ? (
              <img src={currentUser.pfpUrl} alt="" className="w-14 h-14 rounded-full border-2 border-yellow-400" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-yellow-500/30 flex items-center justify-center border-2 border-yellow-400">
                <span className="text-2xl">👤</span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-white font-bold">{currentUser.displayName || 'You'}</p>
              <p className="text-yellow-200 text-sm">
                Rank #{userRank || '—'} • {userScore.toLocaleString()} points
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-yellow-400">🔥 {streak}</p>
              <p className="text-yellow-200/70 text-xs">day streak</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'week', 'month'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all btn-press ${
              timeFilter === filter
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {filter === 'all' ? 'All Time' : filter === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {/* Leaderboard list */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-white/10 rounded-2xl backdrop-blur-xl">
            <span className="text-5xl mb-4 block">🏆</span>
            <p className="text-white font-semibold mb-1">No entries yet</p>
            <p className="text-white/60 text-sm">Be the first to join!</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.fid}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all animate-slideUp card-hover stagger-${Math.min(index + 1, 5)} ${
                entry.fid === currentUser?.fid 
                  ? 'bg-cyan-500/20 border border-cyan-400/30' 
                  : 'bg-white/10 border border-white/10'
              }`}
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              {/* Rank */}
              <div className="w-10 text-center">
                {index === 0 ? (
                  <span className="text-3xl">🥇</span>
                ) : index === 1 ? (
                  <span className="text-3xl">🥈</span>
                ) : index === 2 ? (
                  <span className="text-3xl">🥉</span>
                ) : (
                  <span className="text-xl font-bold text-white/60">#{index + 1}</span>
                )}
              </div>

              {/* Avatar */}
              {entry.pfp_url ? (
                <img src={entry.pfp_url} alt="" className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">
                  {entry.display_name || entry.username}
                  {entry.fid === currentUser?.fid && (
                    <span className="text-cyan-300 ml-2 text-sm">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <span>✅ {entry.tasks_completed}</span>
                  {entry.streak > 0 && <span>🔥 {entry.streak}</span>}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-white text-xl font-black">{entry.score.toLocaleString()}</p>
                <p className="text-white/50 text-xs">points</p>
              </div>
            </div>
          ))
        )}

      {/* Achievements */}
      <div className="mt-6">
        <Achievements userScore={userScore} tasksCompleted={tasksCompleted} streak={streak} />
      </div>
      </div>
    </div>
  );
}
