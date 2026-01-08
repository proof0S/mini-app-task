'use client';

import { useState, useEffect } from 'react';

interface DayStats {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}

interface WeeklyStatsProps {
  todos: { id: number; completed: boolean }[];
}

export default function WeeklyStats({ todos }: WeeklyStatsProps) {
  const [weekData, setWeekData] = useState<DayStats[]>([]);

  useEffect(() => {
    // Son 7 günün verilerini localStorage'dan al
    const days: DayStats[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const saved = localStorage.getItem(`dailyTasks_history_${dateStr}`);
      if (saved) {
        const data = JSON.parse(saved);
        days.push({
          date: dateStr,
          completed: data.completed,
          total: data.total,
          percentage: data.total > 0 ? (data.completed / data.total) * 100 : 0
        });
      } else if (i === 0) {
        // Bugün için mevcut todos'u kullan
        const completed = todos.filter(t => t.completed).length;
        days.push({
          date: dateStr,
          completed,
          total: todos.length,
          percentage: todos.length > 0 ? (completed / todos.length) * 100 : 0
        });
      } else {
        days.push({
          date: dateStr,
          completed: 0,
          total: 0,
          percentage: 0
        });
      }
    }
    
    setWeekData(days);
  }, [todos]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();

  const getBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-400';
    if (percentage >= 50) return 'bg-cyan-400';
    if (percentage > 0) return 'bg-yellow-400';
    return 'bg-white/20';
  };

  const totalCompleted = weekData.reduce((sum, day) => sum + day.completed, 0);
  const avgPercentage = weekData.length > 0 
    ? weekData.reduce((sum, day) => sum + day.percentage, 0) / weekData.length 
    : 0;

  return (
    <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 animate-slideUp">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span>📊</span> This Week
        </h3>
        <div className="text-right">
          <span className="text-white/60 text-xs">Avg. </span>
          <span className="text-white font-bold">{Math.round(avgPercentage)}%</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2 h-24 mb-3">
        {weekData.map((day, index) => {
          const dayIndex = new Date(day.date).getDay();
          const isToday = index === 6;
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full h-20 bg-white/10 rounded-lg overflow-hidden flex flex-col-reverse">
                <div 
                  className={`w-full transition-all duration-500 ${getBarColor(day.percentage)} ${isToday ? 'animate-pulse' : ''}`}
                  style={{ height: `${Math.max(day.percentage, 5)}%` }}
                />
              </div>
              <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-white/50'}`}>
                {dayNames[dayIndex]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-lg">✓</span>
          <span className="text-white/70 text-sm">{totalCompleted} tasks completed</span>
        </div>
        {avgPercentage >= 70 && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            Great week! 🔥
          </span>
        )}
      </div>
    </div>
  );
}
