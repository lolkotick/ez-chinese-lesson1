import React, { useState, useEffect, useCallback } from 'react';
import { Music, Volume2, Check, X, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { WordItem, AppSettings } from '../types';
import { WORDS } from '../data/words';
import { playChineseAudio, playSuccessChime, playErrorChime } from '../utils/speech';
import { TONE_NAMES, TONE_TEXT_COLORS } from '../utils/tones';

interface ToneDrillViewProps {
  settings: AppSettings;
  onRecordAnswer: (wordId: number, isCorrect: boolean) => void;
}

export const ToneDrillView: React.FC<ToneDrillViewProps> = ({
  settings,
  onRecordAnswer,
}) => {
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [selectedTones, setSelectedTones] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const nextWord = useCallback(() => {
    let pool = WORDS;
    if (settings.selectedChunk > 0) {
      pool = pool.filter(w => w.chunk === settings.selectedChunk);
    }
    const rand = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(rand);
    setSelectedTones(new Array(rand.tones.length).fill(0));
    setSubmitted(false);
    setIsCorrect(false);

    if (settings.autoAudio) {
      playChineseAudio(rand.hanzi, settings.audioRate);
    }
  }, [settings.selectedChunk, settings.autoAudio, settings.audioRate]);

  useEffect(() => {
    nextWord();
  }, [nextWord]);

  if (!currentWord) return null;

  const handleSelectToneForChar = (charIndex: number, tone: number) => {
    if (submitted) return;
    const next = [...selectedTones];
    next[charIndex] = tone;
    setSelectedTones(next);

    // If all chars answered, auto-check
    if (next.every(t => t > 0)) {
      const correct = next.every((t, i) => t === currentWord.tones[i]);
      setSubmitted(true);
      setIsCorrect(correct);
      onRecordAnswer(currentWord.id, correct);

      if (correct) {
        playSuccessChime();
        setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
      } else {
        playErrorChime();
        setScore(s => ({ correct: s.correct, total: s.total + 1 }));
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top bar */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
        <div>
          <h2 className="font-bold text-slate-100 flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-400" />
            <span>Тренажёр китайских тонов</span>
          </h2>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Определите тоны для каждого иероглифа в слове
          </p>
        </div>

        <div className="font-mono text-slate-300">
          Точность: <span className="text-purple-400 font-bold">{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</span> ({score.correct}/{score.total})
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xl">
        
        {/* Audio button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => playChineseAudio(currentWord.hanzi, settings.audioRate)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition-colors"
            title="Прослушать"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Big Word Display */}
        <div className="space-y-2">
          <div className="text-5xl sm:text-6xl font-bold font-chinese tracking-widest text-slate-100">
            {currentWord.hanzi}
          </div>
          <div className="text-sm text-slate-400">
            {currentWord.ru}
          </div>
        </div>

        {/* Tone Selector per Character */}
        <div className="space-y-6 pt-2">
          {currentWord.hanzi.split('').slice(0, currentWord.tones.length).map((char, charIdx) => {
            const currentSelected = selectedTones[charIdx];
            const correctTone = currentWord.tones[charIdx];

            return (
              <div key={charIdx} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-chinese text-slate-200">
                      {char}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Иероглиф #{charIdx + 1}
                    </span>
                  </div>

                  {submitted && (
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span>Правильный тон:</span>
                      <span className={`font-bold ${TONE_TEXT_COLORS[correctTone]}`}>
                        {correctTone}-й ({TONE_NAMES[correctTone]?.mark})
                      </span>
                    </div>
                  )}
                </div>

                {/* 4 Tone buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(toneNum => {
                    const isChosen = currentSelected === toneNum;
                    const isCorrectChoice = submitted && toneNum === correctTone;
                    const isWrongChoice = submitted && isChosen && toneNum !== correctTone;

                    let btnClass = 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700';
                    if (isCorrectChoice) {
                      btnClass = 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400/40';
                    } else if (isWrongChoice) {
                      btnClass = 'bg-rose-600 text-white border-rose-500';
                    } else if (isChosen) {
                      btnClass = 'bg-purple-600 text-white border-purple-500';
                    }

                    return (
                      <button
                        key={toneNum}
                        onClick={() => handleSelectToneForChar(charIdx, toneNum)}
                        disabled={submitted}
                        className={`py-2 px-1 rounded-xl border text-center font-medium transition-all ${btnClass}`}
                      >
                        <div className="text-sm font-bold font-mono">{toneNum}</div>
                        <div className="text-[10px] opacity-80">{TONE_NAMES[toneNum]?.mark.split(' ')[0]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Result & Next button */}
        {submitted && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in">
            <div className={`p-4 rounded-2xl flex items-center justify-center gap-2 font-bold ${
              isCorrect ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-rose-950/60 text-rose-300 border border-rose-800'
            }`}>
              {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              <span>{isCorrect ? 'В точку! Тоны определены верно!' : `Пиньинь: ${currentWord.pinyin}`}</span>
            </div>

            <button
              onClick={nextWord}
              className="w-full py-3 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-950"
            >
              Следующее слово ➔
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
