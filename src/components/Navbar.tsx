
import { Play, HelpCircle, Calendar } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="w-full h-16 md:h-20 bg-[#e5e5e5] flex items-center justify-between px-4 md:px-12 transition-all">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#f0ad25] flex items-center justify-center text-white font-bold text-base md:text-lg">
          9
        </div>
        <span className="text-xl font-medium text-gray-800">SudokuGame</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#f0ad25] hover:bg-gray-50 transition-colors shadow-sm">
          <Play size={20} strokeWidth={2.5} />
        </button>
        <button className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#f0ad25] hover:bg-gray-50 transition-colors shadow-sm">
          <HelpCircle size={20} strokeWidth={2.5} />
        </button>
        <button className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#f0ad25] hover:bg-gray-50 transition-colors shadow-sm">
          <Calendar size={20} strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
};
