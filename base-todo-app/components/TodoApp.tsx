'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  emoji: string;
}

interface TodoAppProps {
  user?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null;
}

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
const ProgressRing = ({ progress, total }: { progress: number; total: number }) => {
  const percentage = total > 0 ? (progress / total) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="url(#glowGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
          style={{
            filter: percentage === 100 ? 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.8))' : 'none'
          }}
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
        <span className="text-xl font-bold text-white drop-shadow-lg">{progress}/{total}</span>
        <span className="text-[10px] text-white/70 font-medium">completed</span>
      </div>
    </div>
  );
};

// Positive messages
const positiveMessages = [
  "Amazing! 🌟",
  "You did it! 💪",
  "Superstar! ⚡",
  "Incredible! 🎉",
  "Bravo! 🏆",
  "Legendary! 🚀",
  "On fire! 🔥",
  "Crushing it! 👑"
];

const emojis = ['✨', '🎯', '💪', '📚', '💧', '🏃', '🧘', '💼', '🎨', '🎵', '🍎', '💤'];

const defaultTodos: Todo[] = [
  { id: 1, text: "Morning workout", completed: false, emoji: "🏃" },
  { id: 2, text: "Drink 8 glasses of water", completed: false, emoji: "💧" },
  { id: 3, text: "Read for 30 minutes", completed: false, emoji: "📚" },
];

export default function TodoApp({ user }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [newTodo, setNewTodo] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [streak, setStreak] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('✨');

  // Load from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('dailyTasks_todos');
    const savedStreak = localStorage.getItem('dailyTasks_streak');
    const lastVisit = localStorage.getItem('dailyTasks_lastVisit');
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
    
    // Check streak
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      localStorage.setItem('dailyTasks_lastVisit', today);
      // Reset todos for new day but keep streak
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day, increase streak
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('dailyTasks_streak', newStreak.toString());
        } else if (diffDays > 1) {
          // Streak broken
          setStreak(1);
          localStorage.setItem('dailyTasks_streak', '1');
        }
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('dailyTasks_todos', JSON.stringify(todos));
  }, [todos]);

  const completedCount = todos.filter(t => t.completed).length;

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const newCompleted = !todo.completed;
        
        if (newCompleted) {
          setShowConfetti(true);
          setCelebrationMessage(positiveMessages[Math.floor(Math.random() * positiveMessages.length)]);
          
          setTimeout(() => {
            setShowConfetti(false);
            setCelebrationMessage('');
          }, 2000);
          
          if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
          }
        }
        
        return { ...todo, completed: newCompleted };
      }
      return todo;
    }));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: newTodo,
        completed: false,
        emoji: selectedEmoji
      }]);
      setNewTodo('');
      setShowAddForm(false);
      setSelectedEmoji('✨');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #0099FF 25%, #00BFFF 50%, #6B5BFF 75%, #00D4FF 100%)'
      }}
    >
      {/* Animated glass orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      <Confetti active={showConfetti} />

      {/* Celebration message */}
      {celebrationMessage && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="px-8 py-4 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
            <span className="text-2xl font-bold text-white drop-shadow-lg">{celebrationMessage}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white drop-shadow-lg">
              Daily Tasks
            </h1>
            <p className="text-white/80 text-sm font-medium drop-shadow">
              {user?.displayName ? `Hey ${user.displayName}! ✨` : 'Build better habits ✨'}
            </p>
          </div>
          <StreakBadge streak={streak} />
        </div>

        {/* Progress section */}
        <div className="flex items-center justify-between mb-6 p-5 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl">
          <ProgressRing progress={completedCount} total={todos.length} />
          <div className="text-right">
            <p className="text-white/70 text-sm font-medium">Today's progress</p>
            <p className="text-white text-4xl font-black drop-shadow-lg">
              {todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0}%
            </p>
            {completedCount === todos.length && todos.length > 0 && (
              <p className="text-cyan-200 text-sm font-semibold mt-1 animate-pulse">
                🎉 All done!
              </p>
            )}
          </div>
        </div>

        {/* Todo list */}
        <div className="space-y-3 mb-6">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                todo.completed 
                  ? 'bg-white/30 border-cyan-300/50 shadow-lg shadow-cyan-500/20' 
                  : 'bg-white/15 hover:bg-white/25 border-white/30'
              } border backdrop-blur-xl`}
            >
              <div className="flex items-center p-4">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    todo.completed 
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 border-transparent scale-110 shadow-lg shadow-cyan-500/50' 
                      : 'border-white/50 hover:border-cyan-300 hover:scale-105 bg-white/10'
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-4 h-4 text-white animate-check drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <span className="ml-3 text-xl drop-shadow">{todo.emoji}</span>
                <span className={`ml-3 flex-1 font-semibold transition-all duration-300 drop-shadow ${
                  todo.completed ? 'text-white/60 line-through' : 'text-white'
                }`}>
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {todo.completed && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
              )}
            </div>
          ))}
        </div>

        {/* Add todo section */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-white/40 hover:border-white/70 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center gap-2 text-white/70 group-hover:text-white font-semibold drop-shadow">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add new task</span>
            </div>
          </button>
        ) : (
          <div className="p-4 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl animate-slide-up">
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
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What do you want to achieve?"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 mb-4 font-medium"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-all font-semibold border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={addTodo}
                className="flex-1 py-3 rounded-xl bg-white/40 text-white font-bold hover:bg-white/50 transition-all hover:scale-[1.02] shadow-lg border border-white/50 active:scale-[0.98]"
              >
                Add Task ✨
              </button>
            </div>
          </div>
        )}

        {/* Bottom branding */}
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
