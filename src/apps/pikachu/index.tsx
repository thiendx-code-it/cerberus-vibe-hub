import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePikachuGame, ROUNDS } from "./use-pikachu-game";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function PikachuApp() {
  const g = usePikachuGame();

  /* h-14 = 3.5rem is the sticky Header in App.tsx */
  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "calc(100dvh - 3.5rem)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-2 py-1 shrink-0">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground h-6 px-1.5 text-xs">
            <ArrowLeft className="h-3 w-3" /> Hub
          </Button>
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <span>R{g.round + 1}/{ROUNDS.length}</span>
          <span>⚡{g.moves}</span>
          <span>{g.matchedCount / 2}/{g.config.pairs}</span>
          <span>{fmt(g.time)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={g.resetGame} className="h-6 px-1.5">
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      {/* Round progress */}
      <div className="px-2 pb-0.5 shrink-0">
        <div className="flex gap-px">
          {ROUNDS.map((_, i) => (
            <div
              key={i}
              className={[
                "h-0.5 flex-1 rounded-full transition-colors",
                i < g.round ? "bg-primary" : i === g.round ? "bg-primary/50" : "bg-secondary",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Game area - fills all remaining space */}
      <div className="flex-1 min-h-0 p-1">
        {g.gameComplete ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <p className="text-4xl mb-2">🏆</p>
              <p className="text-xl font-bold mb-1">All 10 Rounds Complete!</p>
              <p className="text-muted-foreground text-sm mb-4">
                {g.totalMoves} total moves in {fmt(g.time)}
              </p>
              <Button onClick={g.resetGame}>Play Again</Button>
            </div>
          </div>
        ) : g.roundWon ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-lg font-bold mb-1">Round {g.round + 1} Clear!</p>
              <p className="text-muted-foreground text-sm mb-3">{g.moves} moves</p>
              <Button onClick={g.nextRound} className="gap-1">
                Next Round <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="grid gap-[2px] h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${g.config.cols}, 1fr)`,
              gridTemplateRows: `repeat(${g.config.rows}, 1fr)`,
            }}
          >
            {g.cards.map((card) => (
              <button
                key={card.id}
                onClick={() => g.handleFlip(card.id)}
                className={[
                  "rounded-sm transition-all duration-200 min-w-0 min-h-0 overflow-hidden",
                  "flex items-center justify-center select-none leading-none",
                  card.flipped || card.matched
                    ? "bg-primary/10"
                    : "bg-secondary hover:bg-secondary/80 cursor-pointer",
                  card.matched ? "ring-1 ring-primary/40 opacity-70" : "",
                ].join(" ")}
                disabled={card.flipped || card.matched || g.locked}
              >
                {card.flipped || card.matched ? (
                  <span className="text-[clamp(10px,min(2.2vw,2.2vh),24px)]">{card.emoji}</span>
                ) : (
                  <span className="text-[clamp(8px,min(1.2vw,1.2vh),14px)] text-muted-foreground/30">?</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
