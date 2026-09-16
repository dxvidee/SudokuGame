import React, { useState, useRef, useEffect } from 'react';
import { Undo2, Pencil, Lightbulb, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ToolbarProps {
  onUndo: () => void;
  onReset: () => void;
  onNotesToggle: () => void;
  onHint: () => void;
  onVerify: () => void;
  onAutoNotes: () => void;
  notesActive: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onUndo, onReset, onNotesToggle, onHint, onVerify, onAutoNotes, notesActive }) => {
  const [showHintMenu, setShowHintMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowHintMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 mb-6 w-full max-w-[500px]">
      <button onClick={onUndo} className="flex flex-col items-center justify-center group active:scale-90 transition-all" title="Annulla">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#f8f6f0] flex items-center justify-center text-[#f0ad25] group-hover:bg-[#f0ad25] group-hover:text-white transition-colors">
          <Undo2 size={24} strokeWidth={2.5} />
        </div>
      </button>

      <div className="relative" ref={menuRef}>
        <button onClick={() => setShowHintMenu(!showHintMenu)} className="flex flex-col items-center justify-center group relative active:scale-90 transition-all" title="Suggerimenti">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#f8f6f0] flex items-center justify-center text-[#f0ad25] group-hover:bg-[#f0ad25] group-hover:text-white transition-colors">
            <Lightbulb size={24} strokeWidth={2.5} />
          </div>
        </button>

        {showHintMenu && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 flex flex-col gap-1 animate-pop-in">
            <button 
              onClick={() => { onHint(); setShowHintMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#f8f6f0] hover:text-[#f0ad25] rounded-xl transition-colors text-left"
            >
              <Lightbulb size={18} />
              <span>Suggerisci inserimento</span>
            </button>
            <button 
              onClick={() => { onVerify(); setShowHintMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#f8f6f0] hover:text-[#f0ad25] rounded-xl transition-colors text-left"
            >
              <Check size={18} />
              <span>Verifica errori</span>
            </button>
            <button 
              onClick={() => { onAutoNotes(); setShowHintMenu(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#f8f6f0] hover:text-[#f0ad25] rounded-xl transition-colors text-left"
            >
              <Sparkles size={18} />
              <span>Auto-Note</span>
            </button>
          </div>
        )}
      </div>

      <button onClick={onNotesToggle} className="flex flex-col items-center justify-center group active:scale-90 transition-all" title="Appunti">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-colors ${notesActive ? 'bg-[#f0ad25] text-white' : 'bg-[#f8f6f0] text-[#f0ad25] group-hover:bg-[#f0ad25] group-hover:text-white'}`}>
          <Pencil size={24} strokeWidth={2.5} />
        </div>
      </button>
      
      <button onClick={onReset} className="flex flex-col items-center justify-center group active:scale-90 transition-all" title="Ricomincia">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#f8f6f0] flex items-center justify-center text-[#f0ad25] group-hover:bg-[#f0ad25] group-hover:text-white transition-colors">
          <RotateCcw size={24} strokeWidth={2.5} />
        </div>
      </button>

    </div>
  );
};
