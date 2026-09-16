import React from 'react';
import type { Grid as GridType } from '../utils/sudokuLogic';

interface GridProps {
  initialGrid: GridType;
  currentGrid: GridType;
  selectedCell: [number, number] | null;
  activeNumber: number | null;
  onCellClick: (row: number, col: number) => void;
  onCellContextMenu?: (row: number, col: number, e: React.MouseEvent) => void;
  onCellAuxClick?: (row: number, col: number, e: React.MouseEvent) => void;
  notes: Record<string, number[]>;
  errorCells?: Record<string, boolean>;
}

export const Grid: React.FC<GridProps> = ({ 
  initialGrid, currentGrid, selectedCell, activeNumber, onCellClick, 
  onCellContextMenu, onCellAuxClick, notes, errorCells = {} 
}) => {
  return (
    <div className="w-full max-w-[500px] aspect-square border-2 border-[#f0ad25] rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-sm flex flex-col transition-colors duration-300">
      {currentGrid.map((row, rIndex) => (
        <div key={rIndex} className={`flex flex-1 ${rIndex % 3 === 2 && rIndex !== 8 ? 'border-b-2 border-gray-300 dark:border-zinc-500' : 'border-b border-gray-100 dark:border-zinc-700'} transition-colors duration-300`}>
          {row.map((cellValue, cIndex) => {
            const isInitial = initialGrid[rIndex][cIndex] !== 0;
            const isSelected = selectedCell?.[0] === rIndex && selectedCell?.[1] === cIndex;
            const cellNotes = notes[`${rIndex}-${cIndex}`] || [];
            const isError = errorCells[`${rIndex}-${cIndex}`];
            const isOccurrence = activeNumber !== null && activeNumber !== 0 && cellValue === activeNumber;
            const isNoteOccurrence = activeNumber !== null && activeNumber !== 0 && cellValue === 0 && cellNotes.includes(activeNumber);

            return (
              <div 
                key={cIndex}
                onClick={() => onCellClick(rIndex, cIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (onCellContextMenu) onCellContextMenu(rIndex, cIndex, e);
                }}
                onMouseDown={(e) => {
                  if (e.button === 1) { // 1 = Rotellina / Mouse3
                    e.preventDefault();
                    e.stopPropagation();
                    if (onCellAuxClick) onCellAuxClick(rIndex, cIndex, e);
                  }
                }}
                className={`flex-1 flex items-center justify-center cursor-pointer relative text-xl md:text-2xl transition-colors
                  ${cIndex % 3 === 2 && cIndex !== 8 ? 'border-r-2 border-gray-300 dark:border-zinc-500' : 'border-r border-gray-100 dark:border-zinc-700'}
                  hover:bg-gray-50 dark:hover:bg-zinc-700/50
                `}
              >
                {/* Highlight per casella vuota selezionata */}
                {isSelected && cellValue === 0 && (
                  <div className="absolute flex items-center justify-center w-8 h-8 md:w-11 md:h-11 rounded-full bg-[#f4f2eb] dark:bg-zinc-600 pointer-events-none transition-colors duration-300"></div>
                )}
                
                {/* Highlight per casella con appunto corrispondente al numero selezionato */}
                {isNoteOccurrence && !isSelected && (
                  <div className="absolute flex items-center justify-center w-8 h-8 md:w-11 md:h-11 rounded-full bg-[#f4f2eb] dark:bg-zinc-600 pointer-events-none transition-colors duration-300"></div>
                )}

                {/* Cella con un numero inserito */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200
                  ${cellValue !== 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}
                `}>
                  <div className={`flex items-center justify-center w-8 h-8 md:w-11 md:h-11 rounded-full transition-colors duration-200
                    ${isError ? 'bg-red-500' : ((isSelected || isOccurrence) ? 'bg-[#f0ad25]' : (isInitial ? 'bg-[#f4f2eb] dark:bg-zinc-700' : 'bg-transparent'))}
                  `}>
                    <span className={`transition-colors duration-200
                      ${isError ? 'text-white' : ((isSelected || isOccurrence) ? 'text-[#f4f2eb] dark:text-zinc-900' : (isInitial ? 'text-[#f0ad25]' : 'text-[#333333] dark:text-zinc-200'))} 
                      ${isInitial ? 'font-bold' : 'font-medium'}
                    `}>
                      {cellValue !== 0 ? cellValue : ''}
                    </span>
                  </div>
                </div>

                {/* Cella vuota che mostra gli appunti (Note) */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-1 transition-all duration-200
                  ${cellValue === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
                `}>
                  {/* Prima riga (max 2) */}
                  {cellNotes.length > 0 && (
                    <div className="flex justify-center gap-[1px] md:gap-[3px] leading-none mb-[1px] md:mb-[2px]">
                      {cellNotes.slice(0, 2).map(n => (
                        <span key={n} className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-400 w-[7px] md:w-2 text-center animate-pop-in">{n}</span>
                      ))}
                    </div>
                  )}
                  {/* Seconda riga (max 4) */}
                  {cellNotes.length > 2 && (
                    <div className="flex justify-center gap-[1px] md:gap-[3px] leading-none mb-[1px] md:mb-[2px]">
                      {cellNotes.slice(2, 6).map(n => (
                        <span key={n} className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-400 w-[7px] md:w-2 text-center animate-pop-in">{n}</span>
                      ))}
                    </div>
                  )}
                  {/* Terza riga (max 2) */}
                  {cellNotes.length > 6 && (
                    <div className="flex justify-center gap-[1px] md:gap-[3px] leading-none">
                      {cellNotes.slice(6, 8).map(n => (
                        <span key={n} className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-400 w-[7px] md:w-2 text-center animate-pop-in">{n}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
