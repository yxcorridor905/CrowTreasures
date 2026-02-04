import React from 'react';
import { Treasure } from '../types';
import { TreasureIcon } from './TreasureIcon';
import { motion } from 'framer-motion';
import { Feather, Trash2 } from 'lucide-react';

interface TreasureCardProps {
  treasure: Treasure;
  onClose?: () => void;
  onDelete?: () => void;
}

export const TreasureCard: React.FC<TreasureCardProps> = ({ treasure, onClose, onDelete }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-sm md:max-w-md mx-auto p-1.5 bg-[#b8860b] rounded-[1rem] shadow-[0_20px_50px_-12px_rgba(184,134,11,0.25)]"
    >
      {/* Outer Border Frame (Gold) */}
      <div className="bg-[#f0e6d2] w-full h-full rounded-xl p-1 relative overflow-hidden">
        
        {/* Decorative Inner Border */}
        <div className="absolute inset-2 border-2 border-[#b8860b] opacity-30 rounded-lg pointer-events-none" />
        <div className="absolute inset-3 border border-[#b8860b] opacity-20 rounded-lg pointer-events-none" />

        {/* Card Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center p-5 md:p-6 h-full border border-[#d4c5a3] bg-[#f0e6d2]">
          
          {/* Header Decoration */}
          <div className="w-full flex justify-center items-center mb-4 opacity-60">
             <div className="h-px w-8 md:w-12 bg-[#8b4513]" />
             <div className="w-2 h-2 rotate-45 border border-[#8b4513] mx-2" />
             <div className="h-px w-8 md:w-12 bg-[#8b4513]" />
          </div>

          {/* Icon Circle */}
          <div className="relative mb-5 md:mb-6">
            <div className="absolute inset-0 bg-[#b8860b]/10 rounded-full blur-xl transform scale-150" />
            <div 
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-double border-[#b8860b] bg-[#fffaf0] flex items-center justify-center shadow-inner"
            >
              <TreasureIcon type={treasure.type} className="w-10 h-10 md:w-12 md:h-12 text-[#8b4513]" />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-display font-bold text-[#5c4033] mb-1 tracking-wide">
            {treasure.name}
          </h2>

          <div className="text-[10px] font-serif-en text-[#b8860b] tracking-[0.2em] uppercase mb-4">
            {treasure.type}
          </div>

          <p className="text-[#3e2723] font-serif text-sm md:text-base font-medium leading-relaxed italic mb-6 px-2 md:px-4 relative">
            <span className="absolute -top-3 left-0 text-3xl text-[#b8860b]/20 font-display">“</span>
            {treasure.description}
            <span className="absolute -bottom-4 right-0 text-3xl text-[#b8860b]/20 font-display">”</span>
          </p>
          
          {/* Crow's Commentary Section */}
          <div className="w-full mb-6 relative group">
            <div className="flex items-center gap-2 mb-2 justify-center opacity-70">
              <Feather className="w-3 h-3 text-[#5c4033]" />
              <span className="text-[10px] font-display text-[#5c4033] tracking-widest uppercase">乌鸦低语</span>
              <Feather className="w-3 h-3 text-[#5c4033] scale-x-[-1]" />
            </div>
            <div className="bg-[#e6dec3]/50 p-3 rounded-lg border-l-2 border-[#b8860b]/40 italic text-[#5d4037] text-sm text-left px-4 shadow-inner">
               "{treasure.crowCommentary}"
            </div>
          </div>

          {/* Original Memory */}
          <div className="w-full bg-[#e6dec3] p-3 rounded border border-[#d4c5a3] relative mt-auto">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#f0e6d2] px-2 text-[10px] text-[#8b4513] uppercase tracking-widest border border-[#d4c5a3] rounded-full whitespace-nowrap">
              {treasure.emotion ? `关于「${treasure.emotion}」的记忆` : '原始记忆'}
            </div>
            <p className="text-[#5d4037] text-xs md:text-sm font-serif line-clamp-4">
              {treasure.content}
            </p>
          </div>

          <div className="mt-3 text-[10px] text-[#8b4513]/60 font-serif-en">
            {new Date(treasure.createdAt).toLocaleDateString()}
          </div>

          {onClose && (
            <button
              onClick={() => {
                onClose();
              }}
              className="mt-6 group relative px-8 py-2 overflow-hidden rounded-full hover:shadow-lg transition-all duration-300 w-full md:w-auto"
            >
              <span className="absolute inset-0 bg-[#8b4513] group-hover:bg-[#a0522d] transition-colors" />
              <span className="relative text-[#f0e6d2] font-display text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                 收入宝箱
              </span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                 e.stopPropagation();
                 if(window.confirm("确定要让风带走这段记忆吗？它将无法被找回。")) {
                    onDelete();
                 }
              }}
              className="mt-4 flex items-center justify-center gap-1 text-[#8d6e63]/50 hover:text-[#8b4513] transition-colors text-[10px] font-serif border-b border-transparent hover:border-[#8b4513]/30 pb-0.5 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>遗忘此物</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};