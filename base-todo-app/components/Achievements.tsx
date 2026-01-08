'use client';

import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  condition: (stats: UserStats) => boolean;
  unlocked: boolean;
}

interface UserStats {
  totalTasks: number;
  totalScore: number;
  streak: number;
  daysActive: number;
}

interface AchievementsProps {
  userScore: number;
  tasksCompleted: number;
  streak: number;
}

const achievementsList: Omit<Achievement, 'unlocked'>[] = [
  {
    id: 'first_task',
    icon: '🎯',
    title: 'First Step',
    description: 'Complete your first task',
    condition: (stats) => stats.totalTasks >= 1,
  },
  {
    id: 'ten_tasks',
    icon: '⭐',
    title: 'Getting Started',
    description: 'Complete 10 tasks',
    condition: (stats) => stats.totalTasks >= 10,
  },
  {
    id: 'fifty_tasks',
    icon: '💪',
    title: 'Habit Builder',
    description: 'Complete 50 tasks',
    condition: (stats) => stats.totalTasks >= 50,
  },
  {
    id: 'hundred_tasks',
    icon: '🏆',
    title: 'Centurion',
    description: 'Complete 100 tasks',
    condition: (stats) => stats.totalTasks >= 100,
  },
  {
    id: 'streak_3',
    icon: '🔥',
    title: 'On Fire',
    description: '3 day streak',
    condition: (stats) => stats.streak >= 3,
  },
  {
    id: 'streak_7',
    icon: '🌟',
    title: 'Week Warrior',
    description: '7 day streak',
    condition: (stats) => stats.streak >= 7,
  },
  {
    id: 'streak_14',
    icon: '💎',
    title: 'Unstoppable',
    description: '14 day streak',
    condition: (stats) => stats.streak >= 14,
  },
  {
    id: 'streak_30',
    icon: '👑',
    title: 'Legend',
    description: '30 day streak',
    condition: (stats) => stats.streak >= 30,
  },
  {
    id: 'score_100',
    icon: '💯',
    title: 'Point Collector',
    description: 'Earn 100 points',
    condition: (stats) => stats.totalScore >= 100,
  },
  {
    id: 'score_500',
    icon: '🚀',
    title: 'Rising Star',
    description: 'Earn 500 points',
    condition: (stats) => stats.totalScore >= 500,
  },
  {
    id: 'score_1000',
    icon: '🌙',
    title: 'Moon Walker',
    description: 'Earn 1,000 points',
    condition: (stats) => stats.totalScore >= 1000,
  },
  {
    id: 'score_5000',
    icon: '🌟',
    title: 'Superstar',
    description: 'Earn 5,000 points',
    condition: (stats) => stats.totalScore >= 5000,
  },
];

export default function Achievements({ userScore, tasksCompleted, streak }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const stats: UserStats = {
      totalTasks: tasksCompleted,
      totalScore: userScore,
      streak: streak,
      daysActive: parseInt(localStorage.getItem('dailyTasks_daysActive') || '1'),
    };

    const evaluated = achievementsList.map(a => ({
      ...a,
      unlocked: a.condition(stats),
    }));

    setAchievements(evaluated);
  }, [userScore, tasksCompleted, streak]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const displayAchievements = showAll ? achievements : achievements.slice(0, 6);

  return (
    <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 animate-slideUp">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span>🏅</span> Achievements
        </h3>
        <span className="text-white/60 text-sm">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {displayAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-xl text-center transition-all ${
              achievement.unlocked
                ? 'bg-white/20 border border-white/30'
                : 'bg-white/5 border border-white/10 opacity-50'
            }`}
          >
            <span className={`text-2xl block mb-1 ${achievement.unlocked ? '' : 'grayscale'}`}>
              {achievement.icon}
            </span>
            <p className="text-white text-xs font-medium truncate">{achievement.title}</p>
            {achievement.unlocked && (
              <span className="text-green-400 text-[10px]">✓ Unlocked</span>
            )}
          </div>
        ))}
      </div>

      {/* Show more/less */}
      {achievements.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-white/60 hover:text-white text-sm transition-all"
        >
          {showAll ? 'Show Less ↑' : `Show All (${achievements.length - 6} more) ↓`}
        </button>
      )}

      {/* Progress bar */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/60 text-xs">Progress</span>
          <span className="text-white/60 text-xs">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
