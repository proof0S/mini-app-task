'use client';

import { useState, useEffect } from 'react';

interface DailyRewardProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (points: number) => void;
  streak: number;
}

const rewards = [
  { day: 1, points: 10, emoji: '🎁' },
  { day: 2, points: 15, emoji: '🎀' },
  { day: 3, points: 25, emoji: '🎊' },
  { day: 4, points: 35, emoji: '🎉' },
  { day: 5, points: 50, emoji: '💎' },
  { day: 6, points: 75, emoji: '👑' },
  { day: 7, points: 100, emoji: '🏆' },
];

export default function DailyReward({ isOpen, onClose, onClaim, streak }: DailyRewardProps) {
  const [claimed, setClaimed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [todaysClaimed, setTodaysClaimed] = useState(false);

  useEffect(() => {
    const lastClaim = localStorage.getItem('dailyTasks_lastRewardClaim');
    const today = new Date().toDateString();
    setTodaysClaimed(lastClaim === today);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDay = ((streak - 1) % 7) + 1;
  const todaysReward = rewards[currentDay - 1];

  const handleClaim = () => {
    if (todaysClaimed) return;
    
    setShowAnimation(true);
    setClaimed(true);
    localStorage.setItem('dailyTasks_lastRewardClaim', new Date().toDateString());
    
    setTimeout(() => {
      onClaim(todaysReward.points);
      setTimeout(() => {
        setShowAnimation(false);
        onClose();
      }, 1500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-yellow-900/90 to-orange-900/90 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-yellow-500/30 animate-scaleIn overflow-hidden relative">
        
        {/* Sparkles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative text-center mb-6">
          <h2 className="text-2xl font-black text-white drop-shadow-lg">🎁 Daily Reward</h2>
          <p className="text-yellow-200/80 text-sm mt-1">Day {currentDay} of 7</p>
        </div>

        {/* Reward Display */}
        <div className="relative mb-6">
          <div className={`text-center p-6 bg-white/10 rounded-2xl border border-white/20 ${showAnimation ? 'animate-bounce' : ''}`}>
            <span className={`text-7xl block mb-3 ${showAnimation ? 'animate-spin' : ''}`}>
              {todaysReward.emoji}
            </span>
            <p className="text-yellow-200 text-lg font-bold">
              +{todaysReward.points} Points
            </p>
          </div>
        </div>

        {/* Week Progress */}
        <div className="flex justify-between gap-1 mb-6">
          {rewards.map((reward, index) => (
            <div
              key={reward.day}
              className={`flex-1 p-2 rounded-xl text-center transition-all ${
                index < currentDay
                  ? 'bg-green-500/30 border border-green-500/50'
                  : index === currentDay - 1
                  ? 'bg-yellow-500/30 border-2 border-yellow-400 scale-110'
                  : 'bg-white/10 border border-white/10'
              }`}
            >
              <span className="text-lg block">{reward.emoji}</span>
              <span className="text-[10px] text-white/60">D{reward.day}</span>
            </div>
          ))}
        </div>

        {/* Claim Button */}
        {todaysClaimed || claimed ? (
          <div className="text-center py-4">
            <span className="text-green-400 font-bold flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {claimed ? 'Claimed!' : 'Already claimed today'}
            </span>
            {!claimed && (
              <button
                onClick={onClose}
                className="mt-3 text-white/60 hover:text-white text-sm"
              >
                Come back tomorrow!
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleClaim}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-2xl text-white font-black text-lg shadow-lg transition-all btn-press"
          >
            Claim Reward! ✨
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-all"
        >
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
