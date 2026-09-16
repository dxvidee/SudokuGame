import { getSudoku } from 'sudoku-gen';

export type Grid = number[][];
export type Difficulty = 'Facile' | 'Medio' | 'Difficile' | 'Esperto';

export const BLANK = 0;

// Helper per convertire la stringa di 81 caratteri di sudoku-gen in una matrice 9x9
const stringToGrid = (str: string): Grid => {
  const grid: Grid = [];
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      const char = str[i * 9 + j];
      row.push(char === '-' ? BLANK : parseInt(char, 10));
    }
    grid.push(row);
  }
  return grid;
};

// Genera il puzzle e restituisce puzzle e soluzione
export const generatePuzzle = (difficulty: Difficulty): { puzzle: Grid, solution: Grid } => {
  let libDiff: 'easy' | 'medium' | 'hard' | 'expert' = 'easy';
  switch (difficulty) {
    case 'Facile': libDiff = 'easy'; break;
    case 'Medio': libDiff = 'medium'; break;
    case 'Difficile': libDiff = 'hard'; break;
    case 'Esperto': libDiff = 'expert'; break;
  }

  // La libreria sudoku-gen genera i puzzle basandosi ESATTAMENTE 
  // sulle tecniche logiche umane richieste per risolverlo.
  const generated = getSudoku(libDiff);

  return {
    puzzle: stringToGrid(generated.puzzle),
    solution: stringToGrid(generated.solution),
  };
};

// Manteniamo le funzioni di validazione manuale che ci serviranno 
// nel Task 7 per controllare le mosse dell'utente in tempo reale
export const isValid = (grid: Grid, row: number, col: number, num: number): boolean => {
  if (num === BLANK) return true;
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};
