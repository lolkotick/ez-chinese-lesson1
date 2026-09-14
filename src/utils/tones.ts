export const TONE_COLORS = {
  1: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
  2: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
  3: 'text-sky-500 bg-sky-500/10 border-sky-500/30',
  4: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
  5: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
};

export const TONE_TEXT_COLORS: Record<number, string> = {
  1: 'text-rose-400',
  2: 'text-emerald-400',
  3: 'text-sky-400',
  4: 'text-purple-400',
  5: 'text-slate-400',
};

export const TONE_NAMES: Record<number, { name: string; mark: string; desc: string }> = {
  1: { name: '1-й тон', mark: 'ˉ (высокий ровный)', desc: 'Высокий, ровный, как распевка' },
  2: { name: '2-й тон', mark: 'ˊ (восходящий)', desc: 'Вопросительный, как «Что?»' },
  3: { name: '3-й тон', mark: 'ˇ (нисходяще-восходящий)', desc: 'Опускается вниз и чуть вверх' },
  4: { name: '4-й тон', mark: 'ˋ (нисходящий)', desc: 'Резкий, приказной, как «Нет!»' },
  5: { name: 'Нейтральный', mark: '• (легкий)', desc: 'Короткий и безударный' },
};

/**
 * Returns color classes for each character of the Hanzi based on tones array
 */
export function getCharToneColor(tones: number[], charIndex: number, enabled: boolean = true): string {
  if (!enabled) return 'text-slate-100';
  const tone = tones[charIndex] || tones[tones.length - 1] || 1;
  return TONE_TEXT_COLORS[tone] || 'text-slate-100';
}
