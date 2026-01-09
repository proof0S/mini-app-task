export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  emoji: string;
  target?: number;
  current?: number;
  unit?: string;
  category: 'health' | 'work' | 'personal' | 'fitness' | 'learning';
  isRecurring: boolean;
  createdAt: string;
}

export const categories = {
  health: { name: 'Health', emoji: '💚', color: 'green' },
  work: { name: 'Work', emoji: '💼', color: 'blue' },
  personal: { name: 'Personal', emoji: '✨', color: 'purple' },
  fitness: { name: 'Fitness', emoji: '💪', color: 'orange' },
  learning: { name: 'Learning', emoji: '📚', color: 'cyan' },
};

export const defaultTodos: Todo[] = [
  { id: 1, text: "Morning workout", completed: false, emoji: "🏃", target: 30, current: 0, unit: "min", category: 'fitness', isRecurring: true, createdAt: new Date().toISOString() },
  { id: 2, text: "Drink water", completed: false, emoji: "💧", target: 8, current: 0, unit: "glasses", category: 'health', isRecurring: true, createdAt: new Date().toISOString() },
  { id: 3, text: "Read book", completed: false, emoji: "📚", target: 30, current: 0, unit: "pages", category: 'learning', isRecurring: true, createdAt: new Date().toISOString() },
];
