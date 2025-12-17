
import React, { useEffect } from 'react';
import { Truck } from 'lucide-react';

export const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    // Increased duration slightly to let animation finish
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full w-full bg-brand-950 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[80%] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Moving Grid Floor */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(brand-900 1px, transparent 1px), linear-gradient(90deg, brand-900 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             perspective: '500px',
             transform: 'rotateX(60deg) translateY(100px) scale(2)'
           }}>
           <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Animation Container */}
        <div className="mb-12 relative w-64 h-32 flex items-center justify-center">
           
           {/* Speed Lines */}
           <div className="absolute top-1/2 -translate-y-1/2 right-[110%] w-32 h-[2px] bg-gradient-to-l from-white/50 to-transparent animate-speed-line delay-100"></div>
           <div className="absolute top-1/3 -translate-y-1/2 right-[120%] w-20 h-[1px] bg-gradient-to-l from-white/30 to-transparent animate-speed-line"></div>
           
           {/* Headlight Beam */}
           <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-48 h-32 bg-gradient-to-r from-brand-400/30 to-transparent blur-xl animate-headlights origin-left" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)' }}></div>

           {/* The Van */}
           <div className="animate-drive-in relative z-20">
              <div className="animate-suspension">
                <div className="absolute inset-0 bg-brand-500/50 blur-2xl animate-pulse"></div>
                <Truck size={96} strokeWidth={1} className="relative text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </div>
           </div>
           
           {/* Shadow */}
           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-2 bg-black/60 blur-md rounded-[100%] animate-shadow-scale"></div>
        </div>
        
        {/* Text Reveal */}
        <h1 className="text-4xl font-black mb-2 tracking-tighter italic animate-slide-up text-center">
          AI VAN <span className="text-brand-500">LIFESTYLE</span>
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase font-semibold animate-slide-up-delay">
          AI Van Studio
        </p>
      </div>
      
      {/* Loading Bar */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-64 h-1 bg-brand-900 rounded-full overflow-hidden border border-brand-800/50">
          <div className="h-full bg-brand-500 shadow-[0_0_10px_#2563eb] animate-loading-bar"></div>
        </div>
        <p className="text-[10px] text-brand-400 font-mono animate-pulse">INITIALIZING STUDIO...</p>
      </div>

      <style>{`
        .animate-drive-in {
          animation: drive-in 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-suspension {
          animation: suspension 2s ease-in-out forwards;
        }
        .animate-headlights {
          animation: headlights 2.5s ease-out forwards;
          opacity: 0;
        }
        .animate-speed-line {
          animation: speed-line 1.5s linear infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.5s forwards;
          opacity: 0;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.8s forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out 1s forwards;
          opacity: 0;
        }
        .animate-shadow-scale {
          animation: shadow-scale 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }

        @keyframes drive-in {
          0% { transform: translateX(-300%) skewX(-10deg); opacity: 0; }
          60% { transform: translateX(10%) skewX(5deg); opacity: 1; }
          80% { transform: translateX(-5%) skewX(-2deg); }
          100% { transform: translateX(0) skewX(0); }
        }
        @keyframes suspension {
          0% { transform: translateY(0); }
          60% { transform: translateY(0); }
          65% { transform: translateY(4px); }
          75% { transform: translateY(-2px); }
          85% { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }
        @keyframes headlights {
          0%, 65% { opacity: 0; transform: scaleX(0); }
          70% { opacity: 1; transform: scaleX(1.2); }
          100% { opacity: 0.8; transform: scaleX(1); }
        }
        @keyframes speed-line {
          0% { transform: translateX(200px); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translateX(-200px); opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-50%); }
          50% { width: 60%; }
          100% { width: 100%; transform: translateX(100%); }
        }
        @keyframes shadow-scale {
           0% { transform: scaleX(2) translateX(-150%); opacity: 0; }
           60% { transform: scaleX(1) translateX(0); opacity: 1; }
           100% { transform: scaleX(1) translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
