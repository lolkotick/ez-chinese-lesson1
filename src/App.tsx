import { useState, useEffect } from 'react';
import { AppMode, AppSettings, WordProgress, UserStats, MasteryLevel } from './types';
import { 
  loadSettings, 
  saveSettings, 
  loadWordProgress, 
  updateWordAnswer, 
  setExplicitLevel, 
  loadUserStats, 
  saveUserStats, 
  resetAllData 
} from './utils/storage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { FlashcardsView } from './components/FlashcardsView';
import { SpeedMatchView } from './components/SpeedMatchView';
import { QuizView } from './components/QuizView';
import { ToneDrillView } from './components/ToneDrillView';
import { ExamView } from './components/ExamView';
import { DictionaryView } from './components/DictionaryView';
import { SprintModal } from './components/SprintModal';

export function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('dashboard');
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [progress, setProgress] = useState<Record<number, WordProgress>>(loadWordProgress);
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);

  // Time tracker: increment time spent every 5 seconds & check 2-hour milestone
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        const nextTime = prev.timeSpentSeconds + 5;
        const updated = { ...prev, timeSpentSeconds: nextTime };
        saveUserStats(updated);

        // Check if just reached 120 minutes (7200 seconds)
        if (nextTime >= 7200 && prev.timeSpentSeconds < 7200) {
          setIsSprintModalOpen(true);
        }

        return updated;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleRateWord = (wordId: number, level: MasteryLevel) => {
    const nextProgress = setExplicitLevel(progress, wordId, level);
    setProgress(nextProgress);
  };

  const handleRecordAnswer = (wordId: number, isCorrect: boolean) => {
    const nextProgress = updateWordAnswer(progress, wordId, isCorrect);
    setProgress(nextProgress);
  };

  const handleRecordQuizStats = (correct: number, total: number) => {
    setStats(prev => {
      const updated = {
        ...prev,
        quizzesTaken: prev.quizzesTaken + 1,
        quizScoreSum: prev.quizScoreSum + correct,
        quizQuestionsTotal: prev.quizQuestionsTotal + total,
      };
      saveUserStats(updated);
      return updated;
    });
  };

  const handleIncrementFlipped = () => {
    setStats(prev => {
      const updated = { ...prev, cardsFlipped: prev.cardsFlipped + 1 };
      saveUserStats(updated);
      return updated;
    });
  };

  const handleIncrementMatches = () => {
    setStats(prev => {
      const updated = { ...prev, matchesCompleted: prev.matchesCompleted + 1 };
      saveUserStats(updated);
      return updated;
    });
  };

  const handleReset = () => {
    resetAllData();
    setProgress(loadWordProgress());
    setStats(loadUserStats());
  };

  const handleSelectChunk = (chunkId: number, mode: AppMode = 'flashcards') => {
    handleUpdateSettings({ ...settings, selectedChunk: chunkId });
    setCurrentMode(mode);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Top Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        progress={progress}
        stats={stats}
        onReset={handleReset}
        onOpenSprintModal={() => setIsSprintModalOpen(true)}
      />

      {/* Navigation Tabs */}
      <Navigation
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentMode === 'dashboard' && (
          <DashboardView
            progress={progress}
            stats={stats}
            settings={settings}
            onSelectMode={setCurrentMode}
            onSelectChunk={handleSelectChunk}
          />
        )}

        {currentMode === 'flashcards' && (
          <FlashcardsView
            settings={settings}
            progress={progress}
            onRateWord={handleRateWord}
            onIncrementFlipped={handleIncrementFlipped}
          />
        )}

        {currentMode === 'speedmatch' && (
          <SpeedMatchView
            settings={settings}
            onRecordAnswer={handleRecordAnswer}
            onIncrementMatches={handleIncrementMatches}
          />
        )}

        {currentMode === 'quiz' && (
          <QuizView
            settings={settings}
            onRecordAnswer={handleRecordAnswer}
            onRecordQuizStats={handleRecordQuizStats}
          />
        )}

        {currentMode === 'tones' && (
          <ToneDrillView
            settings={settings}
            onRecordAnswer={handleRecordAnswer}
          />
        )}

        {currentMode === 'exam' && (
          <ExamView
            settings={settings}
            onRecordAnswer={handleRecordAnswer}
            onSwitchToFlashcards={() => setCurrentMode('flashcards')}
          />
        )}

        {currentMode === 'dictionary' && (
          <DictionaryView
            settings={settings}
            progress={progress}
            onSetLevel={handleRateWord}
          />
        )}
      </main>

      {/* Footer info */}
      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>EZ Chinese • 第一课 建立联系 • Эффективная экспресс-методика запоминания иероглифов</p>
      </footer>

      {/* 2-Hour Sprint Checkpoint Modal */}
      <SprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        stats={stats}
        progress={progress}
        onGoToExam={() => {
          setIsSprintModalOpen(false);
          setCurrentMode('exam');
        }}
        onGoToProblemWords={() => {
          setIsSprintModalOpen(false);
          setCurrentMode('flashcards');
        }}
      />
    </div>
  );
}

export default App;
