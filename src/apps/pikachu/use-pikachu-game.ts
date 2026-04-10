import { useState, useEffect, useCallback } from "react";

const ALL_EMOJIS = [
  "⚡", "🔥", "💧", "🌿", "👻", "🐉", "⭐", "🌙", "💎", "❄️",
  "🌀", "🎯", "💜", "🧲", "🌈", "🎵", "🎮", "🏆", "🎲", "🕹️",
  "🦊", "🐢", "🦅", "🐛", "🐬", "🦋", "🐙", "🦈", "🐼", "🦁",
  "🐸", "🐧", "🦉", "🐺", "🐝", "🦄", "🐳", "🦖", "🐍", "🦂",
  "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝", "🍑",
  "🌽", "🥕", "🍆", "🥦", "🧀", "🍗", "🍕", "🍩", "🎂", "🍫",
  "🚀", "🛸", "🌍", "🌕", "☄️", "🔮", "🗡️", "🛡️", "👑", "💰",
  "🎪", "🎭", "🎨", "🎬", "📸", "🔔", "💡", "🔑", "🧩", "🎁",
];

export const ROUNDS = [
  { cols: 8, rows: 8, pairs: 32 },
  { cols: 8, rows: 9, pairs: 36 },
  { cols: 8, rows: 10, pairs: 40 },
  { cols: 9, rows: 10, pairs: 45 },
  { cols: 10, rows: 10, pairs: 50 },
  { cols: 10, rows: 11, pairs: 55 },
  { cols: 10, rows: 12, pairs: 60 },
  { cols: 11, rows: 12, pairs: 66 },
  { cols: 12, rows: 12, pairs: 72 },
  { cols: 12, rows: 13, pairs: 78 },
];

export interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function createDeck(pairs: number): Card[] {
  const emojis = ALL_EMOJIS.slice(0, pairs);
  return [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

export function usePikachuGame() {
  const [round, setRound] = useState(0);
  const [cards, setCards] = useState<Card[]>(() => createDeck(ROUNDS[0].pairs));
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundWon, setRoundWon] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [locked, setLocked] = useState(false);

  const matchedCount = cards.filter((c) => c.matched).length;
  const config = ROUNDS[round];

  useEffect(() => {
    if (!gameStarted || roundWon || gameComplete) return;
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameStarted, roundWon, gameComplete]);

  useEffect(() => {
    if (matchedCount === cards.length && matchedCount > 0) {
      setRoundWon(true);
    }
  }, [matchedCount, cards.length]);

  const handleFlip = useCallback(
    (id: number) => {
      if (locked || roundWon || gameComplete) return;
      const card = cards[id];
      if (card.flipped || card.matched) return;
      if (!gameStarted) setGameStarted(true);

      const next = [...selected, id];
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));

      if (next.length === 2) {
        setMoves((m) => m + 1);
        setTotalMoves((m) => m + 1);
        setLocked(true);
        const [a, b] = next;
        if (cards[a].emoji === cards[b].emoji) {
          setCards((prev) =>
            prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c))
          );
          setSelected([]);
          setLocked(false);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c))
            );
            setSelected([]);
            setLocked(false);
          }, 700);
        }
      } else {
        setSelected(next);
      }
    },
    [cards, selected, locked, roundWon, gameComplete, gameStarted]
  );

  const nextRound = useCallback(() => {
    const next = round + 1;
    if (next >= ROUNDS.length) {
      setGameComplete(true);
      return;
    }
    setRound(next);
    setCards(createDeck(ROUNDS[next].pairs));
    setSelected([]);
    setMoves(0);
    setRoundWon(false);
    setLocked(false);
  }, [round]);

  const resetGame = useCallback(() => {
    setRound(0);
    setCards(createDeck(ROUNDS[0].pairs));
    setSelected([]);
    setMoves(0);
    setTotalMoves(0);
    setTime(0);
    setGameStarted(false);
    setRoundWon(false);
    setGameComplete(false);
    setLocked(false);
  }, []);

  return {
    cards, round, moves, totalMoves, time, gameStarted,
    roundWon, gameComplete, locked, matchedCount, config,
    handleFlip, nextRound, resetGame,
  };
}
