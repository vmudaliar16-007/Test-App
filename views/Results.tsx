import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Download, Check, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { DISCLAIMER_TEXT } from '../constants';

interface ResultsProps {
  originalImage: string;
  generatedImages: string[];
  onBack: () => void;
  onSave: () => void;
  onDiscard: () => void;
}

export const Results: React.FC<ResultsProps> = ({ 
  originalImage, 
  generatedImages, 
  onBack, 
  onSave, 
  onDiscard 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [saved, setSaved] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    onSave();
    setSaved(true);
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImages[activeIndex];
    link.download = `ai-van-redesign-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMove = (clientX: number) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseDown = () => setIsResizing(true);
  const onMouseUp = () => setIsResizing(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isResizing) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  // Global mouse up handler to catch dragging outside container
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsResizing(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="h-full flex flex-col bg-brand-50">
      <Header 
        title="Your Redesign" 
        onBack={onBack} 
      />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        
        {/* Comparison Slider Area */}
        <div className="p-4">
          <div 
            ref={imageContainerRef}
            className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg select-none cursor-crosshair touch-none"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            onClick={(e) => handleMove(e.clientX)}
          >
            {/* Background: Generated Image (After) */}
            {generatedImages.length > 0 && (
              <img 
                src={generatedImages[activeIndex]} 
                alt="After" 
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            )}

            {/* Foreground: Original Image (Before) - Clipped */}
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
               <img 
                src={originalImage} 
                alt="Before" 
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%' }} // Ensure it stays full width relative to container
                draggable={false}
              />
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium pointer-events-none transition-opacity duration-200" style={{ opacity: sliderPosition > 10 ? 1 : 0 }}>
              Before
            </div>
            <div className="absolute top-4 right-4 bg-brand-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium pointer-events-none transition-opacity duration-200" style={{ opacity: sliderPosition < 90 ? 1 : 0 }}>
              After
            </div>

            {/* Slider Handle Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Handle Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-500">
                <div className="flex gap-0.5">
                    <ChevronLeft size={14} strokeWidth={3} />
                    <ChevronRight size={14} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-2">
            Drag slider to compare before and after
          </p>
        </div>

        {/* Thumbnail Selector */}
        {generatedImages.length > 1 && (
          <div className="px-4 pb-4 flex gap-3 overflow-x-auto no-scrollbar">
             {generatedImages.map((img, idx) => (
               <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${idx === activeIndex ? 'border-brand-500 ring-2 ring-brand-100' : 'border-transparent opacity-70'}`}
               >
                 <img src={img} alt={`Variant ${idx}`} className="w-full h-full object-cover" />
               </button>
             ))}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant={saved ? "outline" : "primary"} 
              onClick={handleSave} 
              disabled={saved}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" /> Saved
                </>
              ) : "Save to Gallery"}
            </Button>
            <Button variant="secondary" onClick={handleDownload}>
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
          
          <Button variant="ghost" fullWidth onClick={onDiscard} className="text-red-500 hover:bg-red-50">
            <RefreshCw className="w-4 h-4" /> Start Over
          </Button>

          <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed px-4 pb-8">
             {DISCLAIMER_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
};