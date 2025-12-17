import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { fileToBase64 } from '../services/imageUtils';

interface UploadProps {
  onBack: () => void;
  onNext: (base64Image: string) => void;
}

export const Upload: React.FC<UploadProps> = ({ onBack, onNext }) => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size too large. Please upload an image under 10MB.");
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setImage(base64);
        setError(null);
      } catch (err) {
        setError("Failed to process image.");
      }
    }
  };

  const clearImage = () => setImage(null);

  return (
    <div className="h-full flex flex-col bg-brand-50">
      <Header title="Upload Photo" onBack={onBack} />
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="mb-6 bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
                <span className="font-semibold block mb-1">Capture Tips</span>
                Ensure good lighting and capture as much of the interior space as possible. Wide-angle shots work best.
            </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[20vh]">
          {!image ? (
            <div className="w-full h-80 border-3 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-white relative hover:bg-gray-50 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
              />
              <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-500 mb-4">
                <Camera size={32} />
              </div>
              <p className="font-semibold text-gray-700">Tap to Upload</p>
              <p className="text-sm text-gray-400 mt-2">or select from library</p>
            </div>
          ) : (
            <div className="relative w-full rounded-3xl overflow-hidden shadow-lg aspect-[3/4] bg-black">
              <img src={image} alt="Upload preview" className="w-full h-full object-contain" />
              <button 
                onClick={clearImage}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/70"
              >
                <X size={20} />
              </button>
            </div>
          )}
          
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center bg-red-50 px-3 py-1 rounded-full">{error}</p>
          )}
        </div>
      </div>

      {/* Fixed Footer with Safe Area */}
      <div className="px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-white border-t border-gray-100 z-10">
          <Button 
            fullWidth 
            disabled={!image} 
            onClick={() => image && onNext(image)}
          >
            Continue
          </Button>
      </div>
    </div>
  );
};