import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Flame, 
  Volume2, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { WordItem, AppSettings, AppMode } from '../types';
import { WORDS } from '../data/words';
import { playChineseAudio, playSuccessChime, playErrorChime } from '../utils/speech';

interface ExamViewProps {
  settings: AppSettings;
  onRecordAnswer: (wordId: number, isCorrect: boolean) => void;
  onSwitchToFlashcards: () => void;
}

interface ExamQuestion {
  target: WordItem;
  options: {
    id: number;
    text: string;
    isCorrect: boolean;
  }[];
}

export const ExamView: React.FC<ExamViewProps> = ({
  settings,
  onRecordAnswer,
  onSwitchToFlashcards,
}) => {
  const [examActive, setExamActive] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [answersLog, setAnswersLog] = useState<{ word: WordItem; isCorrect: boolean }[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [examLength, setExamLength] = useState<number>(30); // 20, 30, or all 57

  // Start exam
  const startExam = (length: number) => {
    let pool = [...WORDS];
    if (settings.selectedChunk > 0) {
      pool = pool.filter(w => w.chunk === settings.selectedChunk);
    }
    const actualLength = Math.min(length, pool.length);
    const shuffledPool = pool.sort(() => Math.random() - 0.5).slice(0, actualLength);

    const generated: ExamQuestion[] = shuffledPool.map(target => {
      // Pick 3 distractors
      const distractors = WORDS.filter(w => w.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const all = [target, ...distractors].sort(() => Math.random() - 0.5);
      return {
        target,
        options: all.map(w => ({
          id: w.id,
          text: w.ru,
          isCorrect: w.id === target.id,
        })),
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedId(null);
    setAnswersLog([]);
    setElapsed(0);
    setExamLength(actualLength);
    setExamActive(true);
    setExamFinished(false);
  };

  // Timer
  useEffect(() => {
    if (!examActive || examFinished) return;
    const interval = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [examActive, examFinished]);

  const handleAnswer = (optionId: number) => {
    if (selectedId !== null || !questions[currentIndex]) return;

    setSelectedId(optionId);
    const currQ = questions[currentIndex];
    const isCorrect = optionId === currQ.target.id;

    onRecordAnswer(currQ.target.id, isCorrect);
    if (isCorrect) playSuccessChime();
    else playErrorChime();

    setAnswersLog(prev => [...prev, { word: currQ.target, isCorrect }]);

    // Move to next after brief pause
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedId(null);
      } else {
        setExamFinished(true);
        setExamActive(false);

        // Confetti if high score
        const correctCount = answersLog.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0);
        if (correctCount / questions.length >= 0.8) {
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch {
            // ignore
          }
        }
      }
    }, 600);
  };

  const correctCount = answersLog.filter(a => a.isCorrect).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const mistakes = answersLog.filter(a => !a.isCorrect);

  if (!examActive && !examFinished) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-rose-950/50">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-100">
            Итоговый зачёт по уроку 1
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Проверьте, насколько прочно вы запомнили слова за время марафона. 
            По окончании зачёта вы получите детальный список всех ошибок.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4">
          <button
            onClick={() => startExam(20)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all hover:scale-105"
          >
            <div className="text-2xl font-bold font-mono text-sky-400">20</div>
            <div className="text-xs text-slate-400 mt-1">Экспресс-тест</div>
          </button>

          <button
            onClick={() => startExam(35)}
            className="p-4 rounded-2xl bg-slate-900 border border-rose-500/40 text-slate-200 transition-all hover:scale-105 ring-2 ring-rose-500/20"
          >
            <div className="text-2xl font-bold font-mono text-rose-400">35</div>
            <div className="text-xs text-slate-400 mt-1">Оптимальный</div>
          </button>

          <button
            onClick={() => startExam(57)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all hover:scale-105"
          >
            <div className="text-2xl font-bold font-mono text-amber-400">57</div>
            <div className="text-xs text-slate-400 mt-1">Все слова! 🏆</div>
          </button>
        </div>
      </div>
    );
  }

  if (examFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-in zoom-in-95">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-slate-100">
              {scorePercent >= 90 ? 'Великолепно! 🏆' : scorePercent >= 75 ? 'Хороший результат! 👍' : 'Есть над чем поработать 💪'}
            </h3>
            <p className="text-sm text-slate-400">
              Вы ответили правильно на <strong className="text-rose-400">{correctCount}</strong> из <strong className="text-slate-200">{questions.length}</strong> вопросов
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400">Точность</div>
              <div className="text-2xl font-bold font-mono text-rose-400">{scorePercent}%</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400">Время</div>
              <div className="text-2xl font-bold font-mono text-sky-400">{Math.floor(elapsed / 60)}м {elapsed % 60}с</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400">Ошибок</div>
              <div className="text-2xl font-bold font-mono text-amber-400">{mistakes.length}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => startExam(examLength)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-950"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Пройти заново</span>
            </button>

            {mistakes.length > 0 && (
              <button
                onClick={onSwitchToFlashcards}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Отработать в карточках</span>
              </button>
            )}
          </div>
        </div>

        {/* Mistakes review breakdown */}
        {mistakes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Слова, в которых были ошибки ({mistakes.length}):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mistakes.map(({ word }) => (
                <div 
                  key={word.id} 
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg font-chinese text-rose-400">{word.hanzi}</span>
                      <span className="text-xs font-mono text-slate-400">[{word.pinyin}]</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5 line-clamp-1">{word.ru}</div>
                  </div>
                  <button
                    onClick={() => playChineseAudio(word.hanzi, settings.audioRate)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Озвучить"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Progress & timer */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
        <div className="font-mono text-slate-300">
          Вопрос <span className="text-rose-400 font-bold">{currentIndex + 1}</span> из {questions.length}
        </div>

        <div className="flex items-center gap-1.5 font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="bg-rose-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xl">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Выберите правильный перевод</span>
          <button
            type="button"
            onClick={() => playChineseAudio(currentQ.target.hanzi, settings.audioRate)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Big Word */}
        <div className="space-y-2 py-3">
          <div className="text-5xl sm:text-7xl font-bold font-chinese tracking-wide text-slate-100">
            {currentQ.target.hanzi}
          </div>
          {!settings.pinyinHidden && (
            <div className="text-lg font-mono text-slate-400">
              {currentQ.target.pinyin}
            </div>
          )}
        </div>

        {/* 4 Options */}
        <div className="grid grid-cols-1 gap-2.5 pt-2">
          {currentQ.options.map((opt, index) => {
            const isSelected = selectedId === opt.id;
            const isCorrect = opt.isCorrect;

            let btnClass = 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-100';
            if (selectedId !== null) {
              if (isCorrect) {
                btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
              } else if (isSelected) {
                btnClass = 'bg-red-950/80 border-red-500 text-red-200';
              } else {
                btnClass = 'opacity-50 border-slate-800';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                disabled={selectedId !== null}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-700/60 font-mono text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-sm sm:text-base">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
