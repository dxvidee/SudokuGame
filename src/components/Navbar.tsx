import React, { useState, useEffect } from 'react';
import { Play, HelpCircle, Calendar, Moon, Sun } from 'lucide-react';

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <nav className="w-full h-16 md:h-20 bg-[#e5e5e5] dark:bg-zinc-950 flex items-center justify-between px-4 md:px-12 transition-colors duration-300">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#f0ad25] flex items-center justify-center text-white font-bold text-base md:text-lg">
          9
        </div>
        <span className="text-xl font-medium text-gray-800 dark:text-zinc-100 transition-colors">SudokuGame</span>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleTheme}
          className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-[#f0ad25] hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
          title={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
        >
          {isDark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
        </button>

        <button className="w-11 h-11 hidden md:flex rounded-xl bg-white dark:bg-zinc-800 items-center justify-center text-[#f0ad25] hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
          <Play size={20} strokeWidth={2.5} />
        </button>
        <button className="w-11 h-11 hidden md:flex rounded-xl bg-white dark:bg-zinc-800 items-center justify-center text-[#f0ad25] hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
          <HelpCircle size={20} strokeWidth={2.5} />
        </button>
        <button className="w-11 h-11 hidden md:flex rounded-xl bg-white dark:bg-zinc-800 items-center justify-center text-[#f0ad25] hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
          <Calendar size={20} strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
};
