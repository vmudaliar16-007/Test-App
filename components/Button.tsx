
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Styles for the metallic industrial look
  const baseStyles = "relative px-6 py-4 font-bold text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group";
  
  // Variant definitions
  const variants = {
    // Electric Blue Plate
    primary: "bg-blue-sheen text-white shadow-lg shadow-brand-500/30 border-2 border-brand-400 rounded-sm hover:brightness-110",
    
    // Metallic Steel Plate
    secondary: "bg-metal-gradient text-metal-900 shadow-metal border border-metal-200 rounded-sm hover:bg-white",
    
    // Tech Outline
    outline: "border-2 border-brand-500 text-brand-500 hover:bg-brand-50 rounded-sm",
    
    // Simple
    ghost: "text-metal-500 hover:bg-metal-100 normal-case tracking-normal rounded-lg"
  };

  const isIndustrial = variant === 'primary' || variant === 'secondary';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Decorative Screws for Industrial Variants */}
      {isIndustrial && (
        <>
          <div className="rivet rivet-tl opacity-80"></div>
          <div className="rivet rivet-tr opacity-80"></div>
          <div className="rivet rivet-bl opacity-80"></div>
          <div className="rivet rivet-br opacity-80"></div>
        </>
      )}
      
      <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
        {children}
      </span>
    </button>
  );
};
