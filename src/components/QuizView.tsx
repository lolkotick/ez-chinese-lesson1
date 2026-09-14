import React, { useState, useEffect, useCallback } from 'react';
import { 
  HelpCircle, 
  Volume2, 
  Check, 
  X, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Headphones, 
  Eye,
  Shuffle
} from 'lucide-react';
import { WordItem, AppSettings, MasteryLevel } from '../types';
import { WORDS, CHUNKS } from '../data/words';
import { playChineseAudio, playSuccessChime, playErrorChime } from '../utils/speech';
import { getCharToneColor } from '../utils/tones';

type QuizMode = 'mixed' | 'hanzi_to_ru' | 'ru_to_hanzi' | 'audio_to_hanzi';

interface QuizViewProps {
  settings: AppSettings;
  onRecordAnswer: (wordId: number, isCorrect: boolean) => void;
  onRecordQuizStats: (correct: number, total: number) => void;
}

interface Question {
  type: 'hanzi_to_ru' | 'ru_to_hanzi' | 'audio_to_hanzi';
  targetWord: WordItem;
  promptText: string;
  options: {
    id: number;
    text: string;
    subText?: string;
    isCorrect: boolean;
  }[];
}

export const QuizView: React.FC<QuizViewProps> = ({
  settings,
  onRecordAnswer,
  onRecordQuizStats,
}) => {
  const [quizMode, setQuizMode] = useState<QuizMode>('mixed');
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  // Generate next question
  const generateQuestion = useCallback(() => {
    let pool = WORDS;
    if (settings.selectedChunk > 0) {
      pool = pool.filter(w => w.chunk === settings.selectedChunk);
    }
    if (pool.length < 4) {
      pool = WORDS; // fallback to all words if pool too small
    }

    const targetWord = pool[Math.floor(Math.random() * pool.length)];

    // Determine type
    let qType: 'hanzi_to_ru' | 'ru_to_hanzi' | 'audio_to_hanzi' = 'hanzi_to_ru';
    if (quizMode === 'mixed') {
      const types: ('hanzi_to_ru' | 'ru_to_hanzi' | 'audio_to_hanzi')[] = [
        'hanzi_to_ru', 
        'ru_to_hanzi', 
        'audio_to_hanzi'
      ];
      qType = types[Math.floor(Math.random() * types.length)];
    } else {
      qType = quizMode as ('hanzi_to_ru' | 'ru_to_hanzi' | 'audio_to_hanzi');
    }

    // Pick 3 distractors from pool
    const distractors = pool
      .filter(w => w.id !== targetWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allWords = [targetWord, ...distractors].sort(() => Math.random() - 0.5);

    let promptText = '';
    const options = allWords.map(w => {
      const isCorrect = w.id === targetWord.id;
      if (qType === 'hanzi_to_ru') {
        promptText = targetWord.hanzi;
        return {
          id: w.id,
          text: w.ru,
          isCorrect,
        };
      } else if (qType === 'ru_to_hanzi') {
        promptText = targetWord.ru;
        return {
          id: w.id,
          text: w.hanzi,
          subText: settings.pinyinHidden ? undefined : w.pinyin,
          isCorrect,
        };
      } else {
        // audio_to_hanzi
        promptText = 'Прослушайте произношение';
        return {
          id: w.id,
          text: w.hanzi,
          subText: settings.pinyinHidden ? undefined : w.pinyin,
          isCorrect,
        };
      }
    });

    setQuestion({
      type: qType,
      targetWord,
      promptText,
      options,
    });
    setSelectedOptionId(null);
    setHasAnswered(false);

    // If audio question or autoAudio enabled, pronounce
    if (qType === 'audio_to_hanzi' || (qType === 'hanzi_to_ru' && settings.autoAudio)) {
      playChineseAudio(targetWord.hanzi, settings.audioRate);
    }
  }, [settings.selectedChunk, settings.pinyinHidden, settings.autoAudio, settings.audioRate, quizMode]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSelectOption = (optionId: number) => {
    if (hasAnswered || !question) return;

    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const isCorrect = optionId === question.targetWord.id;
    onRecordAnswer(question.targetWord.id, isCorrect);
    onRecordQuizStats(isCorrect ? 1 : 0, 1);

    if (isCorrect) {
      playSuccessChime();
      setStreak(prev => prev + 1);
      setSessionScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      playErrorChime();
      setStreak(0);
      setSessionScore(prev => ({ correct: prev.correct, total: prev.total + 1 }));
    }
  };

  // Keyboard shortcuts (1, 2, 3, 4 and Space/Enter)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (!hasAnswered && question) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          if (question.options[idx]) {
            handleSelectOption(question.options[idx].id);
          }
        }
      } else if (hasAnswered) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
          e.preventDefault();
          generateQuestion();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasAnswered, question, generateQuestion]);

  if (!question) return null;

  const targetWord = question.targetWord;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Quiz Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
        {/* Mode selector */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setQuizMode('mixed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              quizMode === 'mixed' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Смешанный
          </button>
          <button
            onClick={() => setQuizMode('hanzi_to_ru')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              quizMode === 'hanzi_to_ru' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Иероглиф → Перевод
          </button>
          <button
            onClick={() => setQuizMode('audio_to_hanzi')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              quizMode === 'audio_to_hanzi' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Аудио → Иероглиф
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              🔥 Серия: {streak}
            </span>
          )}
          <span className="text-slate-400 font-mono">
            {sessionScore.correct} / {sessionScore.total}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Question Type Header */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="uppercase tracking-wider font-semibold text-rose-400 flex items-center gap-1.5">
            {question.type === 'audio_to_hanzi' ? <Headphones className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
            {question.type === 'audio_to_hanzi' 
              ? 'Аудирование: выберите правильное слово' 
              : question.type === 'hanzi_to_ru' 
              ? 'Выберите русский перевод' 
              : 'Выберите китайское написание'}
          </span>

          <button
            type="button"
            onClick={() => playChineseAudio(targetWord.hanzi, settings.audioRate)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition-colors"
            title="Озвучить слово"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Big Prompt */}
        <div className="py-2">
          {question.type === 'audio_to_hanzi' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => playChineseAudio(targetWord.hanzi, settings.audioRate)}
                className="w-20 h-20 mx-auto rounded-full bg-rose-600/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-900/30"
              >
                <Volume2 className="w-8 h-8 animate-pulse" />
              </button>
              <p className="text-xs text-slate-400">Нажмите, чтобы прослушать ещё раз</p>
            </div>
          ) : question.type === 'hanzi_to_ru' ? (
            <div className="space-y-2">
              <div className="text-4xl sm:text-6xl font-bold font-chinese tracking-wide">
                {targetWord.hanzi.split('').map((c, i) => (
                  <span key={i} className={getCharToneColor(targetWord.tones, i, settings.colorTones)}>
                    {c}
                  </span>
                ))}
              </div>
              {!settings.pinyinHidden && (
                <div className="text-base font-mono text-slate-400">
                  {targetWord.pinyin}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-slate-100">
                {targetWord.ru}
              </div>
              <div className="text-xs text-slate-500 italic">
                {targetWord.en}
              </div>
            </div>
          )}
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {question.options.map((opt, index) => {
            const isSelected = selectedOptionId === opt.id;
            const showSuccess = hasAnswered && opt.isCorrect;
            const showFailure = hasAnswered && isSelected && !opt.isCorrect;

            let buttonStyle = 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-100 hover:border-slate-600';
            if (showSuccess) {
              buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
            } else if (showFailure) {
              buttonStyle = 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500/40';
            } else if (hasAnswered && !opt.isCorrect) {
              buttonStyle = 'bg-slate-900/50 border-slate-800/50 text-slate-500 opacity-60';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={hasAnswered}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-150 ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-700/60 text-slate-300 font-mono text-xs flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-sm sm:text-base font-semibold font-chinese">
                      {opt.text}
                    </div>
                    {opt.subText && (
                      <div className="text-xs font-mono text-slate-400">
                        {opt.subText}
                      </div>
                    )}
                  </div>
                </div>

                {showSuccess && <Check className="w-5 h-5 text-emerald-400" />}
                {showFailure && <X className="w-5 h-5 text-red-400" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button after answering */}
        {hasAnswered && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
            {/* Word info reminder */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-left text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base font-chinese text-rose-300">{targetWord.hanzi}</span>
                <span className="font-mono text-slate-400">[{targetWord.pinyin}]</span>
              </div>
              <p className="text-slate-300">{targetWord.ru}</p>
              {targetWord.tip && (
                <p className="text-amber-400/90 text-[11px] pt-1">💡 {targetWord.tip}</p>
              )}
            </div>

            <button
              onClick={generateQuestion}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-900/40 hover:scale-[1.01]"
            >
              <span>Следующий вопрос (Space / Enter)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
