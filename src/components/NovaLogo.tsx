import React from 'react';

interface NovaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const NovaLogo: React.FC<NovaLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSize = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base sm:text-lg',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Refined Minimalist NOVA Symbol */}
      <div
        className={`relative flex ${iconSize} shrink-0 items-center justify-center rounded-xl border border-stone-200/90 bg-white text-indigo-600 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-indigo-400`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          {/* Subtle concentric orbit geometry */}
          <circle cx="12" cy="12" r="7.5" stroke="currentColor" className="opacity-40" />
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
          {/* North and East orbital focal nodes */}
          <circle cx="12" cy="4.5" r="1" fill="currentColor" />
          <circle cx="19.5" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="19.5" r="1" fill="currentColor" />
          <circle cx="4.5" cy="12" r="1" fill="currentColor" />
        </svg>
      </div>

      {/* Clean Brand Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-[#111111] dark:text-[#F3F4F6] ${textSize}`}>
            IELTS NOVA AI
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-normal text-[#777777] dark:text-stone-400">
            Personal IELTS AI Companion
          </span>
        )}
      </div>
    </div>
  );
};
