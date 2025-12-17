
import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export const Processing: React.FC = () => {
  return (
    <div className="h-full w-full bg-metal-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-mono">
      {/* Dark background with tech grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#0040FF 1px, transparent 1px), linear-gradient(90deg, #0040FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-brand-500"></div>
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-brand-500"></div>
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-brand-500"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-brand-500"></div>

      <div className="relative mb-12">
        {/* Rotating outer ring */}
        <div className="absolute inset-[-30px] border-2 border-dashed border-brand-800 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-[-15px] border border-brand-600/30 rounded-full animate-[spin_5s_linear_infinite_reverse]"></div>
        
        {/* Pulsing glow */}
        <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full animate-pulse"></div>
        
        <div className="relative w-32 h-32 bg-metal-900 rounded-full flex items-center justify-center border-4 border-metal-800 shadow-[0_0_30px_#0040FF44]">
          <Cpu className="w-12 h-12 text-brand-400 animate-pulse" />
          
          {/* Internal Screws */}
          <div className="rivet rivet-tl border-metal-700 bg-metal-800"></div>
          <div className="rivet rivet-tr border-metal-700 bg-metal-800"></div>
          <div className="rivet rivet-bl border-metal-700 bg-metal-800"></div>
          <div className="rivet rivet-br border-metal-700 bg-metal-800"></div>
        </div>
        
        {/* Orbital indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-brand-400 rounded-none rotate-45 shadow-[0_0_15px_#2563eb] animate-[spin_2s_linear_infinite] origin-[50%_4rem]"></div>
      </div>
      
      <h3 className="text-3xl font-black text-white mb-2 tracking-tighter italic">PROCESSING</h3>
      <p className="text-brand-400 text-xs uppercase tracking-widest mb-12 border-b border-brand-900 pb-2">
        Analyzing geometry • Rendering textures
      </p>
      
      {/* Progress Bar styled like a system loader */}
      <div className="w-64 space-y-2">
         <div className="flex justify-between text-[10px] text-brand-500 font-bold">
            <span>SYS.INIT</span>
            <span className="animate-pulse">RENDERING...</span>
            <span>100%</span>
         </div>
         <div className="h-4 bg-metal-900 border border-metal-700 p-[2px] skew-x-[-10deg]">
            <div className="h-full bg-brand-600 w-full animate-[loading-bar_2s_ease-in-out_infinite] relative overflow-hidden">
               <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)]"></div>
            </div>
         </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 5%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
