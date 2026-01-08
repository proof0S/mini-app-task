'use client';

import { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    emoji: '✨',
    title: 'Welcome to Daily Tasks',
    description: 'Build better habits, one day at a time',
  },
  {
    emoji: '📊',
    title: 'Track Your Progress',
    description: 'Swipe or tap to complete tasks and watch your streak grow',
  },
  {
    emoji: '🏆',
    title: 'Compete & Win',
    description: 'Join the leaderboard and challenge your friends',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #0099FF 25%, #00BFFF 50%, #6B5BFF 75%, #00D4FF 100%)'
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Slide Content */}
        <div className="text-center mb-8 transition-all duration-500">
          <div className="text-8xl mb-6 animate-bounce">
            {slides[currentSlide].emoji}
          </div>
          <h1 className="text-3xl font-black text-white mb-3 drop-shadow-lg">
            {slides[currentSlide].title}
          </h1>
          <p className="text-white/80 text-lg">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          {currentSlide === slides.length - 1 ? "Let's Go! 🚀" : 'Next'}
        </button>

        {/* Skip */}
        <button
          onClick={onComplete}
          className="w-full mt-3 py-2 text-white/60 hover:text-white text-sm transition-all"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}
