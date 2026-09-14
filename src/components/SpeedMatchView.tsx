import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Zap, RotateCcw, Trophy, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { WordItem, AppSettings, MasteryLevel } from '../types';
import { WORDS, CHUNKS } from '../data/words';
import { playChineseAudio, playSuccessChime, playErrorChime } from '../utils/speech';

interface SpeedMatchViewProps {
  settings: AppSettings;
  onRecordAnswer: (wordId: number, isCorrect: boolean) => void;
  onIncrementMatches: () => void;
}

interface MatchCard {
  uid: string;
  wordId: number;
  type: 'hanzi' | 'ru';
  text: string;
  pinyin?: string;
  isMatched: boolean;
}

export const SpeedMatchView: React.FC<SpeedMatchViewProps> = ({
  settings,
  onRecordAnswer,
  onIncrementMatches,
}) => {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<MatchCard | null>(null);
  const [wrongCards, setWrongCards] = useState<string[]>([]);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [roundMistakes, setRoundMistakes] = useState<number>(0);

  // Initialize round of 6 words
  const startNewRound = useCallback(() => {
    let pool = WORDS;
    if (settings.selectedChunk > 0) {
      pool = WORDS.filter(w => w.chunk === settings.selectedChunk);
    }
    
    // Pick 6 random words from pool (or all if < 6)
    const count = Math.min(6, pool.length);
    const shuffledWords = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

    const generatedCards: MatchCard[] = [];
    shuffledWords.forEach(w => {
      // Hanzi card
      generatedCards.push({
        uid: `hanzi-${w.id}`,
        wordId: w.id,
        type: 'hanzi',
        text: w.hanzi,
        pinyin: w.pinyin,
        isMatched: false,
      });
      // Russian card
      generatedCards.push({
        uid: `ru-${w.id}`,
        wordId: w.id,
        type: 'ru',
        text: w.ru,
        isMatched: false,
      });
    });

    // Shuffle all 12 cards
    setCards(generatedCards.sort(() => Math.random() - 0.5));
    setSelectedCard(null);
    setWrongCards([]);
    setRoundCompleted(false);
    setStartTime(Date.now());
    setElapsed(0);
    setCombo(0);
    setRoundMistakes(0);
  }, [settings.selectedChunk]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Round Timer
  useEffect(() => {
    if (roundCompleted || startTime === 0) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 500);
    return () => clearInterval(interval);
  }, [startTime, roundCompleted]);

  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched || wrongCards.length > 0) return;

    // Pronounce Hanzi if clicked
    if (card.type === 'hanzi') {
      playChineseAudio(card.text, settings.audioRate);
    }

    // First card selected
    if (!selectedCard) {
      setSelectedCard(card);
      return;
    }

    // Clicked same card
    if (selectedCard.uid === card.uid) {
      setSelectedCard(null);
      return;
    }

    // Check Match
    if (selectedCard.wordId === card.wordId && selectedCard.type !== card.type) {
      // MATCH SUCCESS!
      playSuccessChime();
      onRecordAnswer(card.wordId, true);
      onIncrementMatches();

      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const nextCards = cards.map(c => 
        c.wordId === card.wordId ? { ...c, isMatched: true } : c
      );
      setCards(nextCards);
      setSelectedCard(null);

      // Check if all matched
      const allDone = nextCards.every(c => c.isMatched);
      if (allDone) {
        setRoundCompleted(true);
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    } else {
      // MISMATCH!
      playErrorChime();
      onRecordAnswer(card.wordId, false);
      setRoundMistakes(prev => prev + 1);
      setCombo(0);
      setWrongCards([selectedCard.uid, card.uid]);

      setTimeout(() => {
        setWrongCards([]);
        setSelectedCard(null);
      }, 700);
    }
  };

  const chunkInfo = CHUNKS.find(c => c.id === settings.selectedChunk);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Спид-пары (Скоростное соединение)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {chunkInfo ? chunkInfo.title : 'Все слова'} • Нажимайте пару «Иероглиф ➔ Перевод»
          </p>
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{elapsed} сек</span>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Комбо x{combo}!</span>
            </div>
          )}

          <button
            onClick={startNewRound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Перезапустить раунд"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Modal / Banner */}
      {roundCompleted ? (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-100">Раунд завершен! 🎉</h3>
            <p className="text-sm text-slate-400">
              Вы отлично закрепили эту шестерку слов
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
            <div className="p-3 bg-slate-800/80 rounded-2xl">
              <div className="text-xs text-slate-400">Время</div>
              <div className="text-xl font-bold font-mono text-sky-400">{elapsed}с</div>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl">
              <div className="text-xs text-slate-400">Ошибок</div>
              <div className="text-xl font-bold font-mono text-rose-400">{roundMistakes}</div>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl">
              <div className="text-xs text-slate-400">Макс. комбо</div>
              <div className="text-xl font-bold font-mono text-amber-400">x{maxCombo}</div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={startNewRound}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-950"
            >
              Следующий раунд ➔
            </button>
          </div>
        </div>
      ) : (
        /* The 12-Card Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => {
            const isSelected = selectedCard?.uid === card.uid;
            const isWrong = wrongCards.includes(card.uid);

            if (card.isMatched) {
              return (
                <div
                  key={card.uid}
                  className="h-28 rounded-2xl border border-emerald-900/20 bg-emerald-950/10 flex items-center justify-center text-emerald-600/40 select-none"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              );
            }

            return (
              <button
                key={card.uid}
                onClick={() => handleCardClick(card)}
                className={`h-28 p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all duration-150 select-none shadow-md ${
                  isWrong
                    ? 'bg-red-950/80 border-red-500 text-red-200 animate-shake scale-95'
                    : isSelected
                    ? 'bg-rose-600 border-rose-400 text-white ring-4 ring-rose-500/30 scale-105 shadow-xl'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-100 hover:scale-[1.02]'
                }`}
              >
                {card.type === 'hanzi' ? (
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-bold font-chinese tracking-wide">
                      {card.text}
                    </div>
                    {!settings.pinyinHidden && card.pinyin && (
                      <div className={`text-[11px] font-mono ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                        {card.pinyin}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm font-medium leading-snug line-clamp-3">
                    {card.text}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Helpful shortcut hint */}
      <div className="text-center text-xs text-slate-500">
        💡 Совет: соединяйте пары как можно быстрее, чтобы перевести узнавание иероглифов в мгновенный рефлекс!
      </div>
    </div>
  );
};
