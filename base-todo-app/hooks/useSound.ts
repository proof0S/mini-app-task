'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type SoundType = 
  | 'tap'           // Hafif tıklama
  | 'complete'      // Görev tamamlama
  | 'success'       // Büyük başarı
  | 'slide'         // Slider kaydırma
  | 'pop'           // Bubble pop
  | 'coin'          // Puan kazanma
  | 'levelUp'       // Seviye atlama
  | 'streak'        // Streak bildirimi
  | 'notification'  // Bildirim
  | 'error'         // Hata
  | 'whoosh'        // Geçiş sesi
  | 'click';        // Buton tıklama

interface OscillatorNote {
  freq: number;
  duration: number;
  delay?: number;
  type?: OscillatorType;
  gain?: number;
}

export function useSound() {
  const { soundEnabled, hapticEnabled } = useTheme();
  const audioContextRef = useRef<AudioContext | null>(null);

  // AudioContext'i lazy initialize et
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Tek nota çal
  const playNote = useCallback((
    freq: number, 
    duration: number, 
    type: OscillatorType = 'sine',
    gainValue: number = 0.3,
    delay: number = 0
  ) => {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime + delay;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = type;
    
    // Smooth envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, [getAudioContext]);

  // Melodi çal
  const playMelody = useCallback((notes: OscillatorNote[]) => {
    notes.forEach(note => {
      playNote(
        note.freq, 
        note.duration, 
        note.type || 'sine', 
        note.gain || 0.3, 
        note.delay || 0
      );
    });
  }, [playNote]);

  // Noise generator (whoosh, slide efektleri için)
  const playNoise = useCallback((duration: number, filterFreq: number = 1000) => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    noise.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    noise.start();
    noise.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  // Ana ses çalma fonksiyonu
  const playSound = useCallback((type: SoundType) => {
    if (!soundEnabled) return;

    try {
      switch (type) {
        case 'tap':
          // Hafif, tatlı tıklama - yüksek frekanslı kısa ses
          playMelody([
            { freq: 800, duration: 0.05, type: 'sine', gain: 0.2 },
            { freq: 1200, duration: 0.03, type: 'sine', gain: 0.1, delay: 0.02 }
          ]);
          break;

        case 'click':
          // Buton tıklama - orta ton
          playMelody([
            { freq: 600, duration: 0.06, type: 'triangle', gain: 0.25 },
            { freq: 900, duration: 0.04, type: 'sine', gain: 0.15, delay: 0.03 }
          ]);
          break;

        case 'pop':
          // Bubble pop - eğlenceli
          playMelody([
            { freq: 400, duration: 0.08, type: 'sine', gain: 0.3 },
            { freq: 800, duration: 0.06, type: 'sine', gain: 0.2, delay: 0.02 },
            { freq: 1000, duration: 0.04, type: 'triangle', gain: 0.1, delay: 0.04 }
          ]);
          break;

        case 'slide':
          // Slider kaydırma - yumuşak geçiş
          playMelody([
            { freq: 300 + Math.random() * 200, duration: 0.04, type: 'sine', gain: 0.15 }
          ]);
          break;

        case 'complete':
          // Görev tamamlama - mutlu melodi (C-E-G arpej)
          playMelody([
            { freq: 523.25, duration: 0.12, type: 'triangle', gain: 0.3 },        // C5
            { freq: 659.25, duration: 0.12, type: 'triangle', gain: 0.3, delay: 0.1 }, // E5
            { freq: 783.99, duration: 0.2, type: 'triangle', gain: 0.35, delay: 0.2 }  // G5
          ]);
          break;

        case 'success':
          // Büyük başarı - fanfar melodisi
          playMelody([
            { freq: 523.25, duration: 0.1, type: 'square', gain: 0.2 },    // C5
            { freq: 659.25, duration: 0.1, type: 'square', gain: 0.2, delay: 0.08 }, // E5
            { freq: 783.99, duration: 0.1, type: 'square', gain: 0.2, delay: 0.16 }, // G5
            { freq: 1046.50, duration: 0.3, type: 'square', gain: 0.25, delay: 0.24 }, // C6
            { freq: 783.99, duration: 0.15, type: 'triangle', gain: 0.2, delay: 0.24 }, // G5 harmony
            { freq: 1046.50, duration: 0.4, type: 'sine', gain: 0.15, delay: 0.4 }  // C6 sustain
          ]);
          break;

        case 'coin':
          // Mario tarzı coin sesi
          playMelody([
            { freq: 987.77, duration: 0.08, type: 'square', gain: 0.25 },  // B5
            { freq: 1318.51, duration: 0.3, type: 'square', gain: 0.2, delay: 0.08 } // E6
          ]);
          break;

        case 'levelUp':
          // Seviye atlama - yükselen arpej
          playMelody([
            { freq: 261.63, duration: 0.08, type: 'square', gain: 0.2 },   // C4
            { freq: 329.63, duration: 0.08, type: 'square', gain: 0.2, delay: 0.06 }, // E4
            { freq: 392.00, duration: 0.08, type: 'square', gain: 0.2, delay: 0.12 }, // G4
            { freq: 523.25, duration: 0.08, type: 'square', gain: 0.2, delay: 0.18 }, // C5
            { freq: 659.25, duration: 0.08, type: 'square', gain: 0.2, delay: 0.24 }, // E5
            { freq: 783.99, duration: 0.08, type: 'square', gain: 0.2, delay: 0.30 }, // G5
            { freq: 1046.50, duration: 0.25, type: 'square', gain: 0.25, delay: 0.36 } // C6
          ]);
          break;

        case 'streak':
          // Streak - ateşli ses
          playMelody([
            { freq: 440, duration: 0.1, type: 'sawtooth', gain: 0.15 },    // A4
            { freq: 554.37, duration: 0.1, type: 'sawtooth', gain: 0.15, delay: 0.08 }, // C#5
            { freq: 659.25, duration: 0.15, type: 'sawtooth', gain: 0.2, delay: 0.16 }, // E5
            { freq: 880, duration: 0.25, type: 'triangle', gain: 0.25, delay: 0.24 }    // A5
          ]);
          break;

        case 'notification':
          // Bildirim - dikkat çekici ama nazik
          playMelody([
            { freq: 880, duration: 0.1, type: 'sine', gain: 0.25 },    // A5
            { freq: 1108.73, duration: 0.1, type: 'sine', gain: 0.2, delay: 0.12 }, // C#6
            { freq: 880, duration: 0.15, type: 'sine', gain: 0.15, delay: 0.24 }    // A5
          ]);
          break;

        case 'error':
          // Hata - düşük ton, uyarı
          playMelody([
            { freq: 200, duration: 0.15, type: 'square', gain: 0.2 },
            { freq: 150, duration: 0.2, type: 'square', gain: 0.25, delay: 0.12 }
          ]);
          break;

        case 'whoosh':
          // Geçiş sesi - hava efekti
          playNoise(0.15, 2000);
          playMelody([
            { freq: 400, duration: 0.1, type: 'sine', gain: 0.1 },
            { freq: 600, duration: 0.08, type: 'sine', gain: 0.08, delay: 0.03 }
          ]);
          break;
      }
    } catch (error) {
      console.error('Sound error:', error);
    }
  }, [soundEnabled, playMelody, playNoise]);

  // Titreşim fonksiyonu
  const vibrate = useCallback((pattern: number | number[]) => {
    if (!hapticEnabled) return;
    
    try {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (error) {
      console.error('Vibration error:', error);
    }
  }, [hapticEnabled]);

  // Ses + titreşim kombinasyonları
  const feedback = useCallback((type: SoundType, vibratePattern?: number | number[]) => {
    playSound(type);
    if (vibratePattern) {
      vibrate(vibratePattern);
    }
  }, [playSound, vibrate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { 
    playSound, 
    vibrate, 
    feedback,
    // Hazır kombinasyonlar
    tapFeedback: () => feedback('tap', 5),
    clickFeedback: () => feedback('click', 10),
    completeFeedback: () => feedback('complete', [50, 30, 50]),
    successFeedback: () => feedback('success', [50, 30, 50, 30, 100]),
    coinFeedback: () => feedback('coin', [30, 20, 30]),
    errorFeedback: () => feedback('error', [100, 50, 100]),
  };
}
