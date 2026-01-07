'use client';

import { useRef } from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemePickerModal({ isOpen, onClose }: Props) {
  const { currentTheme, setTheme, customBackground, setCustomBackground, soundEnabled, setSoundEnabled, hapticEnabled, setHapticEnabled } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

  const categories = [
    { id: 'neutral', name: '🌈 Universal' },
    { id: 'feminine', name: '💖 Soft & Sweet' },
    { id: 'masculine', name: '🔥 Bold & Dark' },
    { id: 'nature', name: '🌿 Nature' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl p-5 w-full max-w-[380px] max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">✨ Customize</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Custom Background */}
        <div className="mb-5">
          <p className="text-white/70 text-sm font-medium mb-2">📷 Custom Background</p>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-all border border-white/10"
            >
              {customBackground ? '🖼️ Change Photo' : '📁 Upload Photo'}
            </button>
            {customBackground && (
              <button
                onClick={() => setCustomBackground(null)}
                className="py-3 px-4 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-all"
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
            <div className="mt-2 h-20 rounded-xl overflow-hidden">
              <img src={customBackground} alt="Custom bg" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Themes */}
        <div className="mb-5">
          <p className="text-white/70 text-sm font-medium mb-3">🎨 Themes</p>
          
          {categories.map(cat => (
            <div key={cat.id} className="mb-3">
              <p className="text-white/50 text-xs mb-2">{cat.name}</p>
              <div className="grid grid-cols-5 gap-2">
                {themes.filter(t => t.category === cat.id).map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all ${
                      currentTheme.id === theme.id 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105' 
                        : 'hover:scale-105'
                    }`}
                    style={{ background: theme.gradient }}
                    title={theme.name}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-lg">
                      {theme.emoji}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sound & Haptic */}
        <div className="space-y-3">
          <p className="text-white/70 text-sm font-medium">⚙️ Effects</p>
          
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔊</span>
              <span className="text-white text-sm">Sound Effects</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-7 rounded-full transition-all ${
                soundEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Haptic Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xl">📳</span>
              <span className="text-white text-sm">Vibration</span>
            </div>
            <button
              onClick={() => setHapticEnabled(!hapticEnabled)}
              className={`w-12 h-7 rounded-full transition-all ${
                hapticEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                hapticEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full mt-5 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all"
        >
          Done ✓
        </button>
      </div>
    </div>
  );
}
