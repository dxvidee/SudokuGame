import React, { useState, useEffect } from 'react';
import { Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react';

type Difficulty = 'Facile' | 'Medio' | 'Difficile' | 'Esperto';

interface HomeProps {
  onPlay: (difficulty: Difficulty) => void;
  onResumeGame?: (difficulty: Difficulty) => void;
  activeGames: Record<Difficulty, boolean>;
}

export const Home: React.FC<HomeProps> = ({ onPlay, onResumeGame, activeGames }) => {
  const difficulties: Difficulty[] = ['Facile', 'Medio', 'Difficile', 'Esperto'];
  const [diffIndex, setDiffIndex] = useState(1); // Parte da Medio
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');

  const handlePrev = () => {
    setSlideDir('right');
    setDiffIndex((prev) => (prev > 0 ? prev - 1 : difficulties.length - 1));
  };

  const handleNext = () => {
    setSlideDir('left');
    setDiffIndex((prev) => (prev < difficulties.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSlideDir('right');
        setDiffIndex((prev) => (prev > 0 ? prev - 1 : difficulties.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSlideDir('left');
        setDiffIndex((prev) => (prev < difficulties.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        const diff = difficulties[diffIndex];
        if (activeGames[diff] && onResumeGame) {
          onResumeGame(diff);
        } else {
          onPlay(diff);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [diffIndex, activeGames, onPlay, onResumeGame]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full bg-[#f4f2eb] dark:bg-zinc-900 px-4 transition-colors duration-300">
      <div className="flex flex-col items-center gap-5 md:gap-8 w-full max-w-[340px] md:max-w-[400px]">
        
        {/* Icona Griglia Centrale */}
        <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] bg-[#f0ad25]/20 dark:bg-[#f0ad25]/10 rounded-3xl flex items-center justify-center mb-2 md:mb-4 transition-all">
          <Grid3X3 size={44} className="text-[#f0ad25] w-12 h-12 md:w-16 md:h-16 transition-all" strokeWidth={1.5} />
        </div>

        <p className="text-gray-800 dark:text-zinc-300 font-bold text-sm md:text-base transition-colors">Scegli la difficoltà</p>

        {/* Selettore Difficoltà */}
        <div className="flex items-center justify-between w-full h-[52px] md:h-[60px] bg-white dark:bg-zinc-800 rounded-full px-4 md:px-6 shadow-sm border border-gray-100/50 dark:border-zinc-700 transition-all duration-300">
          <button onClick={handlePrev} className="p-1 text-[#f0ad25] hover:bg-[#f4f2eb] dark:hover:bg-zinc-700 rounded-full transition-all active:scale-75">
            <ChevronLeft size={24} className="md:w-6 md:h-6" strokeWidth={3} />
          </button>
          
          <div className="overflow-hidden h-full flex items-center justify-center">
            <span key={diffIndex} className={`font-bold text-gray-900 dark:text-zinc-100 text-[15px] md:text-lg ${slideDir === 'left' ? 'animate-slide-left' : 'animate-slide-right'}`}>
              {difficulties[diffIndex]}
            </span>
          </div>

          <button onClick={handleNext} className="p-1 text-[#f0ad25] hover:bg-[#f4f2eb] dark:hover:bg-zinc-700 rounded-full transition-all active:scale-75">
            <ChevronRight size={24} className="md:w-6 md:h-6" strokeWidth={3} />
          </button>
        </div>

        {/* Container fisso per i bottoni per evitare salti di layout */}
        <div className="w-full flex flex-col gap-4 min-h-[120px] md:min-h-[136px] mt-2">
          {/* Bottone Principale */}
          <button 
            onClick={() => onPlay(difficulties[diffIndex])}
            className="w-full h-[52px] md:h-[60px] flex-none bg-[#f0ad25] hover:bg-[#d99c21] text-white font-bold rounded-full shadow-sm transition-all active:scale-[0.97] text-[15px] md:text-lg"
          >
            {activeGames[difficulties[diffIndex]] ? 'Nuova Partita' : 'Gioca'}
          </button>
          
          {/* Bottone Riprendi Partita (animato in entrata) */}
          {activeGames[difficulties[diffIndex]] && onResumeGame && (
            <button 
              onClick={() => onResumeGame(difficulties[diffIndex])}
              className="w-full h-[52px] md:h-[60px] flex-none bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-[#f0ad25] font-bold rounded-full shadow-sm border-2 border-[#f0ad25] transition-all duration-300 active:scale-[0.97] text-[15px] md:text-lg animate-pop-in"
            >
              Riprendi Partita
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
