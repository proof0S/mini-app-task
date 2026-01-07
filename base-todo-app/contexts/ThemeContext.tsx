'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  cardBg: string;
  accentColor: string;
  category: 'neutral' | 'feminine' | 'masculine' | 'nature' | 'dark';
}

export const themes: Theme[] = [
  // Neutral
  {
    id: 'ocean',
    name: 'Ocean Blue',
    emoji: '🌊',
    gradient: 'linear-gradient(135deg, #0066CC 0%, #0099FF 25%, #00BFFF 50%, #6B5BFF 75%, #00D4FF 100%)',
    cardBg: 'rgba(255,255,255,0.15)',
    accentColor: '#00D4FF',
    category: 'neutral',
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    emoji: '🌅',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 25%, #FFA07A 50%, #FFB347 75%, #FFCC33 100%)',
    cardBg: 'rgba(255,255,255,0.2)',
    accentColor: '#FF6B6B',
    category: 'neutral',
  },
  // Feminine
  {
    id: 'rose',
    name: 'Rose Garden',
    emoji: '🌸',
    gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 25%, #FF1493 50%, #DB7093 75%, #FFC0CB 100%)',
    cardBg: 'rgba(255,255,255,0.25)',
    accentColor: '#FF69B4',
    category: 'feminine',
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    emoji: '💜',
    gradient: 'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 25%, #DA70D6 50%, #BA55D3 75%, #9932CC 100%)',
    cardBg: 'rgba(255,255,255,0.2)',
    accentColor: '#BA55D3',
    category: 'feminine',
  },
  {
    id: 'peach',
    name: 'Peach Blossom',
    emoji: '🍑',
    gradient: 'linear-gradient(135deg, #FFDAB9 0%, #FFCBA4 25%, #FFB07C 50%, #FFA07A 75%, #FF8C69 100%)',
    cardBg: 'rgba(255,255,255,0.25)',
    accentColor: '#FF8C69',
    category: 'feminine',
  },
  // Masculine
  {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌙',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #0d0d1a 100%)',
    cardBg: 'rgba(255,255,255,0.1)',
    accentColor: '#4ECDC4',
    category: 'masculine',
  },
  {
    id: 'forest',
    name: 'Dark Forest',
    emoji: '🌲',
    gradient: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 25%, #40916C 50%, #52B788 75%, #74C69D 100%)',
    cardBg: 'rgba(255,255,255,0.12)',
    accentColor: '#74C69D',
    category: 'masculine',
  },
  {
    id: 'steel',
    name: 'Steel Gray',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #2C3E50 0%, #3D5A73 25%, #4A6FA5 50%, #5B8AC2 75%, #6CA6CD 100%)',
    cardBg: 'rgba(255,255,255,0.1)',
    accentColor: '#6CA6CD',
    category: 'masculine',
  },
  // Nature
  {
    id: 'aurora',
    name: 'Aurora',
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 25%, #00C9FF 50%, #92FE9D 75%, #00C9FF 100%)',
    cardBg: 'rgba(255,255,255,0.2)',
    accentColor: '#00C9FF',
    category: 'nature',
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    emoji: '🌺',
    gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FFB7C5 25%, #FF69B4 50%, #FFB6C1 75%, #FFF0F5 100%)',
    cardBg: 'rgba(255,255,255,0.25)',
    accentColor: '#FF69B4',
    category: 'nature',
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  customBackground: string | null;
  setCustomBackground: (url: string | null) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('app_theme');
    const savedBg = localStorage.getItem('app_custom_bg');
    const savedSound = localStorage.getItem('app_sound');
    const savedHaptic = localStorage.getItem('app_haptic');

    if (savedThemeId) {
      const theme = themes.find(t => t.id === savedThemeId);
      if (theme) setCurrentTheme(theme);
    }
    if (savedBg) setCustomBackground(savedBg);
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    if (savedHaptic !== null) setHapticEnabled(savedHaptic === 'true');
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('app_theme', themeId);
    }
  };

  const handleSetCustomBackground = (url: string | null) => {
    setCustomBackground(url);
    if (url) {
      localStorage.setItem('app_custom_bg', url);
    } else {
      localStorage.removeItem('app_custom_bg');
    }
  };

  const handleSetSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('app_sound', enabled.toString());
  };

  const handleSetHapticEnabled = (enabled: boolean) => {
    setHapticEnabled(enabled);
    localStorage.setItem('app_haptic', enabled.toString());
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      customBackground,
      setCustomBackground: handleSetCustomBackground,
      soundEnabled,
      setSoundEnabled: handleSetSoundEnabled,
      hapticEnabled,
      setHapticEnabled: handleSetHapticEnabled,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
