'use client';

import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSound } from '../hooks/useSound';
import CheckInMethodModal from './CheckInMethodModal';
import CryptoTracker from './CryptoTracker';
import Leaderboard from './Leaderboard';
import Onboarding from './Onboarding';
import Toast, { ToastMessage } from './Toast';
import EmptyState from './EmptyState';
import BottomNav from './BottomNav';
import SettingsPanel from './SettingsPanel';
import { SkeletonTask, SkeletonProgress } from './Skeleton';
import WeeklyStats from './WeeklyStats';
import ShareModal from './ShareModal';
import DailyReward from './DailyReward';
import { getLeaderboard, updateScore, LeaderboardEntry } from '../lib/supabase';
import { Todo, categories, defaultTodos } from '../types/todo';

interface TodoAppProps {
  user?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null;
}

const funnyMessages: Record<string, string[]> = {
  '💧': ["H2O seni seviyor! 💧", "Balıklar kıskanıyor 🐟", "Cilt bakımı +100! ✨"],
  '📚': ["Beyin kasları çalışıyor! 🧠", "Einstein kıskanır! 💪", "Netflix üzgün 😅"],
  '🏃': ["Usain Bolt izliyor 👀", "Kalorilerin kaçıyor! 🔥", "Ayakkabılar gurur duyuyor 👟"],
  '🧘': ["Namaste! ☕", "Stres seviyesi: 📉", "İç huzur: ✅"],
  'default': ["Harikasın! 🌟", "Süpersin! 🚀", "Efsane! 👑", "Devam et! 💫"]
};

const streakMessages: Record<number, string> = {
  3: "3 gün! Alışkanlık oluşuyor 🌱",
  7: "1 hafta! Bu senin rutinin 🔥",
  14: "2 hafta! Durdurulamaz! 🚀",
  21: "21 gün! Artık alışkanlık! 🧬",
  30: "1 ay! Efsane oldun 👑",
};

const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    color: ['#00D4FF', '#0099FF', '#6B5BFF', '#00F5D4', '#FFFFFF', '#FF6B6B', '#FFD93D'][Math.floor(Math.random() * 7)],
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

const StreakBadge = ({ streak }: { streak: number }) => {
  if (streak === 0) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
      <span className="text-xl animate-flame">🔥</span>
      <span className="text-sm font-bold text-white">{streak}</span>
    </div>
  );
};

const ProgressRing = ({ percentage, accentColor }: { percentage: number; accentColor: string }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90">
        <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
        <circle
          cx="48" cy="48" r="40"
          stroke={accentColor}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
          style={{ filter: percentage === 100 ? `drop-shadow(0 0 8px ${accentColor})` : 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white drop-shadow-lg">{Math.round(percentage)}%</span>
        <span className="text-[10px] text-white/70 font-medium">progress</span>
      </div>
    </div>
  );
};

const CategoryBadge = ({ category }: { category: keyof typeof categories }) => {
  const cat = categories[category];
  const colorClasses: Record<string, string> = {
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  };
  
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colorClasses[cat.color]}`}>
      {cat.emoji} {cat.name}
    </span>
  );
};

const SliderTodoItem = ({ todo, onUpdate, onDelete, onComplete, accentColor, playSound, vibrate, index }: { 
  todo: Todo; 
  onUpdate: (id: number, current: number) => void;
  onDelete: (id: number) => void;
  onComplete: () => void;
  accentColor: string;
  playSound: (type: 'slide' | 'complete' | 'click' | 'success') => void;
  vibrate: (pattern: number | number[]) => void;
  index: number;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastValue = useRef(todo.current || 0);
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
      if (newValue !== lastValue.current) {
        playSound('slide');
        vibrate(5);
        lastValue.current = newValue;
      }
      onUpdate(todo.id, newValue);
      if (newValue === target && current !== target) {
        playSound('complete');
        vibrate([50, 30, 50, 30, 100]);
        onComplete();
      }
    }
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 animate-slideUp card-hover ${
        todo.completed ? 'bg-white/30 shadow-lg animate-glow' : 'bg-white/15'
      } border border-white/20 backdrop-blur-xl stagger-${Math.min(index + 1, 5)}`}
      style={{ opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={todo.category} />
          {todo.isRecurring && <span className="text-[10px] text-white/50">🔄 Daily</span>}
        </div>
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
            className="opacity-0 group-hover:opacity-100 p-2 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all btn-press"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div
          ref={sliderRef}
          className="relative h-12 bg-white/20 rounded-full cursor-pointer"
          onMouseDown={(e) => { setIsDragging(true); handleInteraction(e.clientX); }}
          onMouseMove={(e) => isDragging && handleInteraction(e.clientX)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => { setIsDragging(true); handleInteraction(e.touches[0].clientX); }}
          onTouchMove={(e) => isDragging && handleInteraction(e.touches[0].clientX)}
          onTouchEnd={() => setIsDragging(false)}
        >
          <div 
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
            style={{ 
              width: `${percentage}%`,
              background: todo.completed 
                ? 'linear-gradient(90deg, #10B981, #34D399)' 
                : `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)`
            }}
          />
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform ${
              isDragging ? 'scale-125 shadow-xl' : 'scale-100'
            }`}
            style={{ left: `clamp(4px, calc(${percentage}% - 20px), calc(100% - 44px))` }}
          >
            <span className="text-2xl">{todo.completed ? '✅' : todo.emoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TapTodoItem = ({ todo, onToggle, onDelete, accentColor, playSound, vibrate, index }: { 
  todo: Todo; 
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  accentColor: string;
  playSound: (type: 'slide' | 'complete' | 'click' | 'success') => void;
  vibrate: (pattern: number | number[]) => void;
  index: number;
}) => {
  const handleToggle = () => {
    playSound('click');
    vibrate(10);
    if (!todo.completed) {
      setTimeout(() => {
        playSound('complete');
        vibrate([50, 30, 50]);
      }, 100);
    }
    onToggle(todo.id);
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 animate-slideUp card-hover ${
        todo.completed ? 'bg-white/30 shadow-lg' : 'bg-white/15 hover:bg-white/25'
      } border border-white/20 backdrop-blur-xl stagger-${Math.min(index + 1, 5)}`}
      style={{ opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={todo.category} />
          {todo.isRecurring && <span className="text-[10px] text-white/50">🔄 Daily</span>}
        </div>
        <div className="flex items-center">
          <button
            onClick={handleToggle}
            className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 btn-press ${
              todo.completed 
                ? 'border-transparent scale-110 shadow-lg' 
                : 'border-white/50 hover:border-white hover:scale-105 bg-white/10'
            }`}
            style={{ backgroundColor: todo.completed ? accentColor : undefined }}
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
            className="opacity-0 group-hover:opacity-100 p-2 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all btn-press"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const emojis = ['✨', '🎯', '💪', '📚', '💧', '🏃', '🧘', '💼', '🎨', '🎵', '🍎', '💤'];

export default function TodoApp({ user }: TodoAppProps) {
  const { checkInMethod, setShowMethodModal } = useSettings();
  const { currentTheme, customBackground } = useTheme();
  const { playSound, vibrate } = useSound();
  
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [newTodo, setNewTodo] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newCategory, setNewCategory] = useState<keyof typeof categories>('personal');
  const [isRecurring, setIsRecurring] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [streak, setStreak] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [userScore, setUserScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<'all' | keyof typeof categories>('all');
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'crypto' | 'leaderboard' | 'settings'>('tasks');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<any>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);

  // Günlük sıfırlama ve veri yükleme
  useEffect(() => {
    const savedOnboarding = localStorage.getItem('dailyTasks_onboarded');
    if (!savedOnboarding) {
      setShowOnboarding(true);
    }

    const savedTodos = localStorage.getItem('dailyTasks_todos_v3');
    const savedStreak = localStorage.getItem('dailyTasks_streak');
    const savedScore = localStorage.getItem('dailyTasks_score');
    const lastVisit = localStorage.getItem('dailyTasks_lastVisit');
    const today = new Date().toDateString();

    // Bugün için görevleri kontrol et
    if (lastVisit !== today) {
      // Yeni gün - önceki günün verilerini kaydet
      if (lastVisit && savedTodos) {
        const oldTodos = JSON.parse(savedTodos);
        const completed = oldTodos.filter((t: Todo) => t.completed).length;
        localStorage.setItem(`dailyTasks_history_${lastVisit}`, JSON.stringify({
          completed,
          total: oldTodos.length,
          date: lastVisit
        }));
      }

      localStorage.setItem('dailyTasks_lastVisit', today);
      
      // Tekrarlayan görevleri sıfırla
      if (savedTodos) {
        const oldTodos: Todo[] = JSON.parse(savedTodos);
        const resetTodos = oldTodos.map(todo => ({
          ...todo,
          completed: todo.isRecurring ? false : todo.completed,
          current: todo.isRecurring ? 0 : todo.current,
        }));
        setTodos(resetTodos);
        localStorage.setItem('dailyTasks_todos_v3', JSON.stringify(resetTodos));
        addToast('info', '🌅 New day! Recurring tasks reset.');
      }

      // Streak hesapla
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          const newStreak = (parseInt(savedStreak || '1')) + 1;
          setStreak(newStreak);
          localStorage.setItem('dailyTasks_streak', newStreak.toString());
          
          if (streakMessages[newStreak]) {
            setTimeout(() => {
              setCelebrationMessage(streakMessages[newStreak]);
              setShowConfetti(true);
              playSound('success');
              setTimeout(() => {
                setShowConfetti(false);
                setCelebrationMessage('');
              }, 3000);
            }, 1000);
          }
        } else if (diffDays > 1) {
          setStreak(1);
          localStorage.setItem('dailyTasks_streak', '1');
          addToast('warning', '😅 Streak reset! Start fresh today!');
        }
      }
    } else {
      // Aynı gün - verileri yükle
      if (savedTodos) setTodos(JSON.parse(savedTodos));
      if (savedStreak) setStreak(parseInt(savedStreak));
    }
    
    if (savedScore) setUserScore(parseInt(savedScore));
    
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyTasks_todos_v3', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('dailyTasks_score', userScore.toString());
  }, [userScore]);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleShare = (data: any) => {
    setShareData(data);
    setShowShareModal(true);
  };

  const handleClaimReward = (points: number) => {
    setUserScore(prev => prev + points);
    addToast('success', `+${points} points claimed! 🎁`);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('dailyTasks_onboarded', 'true');
    addToast('success', 'Welcome! Lets build great habits! 🎉');
  };

  const calculateTotalProgress = () => {
    const filtered = filterCategory === 'all' ? todos : todos.filter(t => t.category === filterCategory);
    if (filtered.length === 0) return 0;
    const totalPercentage = filtered.reduce((sum, todo) => {
      const target = todo.target || 1;
      const current = todo.current || 0;
      return sum + Math.min((current / target) * 100, 100);
    }, 0);
    return totalPercentage / filtered.length;
  };

  const totalProgress = calculateTotalProgress();
  const filteredTodos = filterCategory === 'all' ? todos : todos.filter(t => t.category === filterCategory);
  const completedCount = todos.filter(t => t.completed).length;

  const getFunnyMessage = (emoji: string) => {
    const messages = funnyMessages[emoji] || funnyMessages['default'];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const triggerCelebration = (emoji: string = '✨') => {
    setShowConfetti(true);
    setCelebrationMessage(getFunnyMessage(emoji));
    
    const points = 10 * (streak > 1 ? Math.min(streak, 5) : 1);
    setUserScore(prev => prev + points);
    
    setTimeout(() => {
      setShowConfetti(false);
      setCelebrationMessage('');
    }, 2500);
  };

  const toggleTodo = (id: number) => {
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
      playSound('click');
      const target = parseInt(newTarget) || 1;
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: newTodo,
        completed: false,
        emoji: selectedEmoji,
        target: target,
        current: 0,
        unit: newUnit || '',
        category: newCategory,
        isRecurring: isRecurring,
        createdAt: new Date().toISOString(),
      }]);
      setNewTodo('');
      setNewTarget('');
      setNewUnit('');
      setShowAddForm(false);
      setSelectedEmoji('✨');
      setNewCategory('personal');
      setIsRecurring(true);
      addToast('success', 'Task added! 🎯');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    addToast('info', 'Task removed');
  };

  const handleTabChange = (tab: 'tasks' | 'crypto' | 'leaderboard' | 'settings') => {
    playSound('click');
    setActiveTab(tab);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden pb-24"
      style={{
        background: customBackground 
          ? `url(${customBackground}) center/cover fixed`
          : currentTheme.gradient
      }}
    >
      {customBackground && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      )}

      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      
      <Toast toasts={toasts} onRemove={removeToast} />
      
      {showShareModal && shareData && (
        <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} shareData={shareData} />
      )}
      
      <DailyReward isOpen={showDailyReward} onClose={() => setShowDailyReward(false)} onClaim={handleClaimReward} streak={streak} />
      <Confetti active={showConfetti} />
      <CheckInMethodModal />

      {celebrationMessage && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 animate-scaleIn">
          <div className="px-6 py-4 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-xs text-center">
            <span className="text-xl font-bold text-white drop-shadow-lg">{celebrationMessage}</span>
          </div>
        </div>
      )}

      {!customBackground && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
        </div>
      )}

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        
        {activeTab === 'tasks' && (
          <div className="animate-fadeIn">
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
                <button onClick={() => setShowDailyReward(true)} className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border border-yellow-400/30 hover:from-yellow-400/40 hover:to-orange-400/40 transition-all btn-press">
                  <span className="text-lg">🎁</span>
                </button>
                <div className="px-3 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/30">
                  <span className="text-white font-bold text-sm">🏆 {userScore}</span>
                </div>
              </div>
            </div>

            {/* Progress section */}
            {isLoading ? (
              <SkeletonProgress />
            ) : (
              <div className="flex items-center justify-between mb-6 p-5 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl animate-slideUp">
                <ProgressRing percentage={totalProgress} accentColor={currentTheme.accentColor} />
                <div className="text-right">
                  <p className="text-white/70 text-sm font-medium">Today's progress</p>
                  <p className="text-white text-4xl font-black drop-shadow-lg">
                    {Math.round(totalProgress)}%
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {completedCount}/{todos.length} tasks done
                  </p>
                </div>
              </div>
            )}

            {/* Weekly Stats */}
            <div className="mb-6">
              <WeeklyStats todos={todos} />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all btn-press ${
                  filterCategory === 'all' 
                    ? 'bg-white/30 text-white' 
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                All ({todos.length})
              </button>
              {(Object.keys(categories) as Array<keyof typeof categories>).map(key => {
                const count = todos.filter(t => t.category === key).length;
                if (count === 0) return null;
                return (
                  <button
                    key={key}
                    onClick={() => setFilterCategory(key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all btn-press ${
                      filterCategory === key 
                        ? 'bg-white/30 text-white' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {categories[key].emoji} {categories[key].name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Mode indicator */}
            <div className="mb-4 flex items-center justify-center">
              <div className="px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs font-medium">
                {checkInMethod === 'swipe' ? '👆 Slide to track' : '👆 Tap to complete'}
              </div>
            </div>

            {/* Todo list */}
            <div className="space-y-3 mb-6">
              {isLoading ? (
                <>
                  <SkeletonTask />
                  <SkeletonTask />
                  <SkeletonTask />
                </>
              ) : filteredTodos.length === 0 ? (
                <EmptyState
                  icon="📝"
                  title="No tasks yet"
                  description={filterCategory === 'all' 
                    ? "Add your first task and start building great habits!"
                    : `No ${categories[filterCategory as keyof typeof categories]?.name} tasks yet`}
                  actionLabel="Add Task"
                  onAction={() => setShowAddForm(true)}
                />
              ) : (
                filteredTodos.map((todo, index) => (
                  checkInMethod === 'swipe' ? (
                    <SliderTodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={updateTodoProgress}
                      onDelete={deleteTodo}
                      onComplete={() => triggerCelebration(todo.emoji)}
                      accentColor={currentTheme.accentColor}
                      playSound={playSound}
                      vibrate={vibrate}
                      index={index}
                    />
                  ) : (
                    <TapTodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      accentColor={currentTheme.accentColor}
                      playSound={playSound}
                      vibrate={vibrate}
                      index={index}
                    />
                  )
                ))
              )}
            </div>

            {/* Add todo */}
            {!showAddForm ? (
              <button
                onClick={() => {
                  playSound('click');
                  setShowAddForm(true);
                }}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-white/40 hover:border-white/70 hover:bg-white/10 transition-all duration-300 group btn-press"
              >
                <div className="flex items-center justify-center gap-2 text-white/70 group-hover:text-white font-semibold">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add new task</span>
                </div>
              </button>
            ) : (
              <div className="p-4 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl animate-scaleIn">
                {/* Emoji selector */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => {
                        playSound('click');
                        setSelectedEmoji(emoji);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all btn-press ${
                        selectedEmoji === emoji 
                          ? 'bg-white/40 scale-110 ring-2 ring-white shadow-lg' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Task name */}
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Task name"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 mb-3 font-medium"
                  autoFocus
                />

                {/* Category selector */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(Object.keys(categories) as Array<keyof typeof categories>).map(key => (
                    <button
                      key={key}
                      onClick={() => setNewCategory(key)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all btn-press ${
                        newCategory === key 
                          ? 'bg-white/30 text-white ring-2 ring-white/50' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {categories[key].emoji} {categories[key].name}
                    </button>
                  ))}
                </div>

                {/* Recurring toggle */}
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔄</span>
                    <span className="text-white text-sm font-medium">Repeat daily</span>
                  </div>
                  <button
                    onClick={() => setIsRecurring(!isRecurring)}
                    className={`w-12 h-7 rounded-full transition-all ${isRecurring ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isRecurring ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Target and unit (for swipe mode) */}
                {checkInMethod === 'swipe' && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      placeholder="Target"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                    />
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="Unit"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-all font-semibold btn-press"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTodo}
                    className="flex-1 py-3 rounded-xl bg-white/40 text-white font-bold hover:bg-white/50 transition-all shadow-lg btn-press"
                  >
                    Add ✨
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'crypto' && (
          <div className="animate-fadeIn">
            <CryptoTracker isOpen={true} onClose={() => setActiveTab('tasks')} />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="animate-fadeIn">
            <Leaderboard 
              isOpen={true} 
              onClose={() => setActiveTab('tasks')}
              currentUser={user}
              userScore={userScore}
              tasksCompleted={completedCount}
              streak={streak}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fadeIn">
            <SettingsPanel 
              isOpen={true} 
              onClose={() => setActiveTab('tasks')} 
              user={user} 
              userScore={userScore} 
              tasksCompleted={completedCount} 
              streak={streak} 
            />
          </div>
        )}

      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
