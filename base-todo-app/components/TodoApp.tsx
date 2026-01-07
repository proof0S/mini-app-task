'use client';

import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import CheckInMethodModal from './CheckInMethodModal';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  emoji: string;
  target?: number;
  current?: number;
  unit?: string;
}

interface LeaderboardUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
  score: number;
  tasksCompleted: number;
}

interface TodoAppProps {
  user?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null;
}

// Emoji bazlı esprili mesajlar
const funnyMessages: Record<string, string[]> = {
  '💧': [
    "H2O seni seviyor! Böbrekler teşekkür eder 💧",
    "Balıklar kıskanıyor şu an 🐟",
    "Cilt bakımının %90'ı tamam! ✨",
    "Çöl değil vaha oldun! 🏝️",
  ],
  '📚': [
    "Einstein kıskanır bu tempoyu! 🧠",
    "Beyin kasların çalışıyor! 💪",
    "Kütüphaneci olsan zengin olurdun 📖",
    "Netflix: Am I a joke to you? 😅",
  ],
  '🏃': [
    "Usain Bolt izliyor olabilir... 👀",
    "Kalorilerin kaçıyor! Yakala! 🔥",
    "Ayakkabılar gurur duyuyor 👟",
    "Asansör üzgün, merdiven mutlu! 😂",
  ],
  '🧘': [
    "Namaste! Bir kahve hak ettin ☕",
    "İç huzur: Yükleniyor... ✅",
    "Stres seviyesi: 📉📉📉",
    "Buda seni onaylıyor 🙏",
  ],
  '💪': [
    "Kaslar: Online! 💪",
    "Ayna bugün mutlu! 😎",
    "Thor kıskanç bakıyor ⚡",
    "Protein shake zamanı! 🥤",
  ],
  '🍎': [
    "Doktor uzakta kaldı! 🏥",
    "Vitamin deposu oldun! 🌈",
    "Sağlıklı yaşam +100 HP ❤️",
    "Meyve tabağı seni seviyor 🍇",
  ],
  '💤': [
    "Rüyalar güzel olsun! 🌙",
    "Uyku borcu: Ödendi ✅",
    "Yastık seni özlemişti! 🛏️",
    "8 saat kulübüne hoş geldin! 😴",
  ],
  'default': [
    "Harikasın! Böyle devam! 🌟",
    "Süpersin! Durma! 🚀",
    "Efsane hareket! 👑",
    "Kendini aştın! 💫",
    "Bu tempo çok iyi! 🔥",
    "Hedefleri eziyorsun! 💪",
  ]
};

// Streak mesajları
const streakMessages: Record<number, string> = {
  3: "3 gün! Alışkanlık oluşuyor 🌱",
  7: "1 hafta! Artık bu senin rutinin 🔥",
  14: "2 hafta! Durdurulamaz oldun 🚀",
  21: "21 gün! Bilim diyor ki: Bu artık alışkanlık! 🧬",
  30: "1 ay! Efsane statüsüne ulaştın 👑",
};

// Confetti component
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;
  
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    color: ['#00D4FF', '#0099FF', '#6B5BFF', '#00F5D4', '#FFFFFF', '#80EAFF', '#B794F6'][Math.floor(Math.random() * 7)],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Streak badge component
const StreakBadge = ({ streak }: { streak: number }) => {
  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
      <span className="text-2xl animate-flame">🔥</span>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] text-white/70 font-semibold tracking-wider">STREAK</span>
        <span className="text-sm font-bold text-white">
          {streak} {streak === 1 ? 'day' : 'days'}
        </span>
      </div>
    </div>
  );
};

// Progress ring component
const ProgressRing = ({ percentage }: { percentage: number }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90">
        <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
        <circle
          cx="48" cy="48" r="40"
          stroke="url(#glowGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
          style={{ filter: percentage === 100 ? 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.8))' : 'none' }}
        />
        <defs>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#6B5BFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white drop-shadow-lg">{Math.round(percentage)}%</span>
        <span className="text-[10px] text-white/70 font-medium">progress</span>
      </div>
    </div>
  );
};

// Leaderboard component
const Leaderboard = ({ 
  users, 
  currentUserFid,
  onClose 
}: { 
  users: LeaderboardUser[];
  currentUserFid?: number;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">🏆 Leaderboard</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={user.fid}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                user.fid === currentUserFid 
                  ? 'bg-cyan-500/30 border border-cyan-400/50' 
                  : 'bg-white/10'
              }`}
            >
              <span className="text-2xl font-bold text-white/80 w-8">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>
              
              {user.pfpUrl ? (
                <img src={user.pfpUrl} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
              )}
              
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  {user.displayName || user.username}
                </p>
                <p className="text-white/60 text-xs">
                  {user.tasksCompleted} tasks
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-white font-bold">{user.score}</p>
                <p className="text-white/60 text-xs">points</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/50 text-xs text-center mt-4">
          Complete tasks to earn points! 🎯
        </p>
      </div>
    </div>
  );
};

// Slider Todo Item (Swipe mode)
const SliderTodoItem = ({ 
  todo, 
  onUpdate, 
  onDelete,
  onComplete
}: { 
  todo: Todo; 
  onUpdate: (id: number, current: number) => void;
  onDelete: (id: number) => void;
  onComplete: () => void;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const target = todo.target || 1;
  const current = todo.current || 0;
  const percentage = (current / target) * 100;

  const handleInteraction = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = Math.round((percent / 100) * target);
    
    if (newValue !== current) {
      onUpdate(todo.id, newValue);
      if (newValue === target && current !== target) {
        onComplete();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleInteraction(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleInteraction(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleInteraction(e.touches[0].clientX);
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
      todo.completed 
        ? 'bg-white/30 border-cyan-300/50 shadow-lg shadow-cyan-500/20' 
        : 'bg-white/15 border-white/30'
    } border backdrop-blur-xl`}>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <span className="text-xl mr-2">{todo.emoji}</span>
          <span className={`flex-1 font-semibold ${todo.completed ? 'text-white/60 line-through' : 'text-white'}`}>
            {todo.text}
          </span>
          <span className="text-white font-bold mr-2">
            {current}/{target} {todo.unit || ''}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div
          ref={sliderRef}
          className="relative h-12 bg-white/20 rounded-full cursor-pointer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-150 ${
              todo.completed 
                ? 'bg-gradient-to-r from-green-400 to-cyan-400' 
                : 'bg-gradient-to-r from-cyan-400 to-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
          
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform ${
              isDragging ? 'scale-125' : 'scale-100'
            }`}
            style={{ 
              left: `clamp(4px, calc(${percentage}% - 20px), calc(100% - 44px))`,
            }}
          >
            <span className="text-2xl">{todo.completed ? '✅' : todo.emoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tap Todo Item
const TapTodoItem = ({ 
  todo, 
  onToggle, 
  onDelete 
}: { 
  todo: Todo; 
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <div className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
      todo.completed 
        ? 'bg-white/30 border-cyan-300/50 shadow-lg shadow-cyan-500/20' 
        : 'bg-white/15 hover:bg-white/25 border-white/30'
    } border backdrop-blur-xl`}>
      <div className="flex items-center p-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            todo.completed 
              ? 'bg-cyan-500 border-transparent scale-110 shadow-lg shadow-cyan-500/30' 
              : 'border-white/50 hover:border-cyan-300 hover:scale-105 bg-white/10'
          }`}
        >
          {todo.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <span className="ml-3 text-xl">{todo.emoji}</span>
        <span className={`ml-3 flex-1 font-semibold transition-all duration-300 ${
          todo.completed ? 'text-white/60 line-through' : 'text-white'
        }`}>
          {todo.text}
        </span>

        <button
          onClick={() => onDelete(todo.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const emojis = ['✨', '🎯', '💪', '📚', '💧', '🏃', '🧘', '💼', '🎨', '🎵', '🍎', '💤'];

const defaultTodos: Todo[] = [
  { id: 1, text: "Morning workout", completed: false, emoji: "🏃", target: 30, current: 0, unit: "min" },
  { id: 2, text: "Drink water", completed: false, emoji: "💧", target: 8, current: 0, unit: "glasses" },
  { id: 3, text: "Read book", completed: false, emoji: "📚", target: 30, current: 0, unit: "pages" },
];

// Demo leaderboard data
const demoLeaderboard: LeaderboardUser[] = [
  { fid: 1, username: "alice", displayName: "Alice ✨", score: 2450, tasksCompleted: 89 },
  { fid: 2, username: "bob", displayName: "Bob 🚀", score: 2100, tasksCompleted: 76 },
  { fid: 3, username: "charlie", displayName: "Charlie", score: 1850, tasksCompleted: 65 },
  { fid: 4, username: "diana", displayName: "Diana 🌟", score: 1600, tasksCompleted: 58 },
  { fid: 5, username: "eve", displayName: "Eve", score: 1200, tasksCompleted: 42 },
];

export default function TodoApp({ user }: TodoAppProps) {
  const { checkInMethod, setShowMethodModal } = useSettings();
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [newTodo, setNewTodo] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [streak, setStreak] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    const savedTodos = localStorage.getItem('dailyTasks_todos_v2');
    const savedStreak = localStorage.getItem('dailyTasks_streak');
    const savedScore = localStorage.getItem('dailyTasks_score');
    const lastVisit = localStorage.getItem('dailyTasks_lastVisit');
    
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedScore) setUserScore(parseInt(savedScore));
    
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      localStorage.setItem('dailyTasks_lastVisit', today);
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('dailyTasks_streak', newStreak.toString());
          
          // Streak milestone mesajı
          if (streakMessages[newStreak]) {
            setTimeout(() => {
              setCelebrationMessage(streakMessages[newStreak]);
              setShowConfetti(true);
              setTimeout(() => {
                setShowConfetti(false);
                setCelebrationMessage('');
              }, 3000);
            }, 1000);
          }
        } else if (diffDays > 1) {
          setStreak(1);
          localStorage.setItem('dailyTasks_streak', '1');
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyTasks_todos_v2', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('dailyTasks_score', userScore.toString());
  }, [userScore]);

  const calculateTotalProgress = () => {
    if (todos.length === 0) return 0;
    const totalPercentage = todos.reduce((sum, todo) => {
      const target = todo.target || 1;
      const current = todo.current || 0;
      return sum + Math.min((current / target) * 100, 100);
    }, 0);
    return totalPercentage / todos.length;
  };

  const totalProgress = calculateTotalProgress();
  const completedCount = todos.filter(t => t.completed).length;

  // Emoji'ye göre esprili mesaj seç
  const getFunnyMessage = (emoji: string) => {
    const messages = funnyMessages[emoji] || funnyMessages['default'];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const triggerCelebration = (emoji: string = '✨') => {
    setShowConfetti(true);
    setCelebrationMessage(getFunnyMessage(emoji));
    
    // Skor ekle
    const points = 10 * (streak > 1 ? Math.min(streak, 5) : 1); // Streak bonusu
    setUserScore(prev => prev + points);
    
    setTimeout(() => {
      setShowConfetti(false);
      setCelebrationMessage('');
    }, 2500);
    
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const toggleTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
        if (newCompleted) triggerCelebration(t.emoji);
        return { ...t, completed: newCompleted, current: newCompleted ? t.target : 0 };
      }
      return t;
    }));
  };

  const updateTodoProgress = (id: number, current: number) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const completed = current >= (todo.target || 1);
        return { ...todo, current, completed };
      }
      return todo;
    }));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const target = parseInt(newTarget) || 1;
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: newTodo,
        completed: false,
        emoji: selectedEmoji,
        target: target,
        current: 0,
        unit: newUnit || ''
      }]);
      setNewTodo('');
      setNewTarget('');
      setNewUnit('');
      setShowAddForm(false);
      setSelectedEmoji('✨');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Kullanıcıyı leaderboard'a ekle
  const getLeaderboardWithUser = () => {
    const userEntry: LeaderboardUser = {
      fid: user?.fid || 999999,
      username: user?.username || 'you',
      displayName: user?.displayName || 'You',
      pfpUrl: user?.pfpUrl,
      score: userScore,
      tasksCompleted: completedCount,
    };
    
    const combined = [...demoLeaderboard, userEntry];
    return combined.sort((a, b) => b.score - a.score).slice(0, 10);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #0099FF 25%, #00BFFF 50%, #6B5BFF 75%, #00D4FF 100%)'
      }}
    >
      <CheckInMethodModal />
      
      {showLeaderboard && (
        <Leaderboard 
          users={getLeaderboardWithUser()} 
          currentUserFid={user?.fid}
          onClose={() => setShowLeaderboard(false)} 
        />
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-float-slow" />
      </div>

      <Confetti active={showConfetti} />

      {celebrationMessage && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="px-6 py-4 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-xs text-center">
            <span className="text-xl font-bold text-white drop-shadow-lg">{celebrationMessage}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white drop-shadow-lg">Daily Tasks</h1>
            <p className="text-white/80 text-sm font-medium">
              {user?.displayName ? `Hey ${user.displayName}! ✨` : 'Build better habits ✨'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StreakBadge streak={streak} />
            <button
              onClick={() => setShowMethodModal(true)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Score & Leaderboard Button */}
        <div className="mb-4 flex items-center justify-between">
          <div className="px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs font-medium">
            {checkInMethod === 'swipe' ? '👆 Slide to track progress' : '👆 Tap to complete'}
          </div>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/20 hover:bg-yellow-400/30 transition-all border border-yellow-400/30"
          >
            <span>🏆</span>
            <span className="text-white font-bold text-sm">{userScore}</span>
          </button>
        </div>

        {/* Progress section */}
        <div className="flex items-center justify-between mb-6 p-5 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl">
          <ProgressRing percentage={totalProgress} />
          <div className="text-right">
            <p className="text-white/70 text-sm font-medium">Today's progress</p>
            <p className="text-white text-4xl font-black drop-shadow-lg">
              {Math.round(totalProgress)}%
            </p>
            <p className="text-white/60 text-xs mt-1">
              {completedCount}/{todos.length} tasks done
            </p>
            {completedCount === todos.length && todos.length > 0 && (
              <p className="text-cyan-200 text-sm font-semibold mt-1 animate-pulse">🎉 All done!</p>
            )}
          </div>
        </div>

        {/* Todo list */}
        <div className="space-y-3 mb-6">
          {todos.map((todo) => (
            checkInMethod === 'swipe' ? (
              <SliderTodoItem
                key={todo.id}
                todo={todo}
                onUpdate={updateTodoProgress}
                onDelete={deleteTodo}
                onComplete={() => triggerCelebration(todo.emoji)}
              />
            ) : (
              <TapTodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            )
          ))}
        </div>

        {/* Add todo */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-white/40 hover:border-white/70 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center gap-2 text-white/70 group-hover:text-white font-semibold">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add new task</span>
            </div>
          </button>
        ) : (
          <div className="p-4 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    selectedEmoji === emoji 
                      ? 'bg-white/40 scale-110 ring-2 ring-white shadow-lg' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Task name (e.g., Read book)"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 mb-3 font-medium"
              autoFocus
            />

            {checkInMethod === 'swipe' && (
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="Target (e.g., 30)"
                  className="w-full sm:flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                />
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="Unit (e.g., pages)"
                  className="w-full sm:flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-all font-semibold border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={addTodo}
                className="flex-1 py-3 rounded-xl bg-white/40 text-white font-bold hover:bg-white/50 transition-all shadow-lg border border-white/50"
              >
                Add Task ✨
              </button>
            </div>
          </div>
        )}

        {/* Branding */}
        <div className="mt-8 flex items-center justify-center gap-2 text-white/50 text-sm font-medium">
          <span>Built on</span>
          <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-lg">
            <div className="w-4 h-4 rounded bg-white/80 flex items-center justify-center">
              <svg viewBox="0 0 111 111" fill="none" className="w-2.5 h-2.5">
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0066CC"/>
              </svg>
            </div>
            <span className="text-white font-bold">Base</span>
          </div>
        </div>
      </div>
    </div>
  );
}
