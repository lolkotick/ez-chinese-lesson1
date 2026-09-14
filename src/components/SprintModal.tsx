import React from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  RotateCcw, 
  BookOpen, 
  Sparkles,
  Zap,
  HelpCircle,
  BrainCircuit,
  Coffee
} from 'lucide-react';
import { UserStats, MasteryLevel, AppMode } from '../types';
import { WORDS } from '../data/words';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  progress: Record<number, { level: MasteryLevel; mistakesCount: number }>;
  onGoToExam: () => void;
  onGoToProblemWords: () => void;
}

export const SprintModal: React.FC<SprintModalProps> = ({
  isOpen,
  onClose,
  stats,
  progress,
  onGoToExam,
  onGoToProblemWords,
}) => {
  if (!isOpen) return null;

  const totalMinutes = Math.floor(stats.timeSpentSeconds / 60);
  const totalWords = WORDS.length;
  const masteredCount = WORDS.filter(w => progress[w.id]?.level === 3).length;
  const inProgressCount = WORDS.filter(w => (progress[w.id]?.level ?? 0) > 0 && progress[w.id]?.level < 3).length;
  const unreadCount = WORDS.filter(w => (progress[w.id]?.level ?? 0) === 0).length;
  const problemWordsCount = WORDS.filter(w => progress[w.id]?.mistakesCount > 0 || ((progress[w.id]?.level ?? 0) > 0 && progress[w.id]?.level < 2)).length;

  const accuracy = stats.quizQuestionsTotal > 0
    ? Math.round((stats.quizScoreSum / stats.quizQuestionsTotal) * 100)
    : 0;

  const isCompleted2Hours = totalMinutes >= 120;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        
        {/* Glow background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-950/50">
            {isCompleted2Hours ? <Trophy className="w-8 h-8" /> : <Clock className="w-8 h-8 text-amber-200" />}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            {isCompleted2Hours ? '⏱️ 2 часа спринта завершены!' : '⏱️ Статус 2-часового спринта'}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {isCompleted2Hours
              ? 'Время интенсивного изучения подошло к концу. Пора оценить результаты и закрепить знания!'
              : `Прошло ${totalMinutes} из 120 минут запланированного времени. Вот ваша текущая сводка:`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <div className="text-xs text-slate-400">Время</div>
            <div className="text-xl font-bold font-mono text-amber-400">{totalMinutes} / 120м</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <div className="text-xs text-slate-400">Выучено</div>
            <div className="text-xl font-bold font-mono text-emerald-400">{masteredCount} / {totalWords}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <div className="text-xs text-slate-400">Точность</div>
            <div className="text-xl font-bold font-mono text-sky-400">{accuracy}%</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
            <div className="text-xs text-slate-400">Собрано пар</div>
            <div className="text-xl font-bold font-mono text-purple-400">{stats.matchesCompleted}</div>
          </div>
        </div>

        {/* Pedagogical Recommendation */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="font-semibold text-rose-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Что делать через 2 часа:</span>
          </div>
          <p>
            1. <strong>Сдать финальный зачёт</strong>: проверка на долговременную память (Active Recall).
          </p>
          <p>
            2. <strong>Сделать 15-минутный перерыв</strong>: по кривой забывания Эббингауза мозгу нужен отдых для консолидации синаптических связей.
          </p>
          <p>
            3. <strong>Повторить через 24 часа</strong>: открыть карточки только по проблемным словам (кнопка «Ошибки»).
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              onClose();
              onGoToExam();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold transition-all shadow-lg shadow-rose-950 flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Сдать финальный зачёт прямо сейчас</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {problemWordsCount > 0 && (
            <button
              onClick={() => {
                onClose();
                onGoToProblemWords();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold transition-all text-xs flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Повторить проблемные слова ({problemWordsCount} шт.)</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-xs font-medium"
          >
            Продолжить обучение (закрыть окно)
          </button>
        </div>

      </div>
    </div>
  );
};
