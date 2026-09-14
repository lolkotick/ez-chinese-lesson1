import React from 'react';
import { 
  Compass, 
  Layers, 
  Zap, 
  HelpCircle, 
  Music, 
  Trophy, 
  BookOpen 
} from 'lucide-react';
import { AppMode } from '../types';

interface NavigationProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, onSelectMode }) => {
  const navItems: { id: AppMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'План 2 часа', icon: <Compass className="w-4 h-4" /> },
    { id: 'flashcards', label: 'Карточки', icon: <Layers className="w-4 h-4" /> },
    { id: 'speedmatch', label: 'Спид-пары', icon: <Zap className="w-4 h-4" />, badge: 'Топ' },
    { id: 'quiz', label: 'Тест', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'tones', label: 'Тоны', icon: <Music className="w-4 h-4" /> },
    { id: 'exam', label: 'Зачёт', icon: <Trophy className="w-4 h-4" />, badge: '100%' },
    { id: 'dictionary', label: 'Словарь', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 sticky top-[61px] z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                  isActive ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
