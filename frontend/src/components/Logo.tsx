import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12'
  };

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none cursor-pointer ${className}`}>
      {/* Brand Icon: Combining Leaf, Shield & Tech Hexagon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-[#4CAF50] via-[#7CB342] to-[#245B35] shadow-md text-white overflow-hidden`}>
        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 fill-current transform hover:scale-110 transition-transform">
          <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15.5c-2.48-1.02-4-3.4-4-6.5 0-2.5 1.5-4.5 4-5.5v12zm2 0V5.5c2.5 1 4 3 4 5.5 0 3.1-1.52 5.48-4 6.5z"/>
        </svg>
        <div className="absolute top-0 right-0 w-2 h-2 bg-[#FFC107] rounded-full animate-ping"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-[#245B35] font-extrabold text-xl leading-none flex items-center gap-1">
          PackWise <span className="bg-[#4CAF50] text-white text-xs px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">AI</span>
        </span>
        <span className="text-[10px] text-[#7CB342] font-semibold tracking-wider uppercase mt-0.5">
          Intelligent Packaging
        </span>
      </div>
    </div>
  );
};
