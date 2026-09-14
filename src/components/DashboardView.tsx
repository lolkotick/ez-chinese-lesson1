import React from 'react';
import { 
  CheckCircle2, 
  Layers, 
  Zap, 
  HelpCircle, 
  ArrowRight, 
  Flame, 
  Timer, 
  BrainCircuit,
  Award,
  BookOpen
} from 'lucide-react';
import { WORDS, CHUNKS } from '../data/words';
import { AppMode, AppSettings, MasteryLevel, UserStats } from '../types';

interface DashboardViewProps {
  progress: Record<number, { level: MasteryLevel; mistakesCount: number }>;
  stats: UserStats;
  settings: AppSettings;
  onSelectMode: (mode: AppMode) => void;
  onSelectChunk: (chunkId: number, mode?: AppMode) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  stats,
  onSelectMode,
  onSelectChunk,
}) => {
  const totalWords = WORDS.length;
  const masteredCount = WORDS.filter(w => progress[w.id]?.level === 3).length;
  const inProgressCount = WORDS.filter(w => (progress[w.id]?.level ?? 0) > 0 && progress[w.id]?.level < 3).length;
  const unreadCount = WORDS.filter(w => (progress[w.id]?.level ?? 0) === 0).length;

  const quizAccuracy = stats.quizQuestionsTotal > 0
    ? Math.round((stats.quizScoreSum / stats.quizQuestionsTotal) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Hero 2-Hour Plan Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 border border-rose-900/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              Интенсивный марафон запоминания
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              第一课 建立联系: <span className="bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">Выучить за 2 часа</span>
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              50 новых бизнес-слов и 7 имен собственных. Изучайте порциями по 10 слов: 
              <strong className="text-rose-300"> карточки</strong> для понимания смысла и морфем, 
              <strong className="text-amber-300"> спид-пары</strong> для молниеносного рефлекса, и 
              <strong className="text-sky-300"> тесты</strong> для надежного закрепления.
            </p>
          </div>

          {/* Big CTA */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onSelectChunk(1, 'flashcards')}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold shadow-lg shadow-rose-900/50 hover:shadow-rose-900/70 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Начать с Блока 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectMode('speedmatch')}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Быстрый спринт пар</span>
            </button>
          </div>
        </div>

        {/* 2-Hour Strategy Timeline Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400">1. Знакомство</div>
            <div className="text-sm font-semibold text-slate-200">10 мин / блок</div>
            <div className="text-[11px] text-slate-500">Карточки + разбор иероглифов</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400">2. Автоматизм</div>
            <div className="text-sm font-semibold text-slate-200">5 мин / блок</div>
            <div className="text-[11px] text-slate-500">Спид-пары без подглядывания</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400">3. Проверка</div>
            <div className="text-sm font-semibold text-slate-200">20 мин</div>
            <div className="text-[11px] text-slate-500">Тесты с 4 вариантами и аудио</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
            <div className="text-xs text-slate-400">4. Зачёт 100%</div>
            <div className="text-sm font-semibold text-slate-200">15 мин</div>
            <div className="text-[11px] text-slate-500">Финальный зачет по всем 57</div>
          </div>
        </div>
      </div>

      {/* Progress Cards Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{masteredCount}</div>
            <div className="text-xs text-slate-400">Выучено на 100%</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{inProgressCount}</div>
            <div className="text-xs text-slate-400">В процессе повтора</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{stats.matchesCompleted}</div>
            <div className="text-xs text-slate-400">Собрано пар</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{quizAccuracy}%</div>
            <div className="text-xs text-slate-400">Точность в тестах</div>
          </div>
        </div>
      </div>

      {/* 6 Study Blocks (Chunks) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Учебные блоки</h3>
            <p className="text-xs text-slate-400">Проходите по очереди для максимального эффекта</p>
          </div>
          <button
            onClick={() => onSelectMode('dictionary')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Весь словарь (57 слов)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHUNKS.map((chunk) => {
            const chunkWords = WORDS.filter(w => w.chunk === chunk.id);
            const chunkMastered = chunkWords.filter(w => progress[w.id]?.level === 3).length;
            const chunkLearning = chunkWords.filter(w => (progress[w.id]?.level ?? 0) > 0 && progress[w.id]?.level < 3).length;
            const progressPercent = Math.round((chunkMastered / chunkWords.length) * 100);

            const isDone = chunkMastered === chunkWords.length;

            return (
              <div
                key={chunk.id}
                className={`relative rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isDone
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
                        Слова {chunk.range}
                      </span>
                      <h4 className="text-base font-bold text-slate-100 mt-0.5">{chunk.title}</h4>
                    </div>
                    {isDone ? (
                      <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 font-mono">
                        {chunkMastered}/{chunkWords.length}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{chunk.desc}</p>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Words preview pills */}
                  <div className="flex flex-wrap gap-1 mb-5">
                    {chunkWords.slice(0, 5).map(w => (
                      <span 
                        key={w.id} 
                        className={`text-xs px-2 py-0.5 rounded font-chinese ${
                          progress[w.id]?.level === 3 
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' 
                            : 'bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        {w.hanzi}
                      </span>
                    ))}
                    {chunkWords.length > 5 && (
                      <span className="text-[10px] text-slate-500 px-1 py-0.5 self-center">
                        +{chunkWords.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-800/80 text-xs">
                  <button
                    onClick={() => onSelectChunk(chunk.id, 'flashcards')}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="Учить карточки"
                  >
                    <Layers className="w-3.5 h-3.5 text-rose-400" />
                    <span>Карточки</span>
                  </button>
                  <button
                    onClick={() => onSelectChunk(chunk.id, 'speedmatch')}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="Спид-пары"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Пары</span>
                  </button>
                  <button
                    onClick={() => onSelectChunk(chunk.id, 'quiz')}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="Тестирование"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>Тест</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
