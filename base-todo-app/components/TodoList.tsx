'use client';

import { useState } from 'react';
import { Todo, categories } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  checkInMethod: 'swipe' | 'tap';
  onToggle: (id: number) => void;
  onUpdate: (id: number, current: number) => void;
  onDelete: (id: number) => void;
  onComplete: (emoji: string) => void;
  accentColor: string;
  playSound: (type: 'slide' | 'complete' | 'tap' | 'success' | 'pop') => void;
  vibrate: (pattern: number | number[]) => void;
  filterCategory: 'all' | keyof typeof categories;
}

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

export default function TodoList({
  todos,
  checkInMethod,
  onToggle,
  onUpdate,
  onDelete,
  onComplete,
  accentColor,
  playSound,
  vibrate,
  filterCategory,
}: TodoListProps) {
  const [showCompleted, setShowCompleted] = useState(true);
  
  // Filtreleme
  const filteredTodos = filterCategory === 'all' 
    ? todos 
    : todos.filter(t => t.category === filterCategory);
  
  // Ayırma
  const pendingTodos = filteredTodos.filter(t => !t.completed);
  const completedTodos = filteredTodos.filter(t => t.completed);

  return (
    <div className="space-y-4">
      {/* Yapılacaklar */}
      {pendingTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/60 text-sm font-medium">📋 To Do</span>
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-white/60 text-xs">
              {pendingTodos.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTodos.map((todo, index) => (
              checkInMethod === 'swipe' ? (
                <SliderTodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onComplete={() => onComplete(todo.emoji)}
                  accentColor={accentColor}
                  playSound={playSound}
                  vibrate={vibrate}
                  index={index}
                />
              ) : (
                <TapTodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  accentColor={accentColor}
                  playSound={playSound}
                  vibrate={vibrate}
                  index={index}
                />
              )
            ))}
          </div>
        </div>
      )}

      {/* Tamamlananlar */}
      {completedTodos.length > 0 && (
        <div>
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 mb-3 group"
          >
            <span className="text-green-400/80 text-sm font-medium">✅ Completed</span>
            <span className="px-2 py-0.5 bg-green-500/20 rounded-full text-green-400 text-xs">
              {completedTodos.length}
            </span>
            <svg 
              className={`w-4 h-4 text-white/40 transition-transform ${showCompleted ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showCompleted && (
            <div className="space-y-2">
              {completedTodos.map((todo, index) => (
                <CompletedTodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  index={index}
                  playSound={playSound}
                  vibrate={vibrate}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Boş durum */}
      {pendingTodos.length === 0 && completedTodos.length === 0 && (
        <div className="text-center py-12">
          <span className="text-5xl block mb-3">📝</span>
          <p className="text-white font-semibold mb-1">No tasks yet</p>
          <p className="text-white/60 text-sm">Add your first task to get started!</p>
        </div>
      )}

      {/* Hepsi tamamlandı */}
      {pendingTodos.length === 0 && completedTodos.length > 0 && (
        <div className="text-center py-8 bg-green-500/10 rounded-2xl border border-green-500/20">
          <span className="text-5xl block mb-3">🎉</span>
          <p className="text-white font-bold mb-1">All done for today!</p>
          <p className="text-white/60 text-sm">Amazing work! Enjoy your day.</p>
        </div>
      )}
    </div>
  );
}

// Slider Todo Item
import { useRef, useState as useStateRef } from 'react';

function SliderTodoItem({ todo, onUpdate, onDelete, onComplete, accentColor, playSound, vibrate, index }: { 
  todo: Todo; 
  onUpdate: (id: number, current: number) => void;
  onDelete: (id: number) => void;
  onComplete: () => void;
  accentColor: string;
  playSound: (type: any) => void;
  vibrate: (pattern: number | number[]) => void;
  index: number;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useStateRef(false);
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
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 animate-slideUp card-hover bg-white/15 border border-white/20 backdrop-blur-xl stagger-${Math.min(index + 1, 5)}`}
      style={{ opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={todo.category} />
          {todo.isRecurring && <span className="text-[10px] text-white/50">🔄 Daily</span>}
        </div>
        <div className="flex items-center mb-3">
          <span className="text-xl mr-2">{todo.emoji}</span>
          <span className="flex-1 font-semibold text-white">{todo.text}</span>
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
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)`
            }}
          />
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform ${
              isDragging ? 'scale-125 shadow-xl' : 'scale-100'
            }`}
            style={{ left: `clamp(4px, calc(${percentage}% - 20px), calc(100% - 44px))` }}
          >
            <span className="text-2xl">{todo.emoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tap Todo Item
function TapTodoItem({ todo, onToggle, onDelete, accentColor, playSound, vibrate, index }: { 
  todo: Todo; 
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  accentColor: string;
  playSound: (type: any) => void;
  vibrate: (pattern: number | number[]) => void;
  index: number;
}) {
  const handleToggle = () => {
    playSound('tap');
    vibrate(10);
    setTimeout(() => {
      playSound('complete');
      vibrate([50, 30, 50]);
    }, 100);
    onToggle(todo.id);
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 animate-slideUp card-hover bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-xl stagger-${Math.min(index + 1, 5)}`}
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
            className="relative w-7 h-7 rounded-full border-2 border-white/50 hover:border-white hover:scale-105 bg-white/10 flex items-center justify-center transition-all duration-300 btn-press"
          >
          </button>

          <span className="ml-3 text-xl">{todo.emoji}</span>
          <span className="ml-3 flex-1 font-semibold text-white">{todo.text}</span>

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
}

// Tamamlanmış Görev (küçük görünüm)
function CompletedTodoItem({ todo, onToggle, onDelete, index, playSound, vibrate }: { 
  todo: Todo; 
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  index: number;
  playSound: (type: any) => void;
  vibrate: (pattern: number | number[]) => void;
}) {
  const handleUndo = () => {
    playSound('pop');
    vibrate(10);
    onToggle(todo.id);
  };

  return (
    <div 
      className={`group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 transition-all animate-slideUp stagger-${Math.min(index + 1, 5)}`}
      style={{ opacity: 0, animationFillMode: 'forwards' }}
    >
      <button
        onClick={handleUndo}
        className="w-6 h-6 rounded-full bg-green-500/30 border border-green-500/50 flex items-center justify-center transition-all hover:bg-green-500/50"
      >
        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </button>
      
      <span className="text-lg">{todo.emoji}</span>
      <span className="flex-1 text-white/50 line-through text-sm">{todo.text}</span>
      
      {todo.target && (
        <span className="text-white/40 text-xs">
          {todo.current}/{todo.target} {todo.unit}
        </span>
      )}
      
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-white/40 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
