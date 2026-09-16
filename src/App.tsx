import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { useSudoku } from './hooks/useSudoku';
import type { Difficulty } from './utils/sudokuLogic';

function App() {
  const [view, setView] = useState<'home' | 'game'>('home');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | null>(null);

  // Instanziamo 4 hook di stato, uno per ogni difficoltà!
  const stateFacile = useSudoku('sudoku-facile');
  const stateMedio = useSudoku('sudoku-medio');
  const stateDifficile = useSudoku('sudoku-difficile');
  const stateEsperto = useSudoku('sudoku-esperto');

  const getSudokuState = (diff: Difficulty) => {
    switch (diff) {
      case 'Facile': return stateFacile;
      case 'Medio': return stateMedio;
      case 'Difficile': return stateDifficile;
      case 'Esperto': return stateEsperto;
    }
  };

  const handleStartGame = (difficulty: Difficulty) => {
    getSudokuState(difficulty).startNewGame(difficulty);
    setActiveDifficulty(difficulty);
    setView('game');
  };

  const handleResumeGame = (difficulty: Difficulty) => {
    getSudokuState(difficulty).setIsPlaying(true);
    setActiveDifficulty(difficulty);
    setView('game');
  };

  const handleBackToHome = () => {
    if (activeDifficulty) {
      getSudokuState(activeDifficulty).setIsPlaying(false);
    }
    setView('home');
  };

  const activeGames: Record<Difficulty, boolean> = {
    Facile: stateFacile.difficulty !== null && !stateFacile.isWon,
    Medio: stateMedio.difficulty !== null && !stateMedio.isWon,
    Difficile: stateDifficile.difficulty !== null && !stateDifficile.isWon,
    Esperto: stateEsperto.difficulty !== null && !stateEsperto.isWon,
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f2eb] dark:bg-zinc-900 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      {view === 'home' ? (
        <Home 
          onPlay={handleStartGame} 
          onResumeGame={handleResumeGame} 
          activeGames={activeGames}
        />
      ) : activeDifficulty ? (
        <Game onBack={handleBackToHome} sudokuState={getSudokuState(activeDifficulty)} />
      ) : null}
    </div>
  );
}

export default App;
// Test push per l'utente 
