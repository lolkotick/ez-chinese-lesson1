import React, { useState, useEffect, useCallback } from 'react';
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Eye, 
  EyeOff, 
  Sparkles,
  Info,
  Check,
  Flame,
  AlertCircle
} from 'lucide-react';
import { WordItem, AppSettings, MasteryLevel, WordProgress } from '../types';
import { WORDS, CHUNKS } from '../data/words';
import { playChineseAudio } from '../utils/speech';
import { getCharToneColor, TONE_NAMES } from '../utils/tones';

interface FlashcardsViewProps {
  settings: AppSettings;
  progress: Record<number, WordProgress>;
  onRateWord: (wordId: number, level: MasteryLevel) => void;
  onIncrementFlipped: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  settings,
  progress,
  onRateWord,
  onIncrementFlipped,
}) => {
  const [deck, setDeck] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [peekPinyin, setPeekPinyin] = useState(false);
  const [filterProblematic, setFilterProblematic] = useState(false);

  // Build deck based on selected chunk and filter
  useEffect(() => {
    let filtered = WORDS;
    if (settings.selectedChunk > 0) {
      filtered = filtered.filter(w => w.chunk === settings.selectedChunk);
    }
    if (filterProblematic) {
      filtered = filtered.filter(w => {
        const p = progress[w.id];
        return p && (p.mistakesCount > 0 || p.level < 2);
      });
      if (filtered.length === 0) {
        filtered = WORDS.filter(w => settings.selectedChunk === 0 || w.chunk === settings.selectedChunk);
      }
    }
    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setPeekPinyin(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.selectedChunk, filterProblematic]);

  const currentWord: WordItem | undefined = deck[currentIndex];
  const currentProgress = currentWord ? progress[currentWord.id] : undefined;

  // Auto-play audio when card changes if enabled
  useEffect(() => {
    if (currentWord && settings.autoAudio && !isFlipped) {
      playChineseAudio(currentWord.hanzi, settings.audioRate);
    }
  }, [currentWord, settings.autoAudio, settings.audioRate]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => {
      if (!prev) onIncrementFlipped();
      return !prev;
    });
  }, [onIncrementFlipped]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < deck.length - 1 ? prev + 1 : 0));
    setIsFlipped(false);
    setPeekPinyin(false);
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, deck.length - 1)));
    setIsFlipped(false);
    setPeekPinyin(false);
  }, [deck.length]);

  const handleRate = useCallback((level: MasteryLevel) => {
    if (!currentWord) return;
    onRateWord(currentWord.id, level);
    handleNext();
  }, [currentWord, onRateWord, handleNext]);

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        handleRate(0);
      } else if (e.key === '2') {
        handleRate(1);
      } else if (e.key === '3') {
        handleRate(2);
      } else if (e.key === '4') {
        handleRate(3);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleFlip, handleNext, handlePrev, handleRate]);

  if (!currentWord) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center text-slate-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-500" />
        <p className="text-lg font-semibold text-slate-200">Нет карточек для отображения</p>
        <p className="text-sm mt-1">Попробуйте выключить фильтр проблемных слов или выбрать другой блок.</p>
        <button
          onClick={() => setFilterProblematic(false)}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-500"
        >
          Сбросить фильтр
        </button>
      </div>
    );
  }

  const chunkInfo = CHUNKS.find(c => c.id === currentWord.chunk);

  const getLevelBadge = (level: MasteryLevel = 0) => {
    switch (level) {
      case 3:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🏆 Выучено</span>;
      case 2:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">🟢 Закреплено</span>;
      case 1:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">🟡 Изучаемое</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600">🔴 Новое</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-slate-200 text-sm">
            {currentIndex + 1} <span className="text-slate-500">/ {deck.length}</span>
          </span>
          {chunkInfo && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
              {chunkInfo.title.split(':')[0]}
            </span>
          )}
          {getLevelBadge(currentProgress?.level)}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterProblematic(!filterProblematic)}
            className={`px-2.5 py-1 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              filterProblematic 
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Повторять только проблемные слова"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Ошибки</span>
          </button>

          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:text-white text-slate-400 transition-colors"
            title="Перемешать колоду"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="bg-rose-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
        />
      </div>

      {/* 3D Flashcard Container */}
      <div 
        className="relative w-full min-h-[380px] sm:min-h-[420px] perspective-1000 cursor-pointer select-none"
        onClick={handleFlip}
      >
        <div 
          className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl transition-transform duration-500 transform-style-3d border shadow-2xl relative ${
            isFlipped ? 'rotate-y-180' : ''
          } ${
            currentProgress?.level === 3
              ? 'bg-slate-900 border-emerald-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* ============ FRONT FACE ============ */}
          <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950">
            
            {/* Top row */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>№{currentWord.id} {currentWord.category === 'proper' ? '• Имя собственное' : '• Слово'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playChineseAudio(currentWord.hanzi, settings.audioRate);
                }}
                className="p-2.5 rounded-2xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 transition-all hover:scale-105"
                title="Озвучить слово"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Big Hanzi */}
            <div className="text-center py-4 space-y-4">
              <div className="text-5xl sm:text-7xl font-bold font-chinese tracking-wide leading-tight flex justify-center flex-wrap gap-x-1">
                {currentWord.hanzi.split('').map((char, i) => (
                  <span 
                    key={i} 
                    className={getCharToneColor(currentWord.tones, i, settings.colorTones)}
                  >
                    {char}
                  </span>
                ))}
              </div>

              {/* Pinyin on front (if not hidden, or if peeked) */}
              <div className="h-8 flex items-center justify-center">
                {!settings.pinyinHidden || peekPinyin ? (
                  <span className="text-xl sm:text-2xl font-mono text-slate-300 font-medium tracking-wide">
                    {currentWord.pinyin}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPeekPinyin(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-400 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Показать пиньинь</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom hint */}
            <div className="text-center">
              <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                <RotateCw className="w-3.5 h-3.5" />
                Нажмите Space или кликните для перевода
              </span>
            </div>
          </div>

          {/* ============ BACK FACE ============ */}
          <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 overflow-y-auto">
            
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-chinese text-slate-200">
                  {currentWord.hanzi}
                </span>
                <span className="text-sm font-mono text-rose-400 font-medium">
                  {currentWord.pinyin}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playChineseAudio(currentWord.hanzi, settings.audioRate);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Озвучить"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Center Content: Meaning & Morpheme breakdown */}
            <div className="my-auto py-3 space-y-4 text-left">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                  {currentWord.ru}
                </h3>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  en: {currentWord.en}
                </p>
              </div>

              {/* Morpheme decomposition */}
              {currentWord.morphemes && currentWord.morphemes.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Разбор по иероглифам (морфемы)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentWord.morphemes.map((m, idx) => (
                      <div key={idx} className="flex items-baseline gap-2 text-xs">
                        <span className="font-bold text-base font-chinese text-rose-300">{m.char}</span>
                        <span className="font-mono text-[11px] text-slate-400">[{m.pinyin}]</span>
                        <span className="text-slate-300">— {m.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mnemonic / Usage Tip */}
              {currentWord.tip && (
                <div className="flex items-start gap-2 text-xs text-slate-300 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  <Info className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{currentWord.tip}</span>
                </div>
              )}
            </div>

            {/* Flip back reminder */}
            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-500">
                Оцените знание кнопками ниже (1 - 4)
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows & Rate Buttons */}
      <div className="space-y-3">
        {/* Rating Buttons (1 to 4) */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleRate(0)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 transition-all active:scale-95 group"
          >
            <span className="text-xs font-bold">Не помню</span>
            <span className="text-[10px] text-red-400/80 font-mono mt-0.5">[1] С нуля</span>
          </button>

          <button
            onClick={() => handleRate(1)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 text-amber-300 transition-all active:scale-95 group"
          >
            <span className="text-xs font-bold">Трудно</span>
            <span className="text-[10px] text-amber-400/80 font-mono mt-0.5">[2] Сомневаюсь</span>
          </button>

          <button
            onClick={() => handleRate(2)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/50 text-sky-300 transition-all active:scale-95 group"
          >
            <span className="text-xs font-bold">Помню</span>
            <span className="text-[10px] text-sky-400/80 font-mono mt-0.5">[3] Закрепить</span>
          </button>

          <button
            onClick={() => handleRate(3)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 transition-all active:scale-95 group"
          >
            <span className="text-xs font-bold">Знаю</span>
            <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5">[4] Освоено 🏆</span>
          </button>
        </div>

        {/* Prev & Next Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад (←)</span>
          </button>

          <button
            onClick={handleFlip}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Лицевая сторона' : 'Перевернуть (Space)'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <span>Вперед (→)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
