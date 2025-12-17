import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction }) => {
  return (
    <div className="sticky top-0 z-10 bg-brand-50/90 backdrop-blur-md border-b border-gray-200/50 pt-[env(safe-area-inset-top)]">
      <div className="h-14 flex items-center justify-between px-4">
        <div className="w-10">
          {onBack && (
            <button 
              onClick={onBack} 
              className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 text-brand-900 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
        
        <h1 className="text-lg font-semibold text-brand-900 truncate">
          {title}
        </h1>
        
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </div>
  );
};