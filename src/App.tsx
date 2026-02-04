import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Feather, Box, Loader2, RefreshCw, X, ScrollText } from 'lucide-react';
import { Treasure } from './types';
import { generateTreasure } from './services/geminiService';
import { TreasureCard } from "./components/TreasureCard";
import { TreasureIcon } from "./components/TreasureIcon";

type ViewState = 'HOME' | 'INPUT' | 'REVEAL' | 'CHEST' | 'RETRIEVED';

const STORAGE_KEY = 'crows_treasures_data';

// Emotion options
const EMOTIONS = ['平静', '快乐', '悲伤', '愤怒', '焦虑', '期待', '迷茫', '感激'];

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [inputThought, setInputThought] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [currentTreasure, setCurrentTreasure] = useState<Treasure | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTreasures(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse treasures", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(treasures));
  }, [treasures]);

  const changeView = (newView: ViewState) => {
    setView(newView);
  };

  const handleCreateTreasure = async () => {
    if (!inputThought.trim()) return;

    setIsGenerating(true);

    try {
      // Pass emotion to service
      const partialTreasure = await generateTreasure(inputThought, selectedEmotion);
      const newTreasure: Treasure = {
        ...partialTreasure,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      setTreasures(prev => [newTreasure, ...prev]);
      setCurrentTreasure(newTreasure);
      setInputThought('');
      setSelectedEmotion('');
      
      setView('REVEAL');
    } catch (error) {
      console.error(error);
      alert("乌鸦迷失在风暴中，请稍后再试。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetrieveRandom = () => {
    if (treasures.length === 0 || isDrawing) return;
    
    setIsDrawing(true);
    
    // Magic circle animation duration
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * treasures.length);
      setCurrentTreasure(treasures[randomIndex]);
      setView('RETRIEVED');
      setIsDrawing(false);
    }, 3000);
  };

  const handleDeleteTreasure = (id: string) => {
    setTreasures(prev => prev.filter(t => t.id !== id));
    setCurrentTreasure(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'HOME':
        return (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-8 md:space-y-10 w-full max-w-lg px-4"
          >
            {/* Title Section with Celtic Vibes & Semi-transparent Background */}
            <div className="relative w-full">
               {/* Decorative Background Panel */}
               <div className="absolute inset-0 bg-[#f0e6d2]/80 backdrop-blur-sm rounded-2xl border border-[#d4c5a3] shadow-sm transform rotate-1 scale-[1.02] z-0" />
               <div className="absolute inset-0 bg-[#fffaf0]/60 rounded-2xl border border-[#b8860b]/20 transform -rotate-1 z-0" />

               <div className="relative z-10 p-8 md:p-10 text-center flex flex-col items-center">
                  <motion.div 
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex justify-center items-center mb-4"
                  >
                    <div className="relative">
                        <Feather className="w-12 h-12 md:w-16 md:h-16 text-[#5d4037] drop-shadow-sm" />
                        <Feather className="w-12 h-12 md:w-16 md:h-16 text-[#b8860b] absolute top-0 left-0 blur-sm opacity-30" />
                    </div>
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-6xl font-display font-bold text-[#3e2723] tracking-tight drop-shadow-sm leading-tight mb-2">
                    <span className="text-[#b8860b]">C</span>row's <span className="text-[#b8860b]">T</span>reasure
                  </h1>
                  <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent mx-auto my-3" />
                  <h2 className="text-xl md:text-2xl font-serif text-[#8d6e63] tracking-[0.2em]">乌鸦的宝藏</h2>
               </div>
            </div>

            {/* Main Actions - Art Nouveau Buttons (Light Mode) */}
            <div className="flex flex-col w-full gap-4 md:flex-row md:gap-8 mt-4 items-center">
              <button
                onClick={() => changeView('INPUT')}
                className="group relative w-full md:w-64 h-16 md:h-20 bg-[#fffaf0] border-2 border-[#d7ccc8] hover:border-[#b8860b] rounded-lg transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-[#b8860b]/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg origin-center" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 w-full justify-center">
                  <div className="w-8 h-8 rounded-full border border-[#d7ccc8] group-hover:border-[#b8860b] flex items-center justify-center bg-white transition-colors">
                    <Sparkles className="w-4 h-4 text-[#8b4513] group-hover:text-[#b8860b]" />
                  </div>
                  <span className="font-display text-[#5d4037] tracking-wider text-lg group-hover:text-[#3e2723]">记录思绪</span>
                </div>
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#b8860b] opacity-30" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#b8860b] opacity-30" />
              </button>

              <button
                onClick={() => changeView('CHEST')}
                className="group relative w-full md:w-64 h-16 md:h-20 bg-[#fffaf0] border-2 border-[#d7ccc8] hover:border-[#b8860b] rounded-lg transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-[#b8860b]/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-lg origin-center" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 w-full justify-center">
                  <div className="w-8 h-8 rounded-full border border-[#d7ccc8] group-hover:border-[#b8860b] flex items-center justify-center bg-white transition-colors">
                    <Box className="w-4 h-4 text-[#8b4513] group-hover:text-[#b8860b]" />
                  </div>
                  <span className="font-display text-[#5d4037] tracking-wider text-lg group-hover:text-[#3e2723]">打开宝箱</span>
                </div>
                <div className="absolute top-2 right-3 text-xs font-serif text-[#b8860b] opacity-80">
                   {treasures.length}
                </div>
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#b8860b] opacity-30" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#b8860b] opacity-30" />
              </button>
            </div>
          </motion.div>
        );

      case 'INPUT':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl relative px-2 md:px-0"
          >
            {/* Scroll/Parchment effect */}
            <div className="bg-[#e6dec3] rounded-lg p-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transform md:rotate-1">
               <div className="bg-[#f0e6d2] border-4 border-double border-[#b8860b]/20 rounded p-4 md:p-8 min-h-[500px] flex flex-col relative overflow-hidden">
                 
                 {/* Texture Overlay */}
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none" />

                 {/* Header */}
                 <div className="flex justify-between items-center mb-4 relative z-10 flex-shrink-0">
                    <h2 className="text-2xl md:text-3xl font-display text-[#5c4033] flex items-center gap-3">
                      <ScrollText className="w-6 h-6 md:w-8 md:h-8 text-[#b8860b]" />
                      <span className="border-b-2 border-[#b8860b]/30 pb-1">书写卷轴</span>
                    </h2>
                    <button onClick={() => changeView('HOME')} className="text-[#8b4513]/50 hover:text-[#8b4513] p-2">
                      <X className="w-6 h-6" />
                    </button>
                 </div>

                 {/* Emotion Selector */}
                 <div className="relative z-10 mb-2 flex-shrink-0">
                    <p className="text-[#8b4513]/70 font-serif text-sm mb-2 text-center">这份思绪的味道是...</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {EMOTIONS.map(emotion => (
                        <button
                          key={emotion}
                          onClick={() => {
                            setSelectedEmotion(emotion === selectedEmotion ? '' : emotion);
                          }}
                          className={`
                            px-3 py-1 rounded-full text-xs md:text-sm font-serif border transition-all
                            ${selectedEmotion === emotion 
                              ? 'bg-[#8b4513] text-[#f0e6d2] border-[#8b4513]' 
                              : 'bg-transparent border-[#b8860b]/30 text-[#5c4033] hover:border-[#b8860b]'}
                          `}
                        >
                          {emotion}
                        </button>
                      ))}
                    </div>
                 </div>

                 {/* Centered Input Area with Interactive Border */}
                 <div className="flex-grow flex flex-col justify-center items-center w-full relative z-10 py-4">
                    <div 
                        className="w-full max-w-xl min-h-[250px] border-2 border-[#d7ccc8] rounded-xl flex items-center justify-center p-6 transition-colors duration-500 focus-within:border-[#5c4033] bg-[#fffaf0]/20 group"
                        onClick={() => {
                          document.getElementById('thought-textarea')?.focus();
                        }}
                    >
                        <textarea
                            id="thought-textarea"
                            value={inputThought}
                            onChange={(e) => setInputThought(e.target.value)}
                            placeholder="在此刻的羊皮纸上，刻下你的思绪..."
                            className="w-full h-48 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[#3e2723] text-lg font-serif placeholder-[#8b4513]/30 resize-none leading-relaxed text-center caret-[#8b4513]"
                            style={{ 
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#b8860b transparent'
                            }}
                        />
                    </div>
                 </div>

                 {/* Footer Action */}
                 <div className="flex justify-center mt-4 relative z-10 flex-shrink-0">
                    <button
                      disabled={!inputThought.trim() || isGenerating}
                      onClick={handleCreateTreasure}
                      className={`
                        relative w-full md:w-auto px-10 py-3 rounded-full font-bold font-display tracking-widest text-sm uppercase transition-all
                        ${!inputThought.trim() || isGenerating
                          ? 'bg-[#d7ccc8] text-[#8d6e63] cursor-not-allowed'
                          : 'bg-[#8b4513] text-[#fffaf0] hover:bg-[#a0522d] shadow-lg hover:shadow-[#8b4513]/30 transform hover:-translate-y-0.5'
                        }
                      `}
                    >
                      {isGenerating ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> 铸造中...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Feather className="w-4 h-4" /> 封存记忆
                        </span>
                      )}
                    </button>
                 </div>
               </div>
            </div>
          </motion.div>
        );

      case 'REVEAL':
        return (
          <div className="flex flex-col items-center justify-center w-full px-4">
             <div className="mb-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-display text-[#b8860b] mb-2 drop-shadow-sm">宝藏已现</h2>
                  <div className="h-1 w-20 bg-[#b8860b] mx-auto rounded-full mb-2 opacity-50" />
                  <p className="text-[#8d6e63] font-serif italic text-sm md:text-base">乌鸦已将其收入囊中</p>
                </motion.div>
             </div>
             {currentTreasure && (
               <TreasureCard 
                 treasure={currentTreasure} 
                 onClose={() => changeView('HOME')} 
                 onDelete={() => {
                    handleDeleteTreasure(currentTreasure.id);
                    changeView('HOME');
                 }}
               />
             )}
          </div>
        );

      case 'CHEST':
        return (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full max-w-4xl px-4"
          >
             <button 
                onClick={() => {
                  if(!isDrawing) changeView('HOME');
                }}
                className={`self-start mb-6 text-[#8d6e63] hover:text-[#5d4037] transition-colors flex items-center gap-2 font-serif ${isDrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ← 返回大厅
              </button>

            <div className="text-center mb-8 md:mb-12 relative">
               {/* Ornate Header */}
              <h2 className="text-4xl md:text-5xl font-display text-[#3e2723] mb-2 tracking-widest">
                <span className="text-[#b8860b] text-5xl md:text-6xl">T</span>HE <span className="text-[#b8860b] text-5xl md:text-6xl">C</span>HEST
              </h2>
              <div className="flex items-center justify-center gap-4 text-[#8d6e63]">
                 <div className="h-px w-10 md:w-16 bg-[#8d6e63]/50" />
                 <span className="font-serif italic text-[#8d6e63] text-sm md:text-base">共 {treasures.length} 件珍藏</span>
                 <div className="h-px w-10 md:w-16 bg-[#8d6e63]/50" />
              </div>
            </div>

            {treasures.length === 0 ? (
              <div className="text-center p-8 md:p-16 border-2 border-dashed border-[#d7ccc8] rounded-2xl bg-[#fffaf0] w-full">
                <p className="text-[#8d6e63] mb-6 font-serif text-lg">箱子里空空如也，像是一个没有梦境的白昼。</p>
                <button
                  onClick={() => changeView('INPUT')}
                  className="px-6 py-2 border border-[#b8860b] text-[#b8860b] rounded-full hover:bg-[#b8860b] hover:text-white transition-all font-display tracking-widest text-sm"
                >
                  去创造
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8 md:gap-12 w-full">
                
                {/* The Magic Circle Drawing Mechanism */}
                <div 
                   className={`relative ${isDrawing ? 'cursor-default' : 'cursor-pointer group'}`}
                   onClick={handleRetrieveRandom}
                >
                   {/* Background Glow */}
                   <div className={`absolute inset-0 bg-[#b8860b]/10 rounded-full blur-[40px] transition-all duration-700 ${isDrawing ? 'bg-[#b8860b]/40 scale-125' : 'group-hover:bg-[#b8860b]/20'}`} />
                   
                   <div className="relative w-40 h-40 md:w-48 md:h-48 bg-[#fffaf0] border-[6px] border-[#e6dec3] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(184,134,11,0.15)] overflow-hidden">
                      
                      {/* Magic Circle Animations */}
                      {isDrawing ? (
                        <>
                           {/* Outer Rotating Ring */}
                           <motion.div 
                              className="absolute inset-2 border-2 border-[#b8860b] rounded-full border-dashed" 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                           />
                           {/* Middle Counter-Rotating Ring */}
                           <motion.div 
                              className="absolute inset-6 border border-[#b8860b]/50 rounded-full" 
                              animate={{ rotate: -360 }}
                              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                           >
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#b8860b] rounded-full" />
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#b8860b] rounded-full" />
                           </motion.div>
                           
                           {/* Geometric Core Active */}
                           <motion.div 
                              className="absolute z-10 w-24 h-24 flex items-center justify-center"
                              animate={{ rotate: 180 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                           >
                              {/* Square 1 */}
                              <div className="absolute w-16 h-16 border border-[#b8860b]" />
                              {/* Square 2 (Rotated) */}
                              <div className="absolute w-16 h-16 border border-[#b8860b] rotate-45" />
                           </motion.div>
                           
                           {/* Pulse Ring */}
                           <motion.div
                              className="absolute z-10 w-16 h-16 border border-[#b8860b]/50 rounded-full"
                              animate={{ scale: [0.8, 1.2, 0.8] }}
                              transition={{ duration: 2, repeat: Infinity }}
                           />

                           {/* Center Pulse Orb */}
                           <motion.div 
                              className="z-20 w-3 h-3 bg-[#b8860b] rounded-full shadow-[0_0_15px_#b8860b]"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                           />

                           {/* Summoning Text */}
                           <motion.div 
                              className="absolute -bottom-10 text-[#b8860b] font-display font-bold tracking-[0.2em] animate-pulse"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                           >
                             召唤中...
                           </motion.div>
                        </>
                      ) : (
                        <>
                          {/* Idle State Geometry */}
                          
                          {/* Outer dashed ring - Slow spin */}
                          <div className="absolute inset-2 border border-[#b8860b]/30 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
                          
                          {/* Inner Circle Ring */}
                          <div className="absolute inset-6 border border-[#b8860b]/20 rounded-full" />

                          {/* Static Geometric Seal (SVG) */}
                          <svg 
                             viewBox="0 0 100 100" 
                             className="w-24 h-24 text-[#b8860b] transition-transform duration-700 group-hover:rotate-12 group-hover:scale-105 group-hover:text-[#d4af37]"
                          >
                             {/* Triangle Up */}
                             <polygon points="50,10 90,80 10,80" fill="none" stroke="currentColor" strokeWidth="1" />
                             {/* Triangle Down */}
                             <polygon points="50,90 90,20 10,20" fill="none" stroke="currentColor" strokeWidth="1" />
                             {/* Center Circle */}
                             <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
                             {/* Center Diamond */}
                             <rect x="46" y="46" width="8" height="8" transform="rotate(45 50 50)" fill="currentColor" opacity="0.8" />
                          </svg>
                          
                          <div className="absolute -bottom-8 bg-[#fffaf0] border border-[#d7ccc8] px-4 md:px-6 py-1 rounded-sm text-[#b8860b] font-display text-xs md:text-sm tracking-[0.3em] uppercase shadow-md whitespace-nowrap group-hover:bg-[#b8860b] group-hover:text-[#fffaf0] transition-all">
                            抽取命运
                          </div>
                        </>
                      )}
                   </div>
                </div>
                
                {/* Treasure Grid */}
                <div className={`w-full bg-[#fffaf0]/80 rounded-xl p-4 md:p-8 border border-[#e6dec3] mt-8 shadow-sm transition-opacity duration-500 ${isDrawing ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                   <h3 className="text-center text-[#8d6e63] font-display mb-6 text-sm tracking-widest uppercase">收藏概览</h3>
                   <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                      {treasures.map((t) => (
                         <div 
                            key={t.id} 
                            className="group relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-[#d7ccc8] hover:border-[#b8860b] flex items-center justify-center transition-all hover:scale-110 cursor-help shadow-sm"
                         >
                           <TreasureIcon type={t.type} className="w-4 h-4 md:w-5 md:h-5 text-[#8b4513] group-hover:text-[#b8860b] transition-colors" />
                           {/* Tooltip (hidden on mobile mostly, but helpful on tap) */}
                           <div className="absolute bottom-full mb-2 hidden group-hover:block w-max max-w-[150px] bg-[#3e2723] text-[#fffaf0] text-xs p-2 rounded shadow-lg z-20 pointer-events-none font-serif">
                              {t.name}
                           </div>
                         </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'RETRIEVED':
        return (
           <div className="flex flex-col items-center justify-center w-full px-4">
              <div className="mb-8 flex flex-col items-center">
                <h2 className="text-3xl font-display text-[#3e2723] mb-3 drop-shadow-sm tracking-widest">
                   <span className="text-[#b8860b]">R</span>ETRIEVED
                </h2>
                <button 
                  onClick={() => changeView('CHEST')}
                  className="flex items-center gap-2 text-[#8d6e63] hover:text-[#b8860b] transition-colors text-sm border-b border-transparent hover:border-[#b8860b] pb-1 font-serif"
                >
                  <RefreshCw className="w-4 h-4" /> 再次探寻
                </button>
              </div>
              {currentTreasure && (
                <TreasureCard 
                  treasure={currentTreasure} 
                  onClose={() => changeView('CHEST')} 
                  onDelete={() => {
                     handleDeleteTreasure(currentTreasure.id);
                     changeView('CHEST');
                  }}
                />
              )}
           </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-[#4a3b32] selection:bg-[#b8860b]/20 selection:text-[#3e2723] overflow-x-hidden bg-pattern">
      {/* Vignette Effect (Lighter) */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#a1887f_150%)] opacity-20" />
      
      {/* Decorative Border Frame Fixed to Screen (Hidden on mobile to save space) */}
      <div className="fixed inset-4 border border-[#b8860b]/20 pointer-events-none rounded-2xl z-50 md:block hidden" />
      <div className="fixed inset-5 border border-[#b8860b]/10 pointer-events-none rounded-xl z-50 md:block hidden" />

      {/* Main Container */}
      <main className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-6 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(5px)' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}