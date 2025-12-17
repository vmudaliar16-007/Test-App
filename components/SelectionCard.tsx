
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  imageUrl?: string;
  selected: boolean;
  onClick: () => void;
  color?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  imageUrl,
  selected, 
  onClick,
  color
}) => {
  // Image-based card variant
  if (imageUrl) {
    return (
      <div 
        onClick={onClick}
        className={`
          relative overflow-hidden h-48 transition-all duration-300 cursor-pointer group rounded-sm
          ${selected 
            ? 'ring-4 ring-brand-500 ring-offset-2 scale-[1.02]' 
            : 'hover:shadow-xl hover:scale-[1.01] shadow-lg'
          }
        `}
      >
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${selected ? 'from-brand-900/90' : 'from-black/80'} to-transparent transition-colors`} />
        
        {/* Metal Frame Overlay */}
        <div className="absolute inset-0 border-2 border-white/20 pointer-events-none"></div>
        
        {/* Rivets on image card */}
        <div className="rivet rivet-tl bg-white/50 border-white/50"></div>
        <div className="rivet rivet-tr bg-white/50 border-white/50"></div>
        <div className="rivet rivet-bl bg-white/50 border-white/50"></div>
        <div className="rivet rivet-br bg-white/50 border-white/50"></div>

        <div className="absolute bottom-0 left-0 p-4 text-white">
          <div className="flex items-center gap-2">
            {selected && <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_#0040FF]" />}
            <h3 className="font-bold text-lg leading-none uppercase tracking-wide">{title}</h3>
          </div>
        </div>
        
        {selected && (
           <div className="absolute top-3 right-3 bg-brand-500 text-white p-1 rounded-sm shadow-lg border border-brand-400">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
             </svg>
           </div>
        )}
      </div>
    );
  }

  // Standard Icon/Color card variant (Metal Plate)
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden p-4 transition-all duration-300 cursor-pointer border rounded-sm
        ${selected 
          ? 'bg-metal-200 border-brand-500 shadow-glow' 
          : 'bg-gradient-to-br from-white to-metal-100 border-metal-300 shadow-sm hover:bg-metal-50'
        }
      `}
    >
      {/* Corner Bolts */}
      <div className={`rivet rivet-tl ${selected ? 'rivet-rust' : ''}`}></div>
      <div className={`rivet rivet-tr ${selected ? 'rivet-rust' : ''}`}></div>
      <div className={`rivet rivet-bl ${selected ? 'rivet-rust' : ''}`}></div>
      <div className={`rivet rivet-br ${selected ? 'rivet-rust' : ''}`}></div>

      <div className="flex items-start gap-4 pl-2">
        {Icon && (
          <div className={`p-3 rounded-md shadow-inner border border-white/50 ${selected ? 'bg-brand-500 text-white' : 'bg-metal-200 text-metal-600'}`}>
            <Icon size={24} strokeWidth={1.5} />
          </div>
        )}
        {color && !Icon && (
           <div className={`w-12 h-12 rounded-md ${color} shadow-inner border border-black/10`}></div>
        )}
        <div className="flex-1 pt-1">
          <h3 className={`font-black uppercase tracking-tight ${selected ? 'text-brand-900' : 'text-metal-800'}`}>{title}</h3>
          {description && (
            <p className="text-xs font-medium text-metal-500 mt-1 leading-snug">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
