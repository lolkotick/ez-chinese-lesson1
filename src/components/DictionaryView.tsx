import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check, 
  Info,
  Filter
} from 'lucide-react';
import { WordItem, AppSettings, MasteryLevel, WordProgress } from '../types';
import { WORDS, CHUNKS } from '../data/words';
import { playChineseAudio } from '../utils/speech';
import { getCharToneColor } from '../utils/tones';

interface DictionaryViewProps {
  settings: AppSettings;
  progress: Record<number, WordProgress>;
  onSetLevel: (wordId: number, level: MasteryLevel) => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  settings,
  progress,
  onSetLevel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChunkFilter, setSelectedChunkFilter] = useState<number>(0);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [expandedWordId, setExpandedWordId] = useState<number | null>(null);

  const filteredWords = useMemo(() => {
    return WORDS.filter(w => {
      // Chunk filter
      if (selectedChunkFilter > 0 && w.chunk !== selectedChunkFilter) return false;

      // Level filter
      const p = progress[w.id];
      const lvl = p?.level ?? 0;
      if (selectedLevelFilter === 'mastered' && lvl !== 3) return false;
      if (selectedLevelFilter === 'learning' && (lvl === 0 || lvl === 3)) return false;
      if (selectedLevelFilter === 'new' && lvl !== 0) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        w.hanzi.includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.ru.toLowerCase().includes(q) ||
        w.en.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedChunkFilter, selectedLevelFilter, progress]);

  const toggleExpand = (id: number) => {
    setExpandedWordId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по иероглифам, пиньиню или русскому переводу..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                Очистить
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'Все' },
              { id: 'mastered', label: '🏆 Выучено' },
              { id: 'learning', label: '🟡 В процессе' },
              { id: 'new', label: '🔴 Новые' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedLevelFilter(f.id)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all font-medium ${
                  selectedLevelFilter === f.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chunk buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 border-t border-slate-800/80 no-scrollbar">
          <button
            onClick={() => setSelectedChunkFilter(0)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedChunkFilter === 0 ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Все блоки (57)
          </button>
          {CHUNKS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedChunkFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedChunkFilter === c.id ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Words Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>Найдено: <strong className="text-slate-200">{filteredWords.length}</strong> слов</span>
        <span>Нажмите на строку слова, чтобы увидеть морфемный разбор</span>
      </div>

      {/* List of Words */}
      <div className="space-y-2">
        {filteredWords.map((word) => {
          const p = progress[word.id];
          const level = p?.level ?? 0;
          const isExpanded = expandedWordId === word.id;

          return (
            <div
              key={word.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded 
                  ? 'bg-slate-900 border-rose-500/40 shadow-lg' 
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header row */}
              <div 
                onClick={() => toggleExpand(word.id)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                  <span className="font-mono text-xs text-slate-500 w-6 flex-shrink-0">
                    #{word.id}
                  </span>

                  <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap min-w-0">
                    <span className="text-xl sm:text-2xl font-bold font-chinese tracking-wide text-slate-100 flex-shrink-0">
                      {word.hanzi}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-rose-400 font-medium flex-shrink-0">
                      [{word.pinyin}]
                    </span>
                    <span className="text-xs sm:text-sm text-slate-300 truncate">
                      {word.ru}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playChineseAudio(word.hanzi, settings.audioRate);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
                    title="Озвучить"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center"
                  >
                    <select
                      value={level}
                      onChange={(e) => onSetLevel(word.id, parseInt(e.target.value) as MasteryLevel)}
                      className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 focus:outline-none cursor-pointer"
                    >
                      <option value={0}>🔴 Новое</option>
                      <option value={1}>🟡 В процессе</option>
                      <option value={2}>🟢 Закреплено</option>
                      <option value={3}>🏆 Выучено</option>
                    </select>
                  </div>

                  <span className="text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4 text-xs bg-slate-950/40 animate-in fade-in">
                  
                  {/* Morpheme decomposition */}
                  {word.morphemes && word.morphemes.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Морфемный состав слова:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {word.morphemes.map((m, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                            <span className="text-lg font-bold font-chinese text-rose-300">{m.char}</span>
                            <div>
                              <div className="font-mono text-[10px] text-slate-400">[{m.pinyin}]</div>
                              <div className="text-slate-200">{m.meaning}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tip */}
                  {word.tip && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-300">
                      <Info className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{word.tip}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 flex justify-between items-center pt-1">
                    <span>Английский: {word.en}</span>
                    <span>Блок: {word.chunk}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredWords.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            Слов не найдено. Попробуйте изменить параметры поиска или фильтров.
          </div>
        )}
      </div>

    </div>
  );
};
