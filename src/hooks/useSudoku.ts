import { useState, useCallback, useEffect } from 'react';
import { BLANK, isValid, generatePuzzle } from '../utils/sudokuLogic';
import type { Grid as GridType, Difficulty } from '../utils/sudokuLogic';

export interface GameSnapshot {
  grid: GridType;
  notes: Record<string, number[]>;
}

export const useSudoku = (storageKey: string) => {
  const getInitialState = () => {
    try {
      const item = window.localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  };

  const initialState = getInitialState();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(initialState?.difficulty || null);
  const [initialGrid, setInitialGrid] = useState<GridType>(initialState?.initialGrid || []);
  const [solution, setSolution] = useState<GridType>(initialState?.solution || []);
  
  const [currentGrid, setCurrentGrid] = useState<GridType>(initialState?.currentGrid || []);
  const [notes, setNotes] = useState<Record<string, number[]>>(initialState?.notes || {});
  const [history, setHistory] = useState<GameSnapshot[]>(initialState?.history || []);
  const [errorCells, setErrorCells] = useState<Record<string, boolean>>(initialState?.errorCells || {});
  const [hintsRemaining, setHintsRemaining] = useState<number>(initialState?.hintsRemaining ?? 3);
  const [elapsedTime, setElapsedTime] = useState<number>(initialState?.elapsedTime || 0);

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Salvataggio automatico ad ogni cambiamento
  useEffect(() => {
    if (difficulty) {
      const stateToSave = {
        difficulty,
        initialGrid,
        solution,
        currentGrid,
        notes,
        history,
        errorCells,
        hintsRemaining,
        elapsedTime
      };
      window.localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }
  }, [storageKey, difficulty, initialGrid, solution, currentGrid, notes, history, errorCells, hintsRemaining, elapsedTime]);

  const startNewGame = useCallback((newDifficulty: Difficulty) => {
    const puzzleData = generatePuzzle(newDifficulty);
    setDifficulty(newDifficulty);
    setInitialGrid(puzzleData.puzzle);
    setSolution(puzzleData.solution);
    setCurrentGrid(JSON.parse(JSON.stringify(puzzleData.puzzle)));
    
    // Reset all states
    setNotes({});
    setSelectedCell(null);
    setHistory([]);
    setErrorCells({});
    setHintsRemaining(3);
    setNotesMode(false);
    setElapsedTime(0);
    setIsPlaying(true);
  }, []);

  const saveStateToHistory = () => {
    setHistory(prev => [...prev, {
      grid: JSON.parse(JSON.stringify(currentGrid)),
      notes: JSON.parse(JSON.stringify(notes))
    }]);
  };

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setCurrentGrid(previousState.grid);
    setNotes(previousState.notes);
    setHistory(prev => prev.slice(0, -1));
    setErrorCells({}); // Pulisce gli errori visualizzati
  }, [history]);

  const removeNoteFromRelatedCells = (row: number, col: number, num: number, currentNotes: Record<string, number[]>) => {
    const newNotes = { ...currentNotes };
    
    // Rimuovi dalla riga e colonna
    for (let i = 0; i < 9; i++) {
      const rKey = `${row}-${i}`;
      const cKey = `${i}-${col}`;
      if (newNotes[rKey]) newNotes[rKey] = newNotes[rKey].filter(n => n !== num);
      if (newNotes[cKey]) newNotes[cKey] = newNotes[cKey].filter(n => n !== num);
    }
    
    // Rimuovi dal blocco 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const bKey = `${startRow + i}-${startCol + j}`;
        if (newNotes[bKey]) newNotes[bKey] = newNotes[bKey].filter(n => n !== num);
      }
    }
    return newNotes;
  };

  const insertNumber = useCallback((num: number, targetRow?: number, targetCol?: number, forceNote: boolean = false) => {
    const r = targetRow !== undefined ? targetRow : selectedCell?.[0];
    const c = targetCol !== undefined ? targetCol : selectedCell?.[1];

    if (r === undefined || c === undefined) return;
    if (initialGrid[r][c] !== BLANK) return;
    
    saveStateToHistory();
    setErrorCells(prev => {
      const next = { ...prev };
      delete next[`${r}-${c}`];
      return next;
    });

    if (notesMode || forceNote) {
      // Se c'è un numero inserito manualmente, cancellalo prima di mettere l'appunto
      if (currentGrid[r][c] !== BLANK) {
        const newGrid = JSON.parse(JSON.stringify(currentGrid));
        newGrid[r][c] = BLANK;
        setCurrentGrid(newGrid);
      }

      setNotes(prev => {
        const key = `${r}-${c}`;
        const cellNotes = prev[key] || [];
        const newNotes = { ...prev };
        
        if (cellNotes.includes(num)) {
          newNotes[key] = cellNotes.filter(n => n !== num);
        } else {
          if (cellNotes.length < 8) {
            newNotes[key] = [...cellNotes, num].sort();
          }
        }
        return newNotes;
      });
    } else {
      const newGrid = JSON.parse(JSON.stringify(currentGrid));
      newGrid[r][c] = num;
      setCurrentGrid(newGrid);

      setNotes(prev => {
        let updatedNotes = removeNoteFromRelatedCells(r, c, num, prev);
        delete updatedNotes[`${r}-${c}`];
        return updatedNotes;
      });
    }
  }, [selectedCell, initialGrid, currentGrid, notesMode, notes]);

  const reset = useCallback(() => {
    saveStateToHistory();
    setCurrentGrid(JSON.parse(JSON.stringify(initialGrid)));
    setNotes({});
    setErrorCells({});
    setSelectedCell(null);
  }, [initialGrid, currentGrid, notes]);

  const deleteCell = useCallback((targetRow?: number, targetCol?: number) => {
    const r = targetRow !== undefined ? targetRow : selectedCell?.[0];
    const c = targetCol !== undefined ? targetCol : selectedCell?.[1];
    
    if (r === undefined || c === undefined) return;
    if (initialGrid[r][c] !== BLANK) return;

    saveStateToHistory();
    setErrorCells(prev => {
      const next = { ...prev };
      delete next[`${r}-${c}`];
      return next;
    });
    
    if (currentGrid[r][c] !== BLANK) {
      const newGrid = JSON.parse(JSON.stringify(currentGrid));
      newGrid[r][c] = BLANK;
      setCurrentGrid(newGrid);
    } else {
      setNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[`${r}-${c}`];
        return newNotes;
      });
    }
  }, [selectedCell, initialGrid, currentGrid, notes]);

  const verifyErrors = useCallback(() => {
    const errors: Record<string, boolean> = {};
    let hasErrors = false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = currentGrid[r][c];
        if (val !== BLANK && val !== solution[r][c]) {
          errors[`${r}-${c}`] = true;
          hasErrors = true;
        }
      }
    }
    setErrorCells(errors);
    return hasErrors;
  }, [currentGrid, solution]);

  const hint = useCallback(() => {
    let row: number, col: number;

    if (selectedCell && currentGrid[selectedCell[0]][selectedCell[1]] === BLANK) {
      [row, col] = selectedCell;
    } else {
      // Find all empty cells
      const emptyCells: [number, number][] = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentGrid[r][c] === BLANK) {
            emptyCells.push([r, c]);
          }
        }
      }
      if (emptyCells.length === 0) return; // Board full
      // Pick random empty cell
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      [row, col] = randomCell;
    }

    saveStateToHistory();
    const correctValue = solution[row][col];
    const newGrid = JSON.parse(JSON.stringify(currentGrid));
    newGrid[row][col] = correctValue;
    setCurrentGrid(newGrid);
    
    setNotes(prev => {
      let updatedNotes = removeNoteFromRelatedCells(row, col, correctValue, prev);
      delete updatedNotes[`${row}-${col}`];
      return updatedNotes;
    });

  }, [selectedCell, currentGrid, solution]);

  const autoNotes = useCallback(() => {
    saveStateToHistory();
    const newNotes: Record<string, number[]> = {};
    
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] === BLANK) {
          const validNums = [];
          for (let n = 1; n <= 9; n++) {
            if (isValid(currentGrid, r, c, n)) {
              validNums.push(n);
            }
          }
          if (validNums.length > 0) {
            newNotes[`${r}-${c}`] = validNums.slice(0, 8);
          }
        }
      }
    }
    setNotes(newNotes);
  }, [currentGrid]);

  const isWon = currentGrid.length > 0 && currentGrid.every((row, r) => row.every((cell, c) => cell === solution[r][c]));

  useEffect(() => {
    let interval: number;
    if (isPlaying && !isWon) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  return {
    difficulty,
    startNewGame,
    elapsedTime,
    setIsPlaying,
    initialGrid,
    currentGrid,
    notes,
    selectedCell,
    setSelectedCell,
    notesMode,
    setNotesMode,
    insertNumber,
    deleteCell,
    undo,
    reset,
    verifyErrors,
    hint,
    autoNotes,
    errorCells,
    hintsRemaining,
    canUndo: history.length > 0,
    isWon
  };
};
