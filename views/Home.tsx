
import React from 'react';
import { Plus, Clock, Settings, Sparkles, ArrowRight, Crown, ChevronRight, Wrench } from 'lucide-react';
import { Button } from '../components/Button';
import { SavedDesign, UserSubscription } from '../types';
import { INSPIRATION_SAMPLES } from '../constants';

interface HomeProps {
  onNewProject: () => void;
  onOpenSaved: () => void;
  onOpenSettings: () => void;
  savedDesigns: SavedDesign[];
  subscription: UserSubscription;
}

export const Home: React.FC<HomeProps> = ({ 
  onNewProject, 
  onOpenSaved, 
  onOpenSettings,
  savedDesigns,
  subscription
}) => {
  const creditsRemaining = Math.max(0, subscription.freeLimit - subscription.generationsUsed);
  const hasSaved = savedDesigns.length > 0;

  // Duplicate saved designs to ensure we have enough for a loop if there are only a few
  // We want at least enough to cover the width plus scroll
  const marqueeImages = hasSaved 
    ? [...savedDesigns, ...savedDesigns, ...savedDesigns, ...savedDesigns].slice(0, 12) 
    : [];

  return (
    <div className="h-full flex flex-col bg-metal-100 relative font-body">
      
      {/* Header with Safe Area Top - Industrial Bar */}
      <div className="px-6 pb-3 flex justify-between items-center bg-metal-200 z-10 sticky top-0 pt-[calc(1.5rem+env(safe-area-inset-top))] border-b border-metal-400 shadow-md">
        {/* Decorative rivets on header */}
        <div className="rivet rivet-bl !bottom-2 !left-2 opacity-50"></div>
        <div className="rivet rivet-br !bottom-2 !right-2 opacity-50"></div>

        <div>
          <h1 className="text-xl font-black text-metal-900 flex items-center gap-2 italic tracking-tighter">
            <div className="w-8 h-8 bg-brand-500 rounded-sm flex items-center justify-center text-white shadow-[0_0_10px_#0040FF]">
              <Sparkles size={16} />
            </div>
            AI VAN <span className="text-brand-600">LIFESTYLE</span>
          </h1>
        </div>
        <button onClick={onOpenSettings} className="p-2 bg-metal-100 rounded-sm border border-metal-300 shadow-sm text-metal-600 hover:text-brand-600 relative transition-colors active:translate-y-px">
          <Settings size={20} />
          {!subscription.isPro && creditsRemaining < 2 && (
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-rust-500 rounded-full border-2 border-white shadow-sm"></span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        
        {/* Subscription Status Banner - Metal Plate Style */}
        {!subscription.isPro && (
          <div className="px-6 pt-6">
            <div className="relative bg-metal-dark rounded-sm p-4 flex items-center justify-between text-white shadow-lg overflow-hidden group cursor-pointer border border-metal-500" onClick={onOpenSettings}>
               
               {/* Screws */}
               <div className="rivet rivet-tl border-metal-600 bg-metal-800"></div>
               <div className="rivet rivet-tr border-metal-600 bg-metal-800"></div>
               <div className="rivet rivet-bl border-metal-600 bg-metal-800"></div>
               <div className="rivet rivet-br border-metal-600 bg-metal-800"></div>

               <div className="absolute right-0 top-0 w-40 h-40 bg-brand-500 blur-[60px] opacity-20 rounded-full translate-x-10 -translate-y-10 group-hover:opacity-40 transition-opacity"></div>
               
               <div className="flex flex-col relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={14} className="text-rust-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-metal-400">Free Workshop</span>
                  </div>
                  <span className="font-black text-xl font-heading italic tracking-wide">
                    {creditsRemaining} Credits Left
                  </span>
               </div>
               <div className="relative z-10 bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-sm text-xs font-black transition-colors uppercase tracking-widest shadow-[0_0_10px_#0040FF55] border border-brand-400">
                 Upgrade
               </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <section className="px-6 pt-6 pb-2">
          <div className="grid grid-cols-2 gap-4 h-40">
            
            {/* Garage Button with Sliding Thumbnails */}
            <button 
              onClick={onOpenSaved}
              className="relative bg-white rounded-sm shadow-sm border border-metal-300 text-left hover:border-brand-400 hover:shadow-md transition-all group overflow-hidden h-full"
            >
              <div className="rivet rivet-tr opacity-30 z-20"></div>
              <div className="rivet rivet-bl opacity-30 z-20"></div>
              
              {hasSaved ? (
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-white/10 z-10"></div>
                  {/* Marquee Container */}
                  <div className="flex h-full animate-marquee w-max">
                    {marqueeImages.map((design, idx) => (
                      <div key={`${design.id}-${idx}`} className="h-full w-24 shrink-0 border-r border-white/20 relative">
                        <img 
                          src={design.generatedImage} 
                          alt="" 
                          className="h-full w-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                        />
                      </div>
                    ))}
                  </div>
                  {/* Overlay Gradient for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent z-10"></div>
                </div>
              ) : null}

              {/* Foreground Content */}
              <div className="absolute top-4 left-4 z-20">
                <div className="w-10 h-10 rounded-sm bg-metal-100/90 backdrop-blur-sm text-metal-600 group-hover:bg-brand-50/90 group-hover:text-brand-600 flex items-center justify-center transition-colors shadow-inner border border-white/40">
                  <Clock size={20} />
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 z-20">
                <div className="font-black text-metal-900 text-3xl font-heading mb-1 drop-shadow-sm">{savedDesigns.length}</div>
                <div className="text-xs font-bold text-metal-400 uppercase tracking-widest">Garage</div>
              </div>
            </button>

            {/* Start Build Button */}
            <button 
                onClick={onNewProject}
                className="relative bg-blue-sheen p-5 rounded-sm shadow-lg shadow-brand-500/30 text-left hover:brightness-110 transition-all overflow-hidden group border border-brand-400 h-full"
            >
               {/* Rivets */}
               <div className="rivet rivet-tl border-brand-400 bg-brand-600"></div>
               <div className="rivet rivet-tr border-brand-400 bg-brand-600"></div>
               <div className="rivet rivet-bl border-brand-400 bg-brand-600"></div>
               <div className="rivet rivet-br border-brand-400 bg-brand-600"></div>

               <div className="absolute right-0 bottom-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-8 translate-y-8 blur-xl"></div>
               <div className="w-10 h-10 rounded-sm bg-white/20 text-white flex items-center justify-center mb-3 backdrop-blur-sm border border-white/20">
                  <Wrench size={20} strokeWidth={2.5} />
               </div>
               <div className="font-black text-white text-lg leading-tight mb-1 font-heading italic uppercase">Start<br/>Build</div>
            </button>
          </div>
        </section>

        {/* Inspiration Showcase */}
        <section className="pt-6 pb-4">
          <div className="px-6 mb-4 flex items-center justify-between">
             <div>
                <h2 className="text-lg font-black text-metal-800 uppercase tracking-tighter italic flex items-center gap-2">
                  <span className="w-1 h-4 bg-rust-500 rounded-full block"></span>
                  Showroom
                </h2>
                <p className="text-xs text-metal-500 font-medium pl-3">Concept Builds</p>
             </div>
          </div>
          
          <div className="flex flex-col gap-8 px-6">
            {INSPIRATION_SAMPLES.map((item) => (
              <div key={item.id} className="relative w-full aspect-[4/5] rounded-sm overflow-hidden shadow-2xl group border-2 border-metal-300 bg-metal-900">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-metal-950 via-metal-900/40 to-transparent opacity-100" />
                
                {/* Decorative Tech Lines */}
                <div className="absolute top-4 right-4 w-16 h-[2px] bg-white/30"></div>
                <div className="absolute top-4 right-4 w-[2px] h-4 bg-white/30"></div>
                <div className="absolute bottom-4 left-4 w-4 h-[2px] bg-brand-500"></div>

                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <div className="mb-4">
                       <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2 border-l-2 border-brand-500 pl-2">{item.category}</p>
                       <h3 className="font-black text-3xl leading-none mb-2 font-heading italic">{item.title}</h3>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <button 
                        onClick={onNewProject}
                        className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-brand-600 hover:border-brand-500 transition-all w-full justify-center shadow-lg"
                      >
                        Load Config <ChevronRight size={14} />
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="px-6 py-8 pb-12">
           <Button 
            onClick={onNewProject} 
            fullWidth 
            variant="primary"
            className="shadow-[0_10px_30px_-10px_#0040FF] py-5 text-lg"
          >
            {subscription.isPro ? (
              <Sparkles className="w-5 h-5 mr-2 text-white" /> 
            ) : (
              <Wrench className="w-5 h-5 mr-2" />
            )}
            BUILD IT
          </Button>
          <p className="text-center text-xs text-metal-400 mt-6 font-bold font-mono uppercase tracking-widest opacity-60">
            AI Van Studio • v1.2
          </p>
        </section>
        
        {/* Extra padding for safe area */}
        <div className="h-[env(safe-area-inset-bottom)]"></div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
