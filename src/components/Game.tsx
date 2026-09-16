import React, { useEffect } from 'react';
import { Grid as GridComponent } from './Grid';
import { Toolbar } from './Toolbar';
import { Numpad } from './Numpad';
import { useSudoku } from '../hooks/useSudoku';

import { ArrowLeft, Trophy, Check, RotateCcw } from 'lucide-react';

interface GameProps {
  onBack: () => void;
  sudokuState: ReturnType<typeof useSudoku>;
}

export const Game: React.FC<GameProps> = ({ onBack, sudokuState }) => {
  const [selectedNumber, setSelectedNumber] = React.useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const {
    difficulty,
    elapsedTime,
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
    hint,
    verifyErrors,
    autoNotes,
    errorCells,
    isWon
  } = sudokuState;

  const [victoryDate, setVictoryDate] = React.useState<Date | null>(null);

  useEffect(() => {
    if (isWon && !victoryDate) {
      setVictoryDate(new Date());
    }
  }, [isWon, victoryDate]);

  const handleSelectNumber = React.useCallback((num: number) => {
    if (selectedCell) {
      if (num === 0) {
        deleteCell();
      } else {
        insertNumber(num);
      }
    } else {
      setSelectedNumber(prev => (prev === num ? null : num));
    }
  }, [selectedCell, insertNumber, deleteCell]);

  const handleCellClick = React.useCallback((r: number, c: number) => {
    if (selectedNumber !== null) {
      if (selectedNumber === 0) {
        deleteCell(r, c);
      } else {
        // Se il numero è già presente in quella cella, lo rimuove (toggle)
        if (currentGrid[r][c] === selectedNumber) {
          deleteCell(r, c);
        } else {
          insertNumber(selectedNumber, r, c);
        }
      }
    } else {
      if (selectedCell?.[0] === r && selectedCell?.[1] === c) {
        setSelectedCell(null);
      } else {
        setSelectedCell([r, c]);
      }
    }
  }, [selectedNumber, selectedCell, currentGrid, insertNumber, deleteCell, setSelectedCell]);

  const handleRightClick = React.useCallback((row: number, col: number) => {
    // Non selezioniamo la cella per non mostrare il cerchio vuoto della selezione
    deleteCell(row, col);
  }, [deleteCell]);

  const handleMouse3 = React.useCallback((row: number, col: number) => {
    if (selectedNumber !== null && selectedNumber !== 0) {
      insertNumber(selectedNumber, row, col, true);
    } else {
      setNotesMode(prev => !prev);
    }
  }, [selectedNumber, setNotesMode, insertNumber]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResetConfirm) return; // Disabilita tastiera se c'è il modale
      
      if (e.key === 'Escape') {
        onBack();
        return;
      }
      if (e.key >= '1' && e.key <= '9') {
        handleSelectNumber(parseInt(e.key, 10));
        return;
      }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key.toLowerCase() === 'x') {
        handleSelectNumber(0);
        return;
      }
    };
    
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (e.button === 1) { // 1 = Rotellina / Mouse3
        e.preventDefault(); // Previene l'auto-scroll del browser
        // Se si clicca fuori dalla griglia con la rotellina e non c'è un numero, toggla gli appunti
        if (selectedNumber === null || selectedNumber === 0) {
          setNotesMode(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleGlobalMouseDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleGlobalMouseDown);
    };
  }, [showResetConfirm, onBack, handleSelectNumber, selectedNumber, setNotesMode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const [showToast, setShowToast] = React.useState(false);

  const handleVerify = React.useCallback(() => {
    const hasErrors = verifyErrors();
    if (!hasErrors) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [verifyErrors]);

  const activeNumber = selectedNumber !== null ? selectedNumber : 
    (selectedCell && currentGrid[selectedCell[0]][selectedCell[1]] !== 0 ? currentGrid[selectedCell[0]][selectedCell[1]] : null);

  const numberCounts = React.useMemo(() => {
    const counts: Record<number, number> = {};
    if (!currentGrid || currentGrid.length === 0) return counts;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = currentGrid[r][c];
        if (val !== 0) {
          counts[val] = (counts[val] || 0) + 1;
        }
      }
    }
    return counts;
  }, [currentGrid]);

  if (!initialGrid || initialGrid.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-[#f0ad25] font-bold">Generazione Sudoku...</div>;
  }

  return (
    <div className="flex flex-col items-center flex-1 w-full bg-[#f4f2eb] dark:bg-zinc-900 px-4 py-6 relative transition-colors duration-300">
      
      {/* Toast Nessun Errore */}
      <div 
        className={`fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 transition-all duration-300 font-medium ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <Check size={20} className="text-[#f0ad25]" strokeWidth={3} />
        Nessun errore trovato
      </div>

      {/* Modale Conferma Reset */}
      {showResetConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4 backdrop-blur-sm animate-pop-in">
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center border border-transparent dark:border-zinc-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <RotateCcw size={32} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-zinc-100 mb-2">Riavviare?</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-8">Vuoi davvero ricominciare da capo? Tutti i progressi attuali andranno persi.</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl font-bold bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              >
                Annulla
              </button>
              <button 
                onClick={() => { reset(); setShowResetConfirm(false); setVictoryDate(null); }}
                className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors active:scale-95"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Vittoria */}
      {isWon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center animate-pop-in border border-transparent dark:border-zinc-700">
            <div className="w-20 h-20 bg-[#f0ad25]/20 dark:bg-[#f0ad25]/10 rounded-full flex items-center justify-center mb-4">
              <Trophy size={40} className="text-[#f0ad25]" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-zinc-100 mb-2">Vittoria!</h3>
            <p className="text-gray-500 dark:text-zinc-400 mb-6">Hai completato con successo il Sudoku a livello <span className="font-bold text-[#f0ad25] uppercase">{difficulty}</span>.</p>
            
            <div className="bg-gray-50 dark:bg-zinc-900/50 w-full rounded-2xl p-4 mb-6 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 dark:text-zinc-500">Tempo Impiegato</span>
                <span className="text-gray-800 dark:text-zinc-200 text-lg">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 dark:text-zinc-500">Data</span>
                <span className="text-gray-800 dark:text-zinc-200">
                  {victoryDate?.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={() => { reset(); setVictoryDate(null); }} 
                className="flex-1 py-4 rounded-xl font-bold bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              >
                Rigioca
              </button>
              <button 
                onClick={onBack} 
                className="flex-1 py-4 rounded-xl font-bold bg-[#f0ad25] text-white hover:bg-[#d99c21] transition-colors shadow-md"
              >
                Continua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Partita */}
      <div className="w-full max-w-[500px] flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-gray-800 dark:text-zinc-200 hover:text-gray-500 dark:hover:text-zinc-400 group transition-colors"
          title="Torna alla Home"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg md:text-xl font-bold uppercase tracking-wide">{difficulty}</span>
        </button>
        <div className="ml-auto flex items-center justify-center">
          <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 bg-gray-100/80 dark:bg-zinc-800/80 px-3 py-1 rounded-full shadow-sm transition-colors duration-300">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      <Toolbar 
        onUndo={undo}
        onReset={() => setShowResetConfirm(true)}
        onNotesToggle={() => setNotesMode(!notesMode)}
        onHint={hint}
        onVerify={handleVerify}
        onAutoNotes={autoNotes}
        notesActive={notesMode}
      />

      <GridComponent 
        initialGrid={initialGrid} 
        currentGrid={currentGrid} 
        selectedCell={selectedCell} 
        activeNumber={activeNumber}
        onCellClick={handleCellClick}
        onCellContextMenu={handleRightClick}
        onCellAuxClick={handleMouse3}
        notes={notes} 
        errorCells={errorCells}
      />

      <Numpad 
        onNumberClick={handleSelectNumber}
        selectedNumber={selectedNumber}
        numberCounts={numberCounts}
      />
    </div>
  );
};
