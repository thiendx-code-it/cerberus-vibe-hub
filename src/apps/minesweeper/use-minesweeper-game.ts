import { useState, useEffect, useCallback } from "react";

export type Cell = {
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  neighborMines: number;
};

export type GameStatus = "playing" | "won" | "lost";

export interface MinesweeperConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const LEVELS: Record<string, MinesweeperConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

export function useMinesweeperGame(levelKey: string = "beginner") {
  const config = LEVELS[levelKey];
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const initGrid = useCallback(() => {
    const newGrid: Cell[][] = Array.from({ length: config.rows }, () =>
      Array.from({ length: config.cols }, () => ({
        isMine: false,
        revealed: false,
        flagged: false,
        neighborMines: 0,
      }))
    );
    setGrid(newGrid);
    setStatus("playing");
    setTime(0);
    setGameStarted(false);
  }, [config]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  useEffect(() => {
    if (gameStarted && status === "playing") {
      const interval = setInterval(() => setTime((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, status]);

  const generateMines = (firstRevealR: number, firstRevealC: number, currentGrid: Cell[][]) => {
    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;

    while (minesPlaced < config.mines) {
      const r = Math.floor(Math.random() * config.rows);
      const c = Math.floor(Math.random() * config.cols);

      // Don't place mine on the first clicked cell or already occupied mine
      if ((r === firstRevealR && c === firstRevealC) || newGrid[r][c].isMine) continue;

      newGrid[r][c].isMine = true;
      minesPlaced++;
    }

    // Calculate neighbor counts
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols && newGrid[nr][nc].isMine) {
              count++;
            }
          }
        }
        newGrid[r][c].neighborMines = count;
      }
    }
    return newGrid;
  };

  const revealCell = (r: number, c: number) => {
    if (status !== "playing" || grid[r][c].flagged) return;

    let currentGrid = grid;
    if (!gameStarted) {
      setGameStarted(true);
      currentGrid = generateMines(r, c, grid);
    }

    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));

    if (newGrid[r][c].isMine) {
      // Game Over - reveal all mines
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.revealed = true;
      }));
      setGrid(newGrid);
      setStatus("lost");
      return;
    }

    // Flood fill reveal
    const stack: [number, number][] = [[r, c]];
    while (stack.length > 0) {
      const [currR, currC] = stack.pop()!;
      if (newGrid[currR][currC].revealed || newGrid[currR][currC].flagged) continue;

      newGrid[currR][currC].revealed = true;

      if (newGrid[currR][currC].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols && !newGrid[nr][nc].revealed) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }

    setGrid(newGrid);
    checkWin(newGrid);
  };

  const toggleFlag = (r: number, c: number) => {
    if (status !== "playing" || grid[r][c].revealed) return;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].flagged = !newGrid[r][c].flagged;
    setGrid(newGrid);
  };

  const checkWin = (currentGrid: Cell[][]) => {
    const allSafeRevealed = currentGrid.every(row =>
      row.every(cell => cell.isMine || cell.revealed)
    );
    if (allSafeRevealed) {
      setStatus("won");
    }
  };

  return {
    grid, status, time, gameStarted, config,
    revealCell, toggleFlag, resetGame: initGrid
  };
}