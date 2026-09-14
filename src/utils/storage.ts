import { WordProgress, UserStats, MasteryLevel, AppSettings } from '../types';
import { WORDS } from '../data/words';

const STORAGE_KEY_PROGRESS = 'ez_chinese_progress_v1';
const STORAGE_KEY_STATS = 'ez_chinese_stats_v1';
const STORAGE_KEY_SETTINGS = 'ez_chinese_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  pinyinHidden: false,
  colorTones: true,
  autoAudio: true,
  audioRate: 0.85,
  selectedChunk: 0,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadWordProgress(): Record<number, WordProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  
  // Initialize with empty defaults
  const initial: Record<number, WordProgress> = {};
  WORDS.forEach(w => {
    initial[w.id] = {
      wordId: w.id,
      level: 0,
      correctStreak: 0,
      mistakesCount: 0,
    };
  });
  return initial;
}

export function saveWordProgress(progress: Record<number, WordProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export function updateWordAnswer(
  progress: Record<number, WordProgress>,
  wordId: number,
  isCorrect: boolean
): Record<number, WordProgress> {
  const current = progress[wordId] || {
    wordId,
    level: 0,
    correctStreak: 0,
    mistakesCount: 0,
  };

  const newStreak = isCorrect ? current.correctStreak + 1 : 0;
  const mistakes = isCorrect ? current.mistakesCount : current.mistakesCount + 1;
  let newLevel: MasteryLevel = current.level;

  if (isCorrect) {
    if (current.level === 0) newLevel = 1;
    else if (current.level === 1 && newStreak >= 2) newLevel = 2;
    else if (current.level === 2 && newStreak >= 3) newLevel = 3;
    else if (newStreak >= 4) newLevel = 3;
  } else {
    // Drop level on mistake
    if (current.level === 3) newLevel = 2;
    else if (current.level === 2) newLevel = 1;
  }

  const updated = {
    ...progress,
    [wordId]: {
      ...current,
      level: newLevel,
      correctStreak: newStreak,
      mistakesCount: mistakes,
      lastReviewed: Date.now(),
    },
  };

  saveWordProgress(updated);
  return updated;
}

export function setExplicitLevel(
  progress: Record<number, WordProgress>,
  wordId: number,
  level: MasteryLevel
): Record<number, WordProgress> {
  const current = progress[wordId] || {
    wordId,
    level: 0,
    correctStreak: 0,
    mistakesCount: 0,
  };

  const updated = {
    ...progress,
    [wordId]: {
      ...current,
      level,
      correctStreak: level === 3 ? 3 : level === 2 ? 2 : 1,
      lastReviewed: Date.now(),
    },
  };

  saveWordProgress(updated);
  return updated;
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  return {
    timeSpentSeconds: 0,
    cardsFlipped: 0,
    matchesCompleted: 0,
    quizzesTaken: 0,
    quizScoreSum: 0,
    quizQuestionsTotal: 0,
    startTime: Date.now(),
  };
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
  localStorage.removeItem(STORAGE_KEY_STATS);
}
