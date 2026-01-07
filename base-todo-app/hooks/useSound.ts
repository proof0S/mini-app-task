'use client';

import { useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function useSound() {
  const { soundEnabled, hapticEnabled } = useTheme();

  // Ses çalma fonksiyonu
  const playSound = useCallback((type: 'slide' | 'complete' | 'click' | 'success') => {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'slide':
        oscillator.frequency.value = 300 + Math.random() * 200;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      
      case 'click':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.08);
        break;

      case 'complete':
        const playNote = (freq: number, delay: number, duration: number) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.value = 0.2;
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
          osc.start(audioContext.currentTime + delay);
          osc.stop(audioContext.currentTime + delay + duration);
        };
        playNote(523, 0, 0.15);
        playNote(659, 0.12, 0.15);
        playNote(784, 0.24, 0.2);
        return;

      case 'success':
        const playFanfare = (freq: number, delay: number) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = freq;
          osc.type = 'triangle';
          gain.gain.value = 0.25;
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.3);
          osc.start(audioContext.currentTime + delay);
          osc.stop(audioContext.currentTime + delay + 0.3);
        };
        playFanfare(523, 0);
        playFanfare(659, 0.1);
        playFanfare(784, 0.2);
        playFanfare(1047, 0.35);
        return;
    }
  }, [soundEnabled]);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!hapticEnabled) return;
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [hapticEnabled]);

  return { playSound, vibrate };
}
