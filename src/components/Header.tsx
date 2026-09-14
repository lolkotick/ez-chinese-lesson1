import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Settings, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Palette, 
  CheckCircle2, 
  Sparkles,
  Clock
} from 'lucide-react';
import { AppSettings, UserStats } from '../types';
import { WORDS, CHUNKS } from '../data/words';
import { MasteryLevel } from '../types';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  progress: Record<number, { level: MasteryLevel; mistakesCount: number }>;
  stats: UserStats;
  onReset: () => void;
  onOpenSprintModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  progress,
  stats,
  onReset,
  onOpenSprintModal,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Timer counter
  useEffect(() => {
    const updateTimer = () => {
      const minutes = Math.floor(stats.timeSpentSeconds / 60);
      setElapsedMinutes(minutes);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 5000);
    return () => clearInterval(interval);
  }, [stats.timeSpentSeconds]);

  // Calculate mastery stats
  const totalWords = WORDS.length;
  let masteredCount = 0;
  let reviewingCount = 0;
  let learningCount = 0;

  WORDS.forEach(w => {
    const p = progress[w.id];
    if (!p) return;
    if (p.level === 3) masteredCount++;
    else if (p.level === 2) reviewingCount++;
    else if (p.level === 1) learningCount++;
  });

  const percentMastered = Math.round((masteredCount / totalWords) * 100);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center font-bold text-xl shadow-md shadow-rose-900/30">
                <span>汉</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-slate-100 tracking-tight">
                    EZ Chinese <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono border border-rose-500/30">2 часа</span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400">第一课 建立联系 • 57 слов и имён</p>
              </div>
            </div>

            {/* Mobile Settings Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                title="Настройки"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Chunk Filter */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 text-xs no-scrollbar">
            <button
              onClick={() => onUpdateSettings({ ...settings, selectedChunk: 0 })}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                settings.selectedChunk === 0 
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Все (57)
            </button>
            {CHUNKS.map(c => (
              <button
                key={c.id}
                onClick={() => onUpdateSettings({ ...settings, selectedChunk: c.id })}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                  settings.selectedChunk === c.id 
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30' 
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {c.id === 6 ? 'Имена' : `Блок ${c.id}`}
              </button>
            ))}
          </div>

          {/* Progress & Controls */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* 2-Hour Timer Indicator (Clickable button) */}
            <button
              onClick={onOpenSprintModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-xs transition-all cursor-pointer group"
              title="Нажмите, чтобы посмотреть статус 2-часового спринта"
            >
              <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div className="font-mono">
                <span className="text-amber-400 font-semibold">{elapsedMinutes}</span>
                <span className="text-slate-400"> / 120 мин</span>
              </div>
            </button>

            {/* Overall Mastery Meter */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-200">
                  {masteredCount} / {totalWords} слов
                </div>
                <div className="text-[10px] text-slate-400">
                  {percentMastered}% усвоено
                </div>
              </div>
              <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${(masteredCount / totalWords) * 100}%` }} 
                  title={`Выучено: ${masteredCount}`}
                />
                <div 
                  className="bg-sky-500 h-full transition-all duration-500" 
                  style={{ width: `${(reviewingCount / totalWords) * 100}%` }} 
                  title={`Закреплено: ${reviewingCount}`}
                />
                <div 
                  className="bg-amber-500 h-full transition-all duration-500" 
                  style={{ width: `${(learningCount / totalWords) * 100}%` }} 
                  title={`В процессе: ${learningCount}`}
                />
              </div>
            </div>

            {/* Settings button */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg border transition-all ${
                  showSettings 
                    ? 'bg-rose-600 text-white border-rose-500' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
                title="Настройки обучения"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-rose-400" /> Настройки
                    </span>
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-slate-200 text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Hide Pinyin */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-2">
                        {settings.pinyinHidden ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                        Скрывать пиньинь
                      </span>
                      <button
                        onClick={() => onUpdateSettings({ ...settings, pinyinHidden: !settings.pinyinHidden })}
                        className={`w-9 h-5 rounded-full transition-colors relative ${settings.pinyinHidden ? 'bg-amber-500' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.pinyinHidden ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {/* Color Tones */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-rose-400" />
                        Цвета тонов
                      </span>
                      <button
                        onClick={() => onUpdateSettings({ ...settings, colorTones: !settings.colorTones })}
                        className={`w-9 h-5 rounded-full transition-colors relative ${settings.colorTones ? 'bg-rose-500' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.colorTones ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {/* Auto Audio */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                        Авто-озвучка
                      </span>
                      <button
                        onClick={() => onUpdateSettings({ ...settings, autoAudio: !settings.autoAudio })}
                        className={`w-9 h-5 rounded-full transition-colors relative ${settings.autoAudio ? 'bg-sky-500' : 'bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.autoAudio ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {/* Speech Speed */}
                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Скорость речи:</span>
                        <span className="font-mono text-rose-400">{settings.audioRate}x</span>
                      </div>
                      <div className="flex gap-1.5">
                        {[0.75, 0.85, 1.0].map(rate => (
                          <button
                            key={rate}
                            onClick={() => onUpdateSettings({ ...settings, audioRate: rate })}
                            className={`flex-1 py-1 rounded text-center transition-all ${
                              settings.audioRate === rate 
                                ? 'bg-rose-600 text-white font-bold' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reset Progress */}
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          if (window.confirm('Сбросить весь прогресс и начать заново?')) {
                            onReset();
                            setShowSettings(false);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Сбросить прогресс
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
