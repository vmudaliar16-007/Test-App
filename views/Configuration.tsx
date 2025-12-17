
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { SelectionCard } from '../components/SelectionCard';
import { DesignMode, InteriorStyle, VanType } from '../types';
import { MODE_OPTIONS, STYLE_OPTIONS, TYPE_OPTIONS } from '../constants';

interface ConfigurationProps {
  onBack: () => void;
  onGenerate: (mode: DesignMode, type: VanType, style: InteriorStyle) => void;
}

export const Configuration: React.FC<ConfigurationProps> = ({ onBack, onGenerate }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<DesignMode | null>(null);
  const [vanType, setVanType] = useState<VanType | null>(null);
  const [style, setStyle] = useState<InteriorStyle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step === 1 && mode) setStep(2);
    else if (step === 2 && vanType) setStep(3);
    else if (step === 3 && style && mode && vanType) {
        if (isSubmitting) return; // Prevent double click
        setIsSubmitting(true);
        onGenerate(mode, vanType, style);
        // Note: We don't reset isSubmitting here because the parent will unmount this component 
        // or change the view to PROCESSING. If we reset it too early, user might click again.
    }
  };

  const canProceed = () => {
    if (isSubmitting) return false;
    if (step === 1) return !!mode;
    if (step === 2) return !!vanType;
    if (step === 3) return !!style;
    return false;
  };

  const getTitle = () => {
    if (step === 1) return "Choose Goal";
    if (step === 2) return "Van Type";
    return "Interior Style";
  };

  const getStepProgress = () => {
    return (step / 3) * 100;
  };

  return (
    <div className="h-full flex flex-col bg-brand-50">
      <Header 
        title={getTitle()} 
        onBack={() => {
          if (step > 1) setStep(s => s - 1 as any);
          else onBack();
        }} 
      />
      
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 w-full shrink-0">
        <div 
          className="h-full bg-brand-500 transition-all duration-300 ease-out" 
          style={{ width: `${getStepProgress()}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-md mx-auto space-y-4 pb-4">
          
          {step === 1 && (
            <>
              <p className="text-gray-500 mb-4 text-sm">What kind of renovation are you planning?</p>
              <div className="flex flex-col gap-4">
                {MODE_OPTIONS.map(opt => (
                  <SelectionCard
                    key={opt.id}
                    title={opt.title}
                    description={opt.description}
                    icon={opt.icon}
                    selected={mode === opt.id}
                    onClick={() => setMode(opt.id)}
                  />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
               <p className="text-gray-500 mb-4 text-sm">Select the vehicle type that matches best.</p>
              <div className="flex flex-col gap-4">
                {TYPE_OPTIONS.map(opt => (
                  <SelectionCard
                    key={opt.id}
                    title={opt.title}
                    icon={opt.icon}
                    selected={vanType === opt.id}
                    onClick={() => setVanType(opt.id)}
                  />
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-gray-500 mb-4 text-sm">Which aesthetic speaks to you?</p>
              <div className="flex flex-col gap-4">
                {STYLE_OPTIONS.map(opt => (
                  <SelectionCard
                    key={opt.id}
                    title={opt.title}
                    color={opt.color}
                    imageUrl={opt.imageUrl}
                    selected={style === opt.id}
                    onClick={() => setStyle(opt.id)}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Footer with Safe Area */}
      <div className="px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-white border-t border-gray-100 shrink-0">
        <Button 
          fullWidth 
          onClick={handleNext} 
          disabled={!canProceed()}
        >
          {isSubmitting ? "Sending..." : (step === 3 ? "Generate Designs" : "Next Step")}
        </Button>
      </div>
    </div>
  );
};
