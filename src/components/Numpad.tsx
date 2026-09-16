import React from 'react';

interface NumpadProps {
  onNumberClick: (num: number) => void;
  selectedNumber: number | null;
  numberCounts?: Record<number, number>;
}

export const Numpad: React.FC<NumpadProps> = ({ onNumberClick, selectedNumber, numberCounts = {} }) => {
  const topRow = [1, 2, 3, 4, 5];
  const bottomRow = [6, 7, 8, 9];

  const getButtonClass = (num: number) => {
    const base = "w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center rounded-full transition-all border border-gray-200/50 flex-none active:scale-95 ";
    if (selectedNumber === num) {
      return base + "bg-[#f0ad25] text-white scale-110 shadow-sm border-[#f0ad25] active:scale-100";
    }
    return base + "bg-transparent text-gray-700 hover:bg-gray-100 hover:border-gray-300";
  };

  const renderNumber = (num: number) => {
    const count = numberCounts[num] || 0;
    const remaining = 9 - count;
    return (
      <div key={num} className="flex flex-col items-center">
        <button 
          onClick={() => onNumberClick(num)}
          className={getButtonClass(num)}
        >
          <span className="text-2xl md:text-3xl font-bold leading-none">{num}</span>
        </button>
        <span className={`text-[10px] md:text-xs font-semibold mt-1 transition-all ${selectedNumber === num ? 'text-[#f0ad25] scale-110' : 'text-gray-400'} ${remaining <= 0 ? 'opacity-0 scale-75' : ''}`}>
          {remaining}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 md:gap-4 mt-4 md:mt-6 w-full">
      <div className="flex justify-center w-full gap-3 md:gap-6">
        {topRow.map(renderNumber)}
      </div>
      <div className="flex justify-center w-full gap-3 md:gap-6">
        {bottomRow.map(renderNumber)}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => onNumberClick(0)}
            className={`w-12 h-12 md:w-14 md:h-14 flex-none flex items-center justify-center rounded-full text-2xl md:text-3xl font-bold transition-all border active:scale-95 ${
              selectedNumber === 0 
                ? 'bg-red-500 text-white scale-110 shadow-sm border-red-500 active:scale-100' 
                : 'bg-transparent text-gray-400 border-gray-200/50 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            }`}
          >
            X
          </button>
          <span className="text-[10px] md:text-xs mt-1 opacity-0 pointer-events-none">0</span>
        </div>
      </div>
    </div>
  );
};
