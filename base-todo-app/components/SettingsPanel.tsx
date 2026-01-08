'use client';

import { useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import Achievements from './Achievements';
import { useTheme, themes } from '../contexts/ThemeContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  } | null;
  userScore?: number;
  tasksCompleted?: number;
  streak?: number;
}

export default function SettingsPanel({ 
  isOpen, 
  onClose, 
  user,
  userScore = 0,
  tasksCompleted = 0,
  streak = 0
}: SettingsPanelProps) {
  const { checkInMethod, setCheckInMethod } = useSettings();
  const { currentTheme, setTheme, customBackground, setCustomBackground, soundEnabled, setSoundEnabled, hapticEnabled, setHapticEnabled } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { id: 'neutral', name: 'Universal', emojis: ['🌊', '🌅'] },
    { id: 'feminine', name: 'Soft', emojis: ['🌸', '💜', '🍑'] },
    { id: 'masculine', name: 'Bold', emojis: ['🌙', '🌲', '⚙️'] },
    { id: 'nature', name: 'Nature', emojis: ['✨', '🌺'] },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white drop-shadow-lg flex items-center gap-2">
            <span>⚙️</span> Settings
          </h1>
          <p className="text-white/80 text-sm font-medium">Customize your experience</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="mb-6 p-5 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl backdrop-blur-xl border border-white/20 animate-slideUp">
        <div className="flex items-center gap-4 mb-4">
          {user?.pfpUrl ? (
            <img src={user.pfpUrl} alt="" className="w-16 h-16 rounded-2xl border-2 border-white/30" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
              <span className="text-3xl">👤</span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-white text-xl font-bold">{user?.displayName || 'Guest User'}</h2>
            {user?.username && (
              <p className="text-white/60 text-sm">@{user.username}</p>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white">{userScore}</p>
            <p className="text-white/60 text-xs">Points</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white">{tasksCompleted}</p>
            <p className="text-white/60 text-xs">Tasks</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white">🔥 {streak}</p>
            <p className="text-white/60 text-xs">Streak</p>
          </div>
        </div>
      </div>


      {/* Check-in Method */}
      <div className="mb-6 animate-slideUp stagger-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <p className="text-white/70 text-sm font-semibold mb-3 flex items-center gap-2">
          <span>📝</span> Check-in Method
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCheckInMethod('swipe')}
            className={`p-4 rounded-2xl border-2 transition-all btn-press ${
              checkInMethod === 'swipe'
                ? 'border-cyan-400 bg-cyan-500/20'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="text-3xl mb-2 block">👆</span>
            <span className="text-white font-bold">Swipe</span>
            <p className="text-white/50 text-xs mt-1">Slide to track progress</p>
          </button>
          <button
            onClick={() => setCheckInMethod('tap')}
            className={`p-4 rounded-2xl border-2 transition-all btn-press ${
              checkInMethod === 'tap'
                ? 'border-cyan-400 bg-cyan-500/20'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="text-3xl mb-2 block">✅</span>
            <span className="text-white font-bold">Tap</span>
            <p className="text-white/50 text-xs mt-1">Quick complete</p>
          </button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="mb-6 animate-slideUp stagger-2" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <p className="text-white/70 text-sm font-semibold mb-3 flex items-center gap-2">
          <span>🎨</span> Theme
        </p>
        <div className="grid grid-cols-5 gap-2">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`aspect-square rounded-xl overflow-hidden transition-all btn-press ${
                currentTheme.id === theme.id
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ background: theme.gradient }}
              title={theme.name}
            >
              <span className="flex items-center justify-center h-full text-xl">
                {theme.emoji}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Background */}
      <div className="mb-6 animate-slideUp stagger-3" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <p className="text-white/70 text-sm font-semibold mb-3 flex items-center gap-2">
          <span>🖼️</span> Custom Background
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-all border border-white/10 btn-press"
          >
            {customBackground ? '📷 Change Photo' : '📁 Upload Photo'}
          </button>
          {customBackground && (
            <button
              onClick={() => setCustomBackground(null)}
              className="py-3 px-4 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 transition-all btn-press"
            >
              ✕
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {customBackground && (
          <div className="mt-3 h-24 rounded-xl overflow-hidden">
            <img src={customBackground} alt="Custom bg" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Sound & Haptics */}
      <div className="space-y-3 mb-6 animate-slideUp stagger-4" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <p className="text-white/70 text-sm font-semibold flex items-center gap-2">
          <span>🔊</span> Effects
        </p>
        
        <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔊</span>
            <div>
              <span className="text-white font-medium">Sound Effects</span>
              <p className="text-white/50 text-xs">Play sounds on actions</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-14 h-8 rounded-full transition-all ${soundEnabled ? 'bg-green-500' : 'bg-white/20'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📳</span>
            <div>
              <span className="text-white font-medium">Vibration</span>
              <p className="text-white/50 text-xs">Haptic feedback</p>
            </div>
          </div>
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`w-14 h-8 rounded-full transition-all ${hapticEnabled ? 'bg-green-500' : 'bg-white/20'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${hapticEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center pt-4 border-t border-white/10 animate-slideUp stagger-5" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <p className="text-white/40 text-xs mb-2">
          Daily Tasks v1.0
        </p>
        <p className="text-white/30 text-xs">
          Built with ❤️ on Base
        </p>
      </div>
    </div>
  );
}
