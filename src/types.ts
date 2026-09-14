export interface Morpheme {
  char: string;
  pinyin: string;
  meaning: string;
}

export interface WordItem {
  id: number;
  hanzi: string;
  pinyin: string;
  tones: number[]; // e.g. [3, 1, 3] for fǎng-zhī-pǐn
  ru: string;
  en: string;
  category: 'vocab' | 'proper';
  chunk: number; // 1 to 6
  morphemes?: Morpheme[]; // Character by character breakdown
  example?: {
    zh: string;
    pinyin: string;
    ru: string;
  };
  tip?: string; // Mnemonic or usage hint
}

export type MasteryLevel = 0 | 1 | 2 | 3; 
// 0: Новое (Unseen / New)
// 1: В процессе (Learning)
// 2: Закреплено (Reviewing)
// 3: Выучено (Mastered)

export interface WordProgress {
  wordId: number;
  level: MasteryLevel;
  correctStreak: number;
  mistakesCount: number;
  lastReviewed?: number; // timestamp
}

export interface UserStats {
  timeSpentSeconds: number;
  cardsFlipped: number;
  matchesCompleted: number;
  quizzesTaken: number;
  quizScoreSum: number;
  quizQuestionsTotal: number;
  startTime: number;
}

export interface AppSettings {
  pinyinHidden: boolean;
  colorTones: boolean;
  autoAudio: boolean;
  audioRate: number; // 0.7 to 1.0
  selectedChunk: number; // 0 = all, 1..6 = specific chunk
}

export type AppMode = 
  | 'dashboard' 
  | 'flashcards' 
  | 'speedmatch' 
  | 'quiz' 
  | 'tones' 
  | 'exam' 
  | 'dictionary';
