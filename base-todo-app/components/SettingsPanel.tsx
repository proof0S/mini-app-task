'use client';

import { useSettings } from '../contexts/SettingsContext';
import { useTheme, themes } from '../contexts/ThemeContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { checkInMethod, setCheckInMethod } = useSettings();
  const { currentTheme, setTheme, customBackground, setCustomBackground, soundEnabled, setSoundEnabled, hapticEnabled, setHapticEnabled } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-3xl p-5 w-full max-w-[380px] max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10 animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all btn-press"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Check-in Method */}
        <div className="mb-6">
          <p className="text-white/70 text-sm font-medium mb-3">📝 Check-in Method</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setCheckInMethod('swipe')}
              className={`p-4 rounded-xl border-2 transition-all btn-press ${
                checkInMethod === 'swipe'
                  ? 'border-cyan-400 bg-cyan-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl mb-2 block">👆</span>
              <span className="text-white text-sm font-medium">Swipe</span>
              <p className="text-white/50 text-xs mt-1">Slide to track</p>
            </button>
            <button
              onClick={() => setCheckInMethod('tap')}
              className={`p-4 rounded-xl border-2 transition-all btn-press ${
                checkInMethod === 'tap'
                  ? 'border-cyan-400 bg-cyan-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl mb-2 block">✅</span>
              <span className="text-white text-sm font-medium">Tap</span>
              <p className="text-white/50 text-xs mt-1">Quick complete</p>
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="mb-6">
          <p className="text-white/70 text-sm font-medium mb-3">🎨 Theme</p>
          <div className="grid grid-cols-5 gap-2">
            {themes.slice(0, 10).map(theme => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`aspect-square rounded-xl overflow-hidden transition-all btn-press ${
                  currentTheme.id === theme.id
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105'
                    : 'hover:scale-105'
                }`}
                style={{ background: theme.gradient }}
                title={theme.name}
              >
                <span className="flex items-center justify-center h-full text-lg">
                  {theme.emoji}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sound & Haptics */}
        <div className="space-y-3 mb-6">
          <p className="text-white/70 text-sm font-medium">🔊 Effects</p>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔊</span>
              <span className="text-white text-sm">Sound Effects</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-7 rounded-full transition-all ${soundEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xl">📳</span>
              <span className="text-white text-sm">Vibration</span>
            </div>
            <button
              onClick={() => setHapticEnabled(!hapticEnabled)}
              className={`w-12 h-7 rounded-full transition-all ${hapticEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${hapticEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Daily Tasks v1.0 • Built with ❤️ on Base
          </p>
        </div>
      </div>
    </div>
  );
}
