
import React from 'react';
import { Header } from '../components/Header';
import { SavedDesign } from '../types';
import { Trash2, Download } from 'lucide-react';

interface SavedDesignsProps {
  onBack: () => void;
  designs: SavedDesign[];
  onDelete: (id: string) => void;
}

export const SavedDesigns: React.FC<SavedDesignsProps> = ({ onBack, designs, onDelete }) => {
  
  const handleDownload = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-van-design-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col bg-brand-50">
      <Header title="Garage" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        {designs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p>No saved designs yet.</p>
            <p className="text-sm">Start a project to see them here.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-8">
            {designs.map((design) => (
              <div key={design.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-4 border border-gray-100">
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                  <img src={design.generatedImage} alt="Design" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-semibold text-brand-900 font-heading">{design.style}</h4>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{design.mode}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(design.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <button 
                      onClick={(e) => handleDownload(e, design.generatedImage, design.id)}
                      className="text-brand-600 bg-brand-50 p-2 rounded-full hover:bg-brand-100 transition-colors border border-brand-100"
                      title="Download to Gallery"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(design.id)}
                      className="text-gray-400 bg-gray-50 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
               <p className="text-xs text-gray-400">All designs are stored locally on your device.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
