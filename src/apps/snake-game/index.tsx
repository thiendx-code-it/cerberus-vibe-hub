import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLS = 20;
const ROWS = 20;
const CELL = 20; // px
const SPEEDS: Record<string, number> = { Easy: 180, Normal: 110, Hard: 60 };

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pos = { x: number; y: number };
type Phase = "idle" | "playing" | "over";

function randomPos(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

const INIT_SNAKE: Pos[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export default function SnakeGameApp() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [snake, setSnake] = useState<Pos[]>(INIT_SNAKE);
  const [food, setFood] = useState<Pos>({ x: 15, y: 10 });
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("snake-best") ?? 0));
  const [difficulty, setDifficulty] = useState<"Easy" | "Normal" | "Hard">("Normal");
  const pendingDir = useRef<Dir>("RIGHT");
  const snakeRef = useRef(snake);
  const dirRef = useRef<Dir>("RIGHT");
  const foodRef = useRef(food);

  snakeRef.current = snake;
  dirRef.current = dir;
  foodRef.current = food;

  const reset = useCallback(() => {
    const initSnake = [...INIT_SNAKE];
    setSnake(initSnake);
    setDir("RIGHT");
    pendingDir.current = "RIGHT";
    setFood(randomPos(initSnake));
    setScore(0);
    setPhase("idle");
  }, []);

  const step = useCallback(() => {
    const currentSnake = snakeRef.current;
    const currentDir = pendingDir.current;
    dirRef.current = currentDir;

    const head = currentSnake[0];
    const next: Pos =
      currentDir === "UP" ? { x: head.x, y: head.y - 1 } :
      currentDir === "DOWN" ? { x: head.x, y: head.y + 1 } :
      currentDir === "LEFT" ? { x: head.x - 1, y: head.y } :
      { x: head.x + 1, y: head.y };

    // Wall collision
    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      setPhase("over");
      return;
    }
    // Self collision (skip tail — it will move)
    if (currentSnake.slice(0, -1).some((s) => s.x === next.x && s.y === next.y)) {
      setPhase("over");
      return;
    }

    const ate = next.x === foodRef.current.x && next.y === foodRef.current.y;
    const newSnake = ate ? [next, ...currentSnake] : [next, ...currentSnake.slice(0, -1)];

    setSnake(newSnake);
    setDir(currentDir);

    if (ate) {
      const newFood = randomPos(newSnake);
      setFood(newFood);
      setScore((s) => {
        const next = s + 10;
        setBest((b) => {
          const nb = Math.max(b, next);
          localStorage.setItem("snake-best", String(nb));
          return nb;
        });
        return next;
      });
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(step, SPEEDS[difficulty]);
    return () => clearInterval(id);
  }, [phase, difficulty, step]);

  // Keyboard controls
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
      };
      const next = map[e.key];
      if (!next) return;

      // Prevent 180° reversal
      const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (next !== opposite[dirRef.current]) {
        pendingDir.current = next;
      }

      if (phase === "idle") {
        setPhase("playing");
      }

      // Prevent page scroll
      if (e.key.startsWith("Arrow")) e.preventDefault();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [phase]);

  // Mobile swipe controls
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    let next: Dir | null = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      next = dx > 0 ? "RIGHT" : "LEFT";
    } else if (Math.abs(dy) > 10) {
      next = dy > 0 ? "DOWN" : "UP";
    }
    if (next && next !== opposite[dirRef.current]) {
      pendingDir.current = next;
      if (phase === "idle") setPhase("playing");
    }
    touchStart.current = null;
  };

  const dirBtn = (d: Dir, label: string) => (
    <button
      aria-label={d}
      onPointerDown={(e) => {
        e.preventDefault();
        const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
        if (d !== opposite[dirRef.current]) pendingDir.current = d;
        if (phase === "idle") setPhase("playing");
      }}
      className="w-12 h-12 rounded-lg bg-secondary hover:bg-secondary/80 active:scale-95 flex items-center justify-center text-xl font-bold select-none touch-none transition-transform"
    >
      {label}
    </button>
  );

  return (
    <div className="container py-8 max-w-lg mx-auto select-none">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Button>
      </Link>

      <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
        <h1 className="font-display text-2xl font-bold text-primary">Snake Game</h1>

        {/* Score + Best */}
        <div className="flex gap-8 text-sm">
          <div className="text-center">
            <div className="text-muted-foreground">Score</div>
            <div className="font-display text-xl font-bold">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Best</div>
            <div className="font-display text-xl font-bold text-primary">{best}</div>
          </div>
        </div>

        {/* Difficulty selector (only when idle/over) */}
        {phase !== "playing" && (
          <div className="flex gap-2">
            {(["Easy", "Normal", "Hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={[
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                  difficulty === d
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                ].join(" ")}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Game board */}
        <div
          className="relative border border-border rounded-lg overflow-hidden"
          style={{ width: COLS * CELL, height: ROWS * CELL, background: "hsl(var(--card))" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Grid lines (subtle) */}
          <svg
            className="absolute inset-0 opacity-10 pointer-events-none"
            width={COLS * CELL}
            height={ROWS * CELL}
          >
            {Array.from({ length: COLS + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={ROWS * CELL} stroke="currentColor" strokeWidth={0.5} />
            ))}
            {Array.from({ length: ROWS + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * CELL} x2={COLS * CELL} y2={i * CELL} stroke="currentColor" strokeWidth={0.5} />
            ))}
          </svg>

          {/* Snake */}
          {snake.map((seg, i) => (
            <div
              key={i}
              className="absolute rounded-sm transition-none"
              style={{
                left: seg.x * CELL + 1,
                top: seg.y * CELL + 1,
                width: CELL - 2,
                height: CELL - 2,
                background: i === 0 ? "hsl(var(--primary))" : `hsl(347 ${Math.max(30, 77 - i * 2)}% ${Math.max(35, 50 - i)}%)`,
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              left: food.x * CELL + 2,
              top: food.y * CELL + 2,
              width: CELL - 4,
              height: CELL - 4,
              background: "hsl(180 100% 60%)",
              boxShadow: "0 0 8px hsl(180 100% 60%)",
            }}
          />

          {/* Overlay: idle */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm gap-3">
              <Play className="h-10 w-10 text-primary" />
              <p className="text-sm text-muted-foreground">Press an arrow key or tap to start</p>
            </div>
          )}

          {/* Overlay: game over */}
          {phase === "over" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm gap-3">
              <p className="font-display text-2xl font-bold text-destructive">Game Over</p>
              <p className="text-muted-foreground text-sm">Score: {score}</p>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <RotateCcw className="h-4 w-4" /> Play Again
              </button>
            </div>
          )}
        </div>

        {/* Mobile D-pad */}
        <div className="flex flex-col items-center gap-1 md:hidden">
          <div>{dirBtn("UP", "▲")}</div>
          <div className="flex gap-1">
            {dirBtn("LEFT", "◀")}
            {dirBtn("DOWN", "▼")}
            {dirBtn("RIGHT", "▶")}
          </div>
        </div>

        <p className="text-xs text-muted-foreground hidden md:block">Arrow keys / WASD to control</p>
      </div>
    </div>
  );
}
