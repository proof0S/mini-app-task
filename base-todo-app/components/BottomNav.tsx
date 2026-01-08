'use client';

interface BottomNavProps {
  activeTab: 'tasks' | 'crypto' | 'leaderboard' | 'settings';
  onTabChange: (tab: 'tasks' | 'crypto' | 'leaderboard' | 'settings') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'tasks', icon: '✅', label: 'Tasks' },
    { id: 'crypto', icon: '📈', label: 'Crypto' },
    { id: 'leaderboard', icon: '🏆', label: 'Rank' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="flex items-center justify-around bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 btn-press ${
                activeTab === tab.id
                  ? 'bg-white/20 scale-105'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className={`text-xl transition-transform duration-300 ${
                activeTab === tab.id ? 'scale-110' : ''
              }`}>
                {tab.icon}
              </span>
              <span className={`text-xs font-medium transition-all ${
                activeTab === tab.id ? 'text-white' : 'text-white/60'
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
