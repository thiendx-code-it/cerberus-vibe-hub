import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMinesweeperGame, LEVELS, type Cell } from "./use-minesweeper-game";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const NUMBER_COLORS: Record<number, string> = {
  1: "text-blue-600",
  2: "text-green-600",
  3: "text-red-600",
  4: "text-purple-700",
  5: "text-amber-800",
  6: "text-cyan-600",
  7: "text-black",
  8: "text-gray-500",
};

function CellButton({
  cell,
  r,
  c,
  gameOver,
  onReveal,
  onToggleFlag,
}: {
  cell: Cell;
  r: number;
  c: number;
  gameOver: boolean;
  onReveal: (r: number, c: number) => void;
  onToggleFlag: (r: number, c: number) => void;
}) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFlag(r, c);
  };

  let content: React.ReactNode;
  let bgColor: string;

  if (cell.revealed) {
    if (cell.isMine) {
      content = "💣";
      bgColor = "bg-red-100";
    } else if (cell.neighborMines > 0) {
      content = (
        <span className={`font-bold ${NUMBER_COLORS[cell.neighborMines] || "text-gray-800"}`}>
          {cell.neighborMines}
        </span>
      );
      bgColor = "bg-background";
    } else {
      content = "";
      bgColor = "bg-background";
    }
  } else if (cell.flagged) {
    content = "🚩";
    bgColor = gameOver ? "bg-red-50" : "bg-secondary hover:bg-secondary/80";
  } else {
    content = "";
    bgColor = "bg-secondary hover:bg-secondary/80 cursor-pointer";
  }

  return (
    <button
      className={`flex items-center justify-center select-none rounded-sm min-w-0 min-h-0 text-[clamp(10px,min(2.5vw,2.5vh),20px)] transition-colors duration-100 ${bgColor}`}
      onClick={() => onReveal(r, c)}
      onContextMenu={handleContextMenu}
      disabled={cell.revealed || gameOver}
    >
      {content}
    </button>
  );
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: "🟢 Easy",
  intermediate: "🟡 Medium",
  expert: "🔴 Hard",
};

export default function MinesweeperApp() {
  const [levelKey, setLevelKey] = useState<string>("beginner");
  const g = useMinesweeperGame(levelKey);

  const flagCount = g.grid.flat().filter((c) => c.flagged).length;

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
          <span>💣 {g.config.mines - flagCount}</span>
          <span>{fmt(g.time)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={g.resetGame} className="h-6 px-1.5">
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      {/* Level selector */}
      <div className="flex items-center justify-center gap-1 pb-1 shrink-0">
        {Object.keys(LEVELS).map((key) => (
          <Button
            key={key}
            variant={key === levelKey ? "default" : "outline"}
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setLevelKey(key)}
          >
            {LEVEL_LABELS[key]}
          </Button>
        ))}
      </div>

      {/* Game area */}
      <div className="flex-1 min-h-0 p-1">
        {g.status === "won" ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <p className="text-4xl mb-2">🏆</p>
              <p className="text-xl font-bold mb-1">You Win!</p>
              <p className="text-muted-foreground text-sm mb-4">
                Cleared in {fmt(g.time)}
              </p>
              <Button onClick={g.resetGame}>Play Again</Button>
            </div>
          </div>
        ) : g.status === "lost" ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <p className="text-4xl mb-2">💥</p>
              <p className="text-xl font-bold mb-1">Game Over!</p>
              <p className="text-muted-foreground text-sm mb-4">
                Better luck next time
              </p>
              <Button onClick={g.resetGame}>Try Again</Button>
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
            {g.grid.map((row, r) =>
              row.map((cell, c) => (
                <CellButton
                  key={`${r}-${c}`}
                  cell={cell}
                  r={r}
                  c={c}
                  gameOver={g.status !== "playing"}
                  onReveal={g.revealCell}
                  onToggleFlag={g.toggleFlag}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}