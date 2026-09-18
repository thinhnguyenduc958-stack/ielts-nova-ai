import React from 'react';

export interface NovaSymbolProps {
  size?: number | string;
  variant?: 'indigo' | 'white' | 'monochrome' | 'dark';
  className?: string;
}

/**
 * ORIGINAL NOVA SYMBOL
 * Fusion of:
 * - Letter N (vertical pillars and dynamic forward diagonal)
 * - Orbital movement (sweeping elliptical trajectories)
 * - Language intelligence & nova star (radiant core focal node)
 */
export const NovaSymbol: React.FC<NovaSymbolProps> = ({
  size = 28,
  variant = 'indigo',
  className = '',
}) => {
  const isWhite = variant === 'white';
  const isDark = variant === 'dark';
  const isMono = variant === 'monochrome';

  // Primary colors
  const primaryColor = isWhite ? '#FFFFFF' : isDark ? '#111318' : isMono ? 'currentColor' : '#4F46E5';
  const secondaryColor = isWhite ? '#C7D2FE' : isDark ? '#626873' : isMono ? 'currentColor' : '#7C3AED';
  const accentColor = isWhite ? '#D9F99D' : isDark ? '#4F46E5' : isMono ? 'currentColor' : '#10B981';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="NOVA Symbol"
    >
      <defs>
        <linearGradient id="nova-grad-primary" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id="nova-orbit-grad" x1="2" y1="16" x2="30" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
          <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Sweeping Orbital Ellipse (Tilted 25 degrees) */}
      <ellipse
        cx="16"
        cy="16"
        rx="13.5"
        ry="6.5"
        transform="rotate(-26 16 16)"
        stroke="url(#nova-orbit-grad)"
        strokeWidth="1.5"
        strokeDasharray="42 6"
        className="opacity-70"
      />

      {/* Letter 'N' Geometric Pillar Left */}
      <rect
        x="7.5"
        y="6.5"
        width="3"
        height="19"
        rx="1.5"
        fill="url(#nova-grad-primary)"
      />

      {/* Letter 'N' Geometric Pillar Right */}
      <rect
        x="21.5"
        y="6.5"
        width="3"
        height="19"
        rx="1.5"
        fill="url(#nova-grad-primary)"
      />

      {/* Forward Diagonal Energy Beam connecting pillars */}
      <path
        d="M8.5 8L23.5 24"
        stroke="url(#nova-grad-primary)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Central Nova Star / Luminous Intelligence Node */}
      <circle
        cx="16"
        cy="16"
        r="2.5"
        fill={accentColor}
        className="drop-shadow-xs"
      />

      {/* 4-point Micro Radiance Spark */}
      <path
        d="M16 11.5V13M16 19V20.5M11.5 16H13M19 16H20.5"
        stroke={isWhite ? '#FFFFFF' : '#4F46E5'}
        strokeWidth="1.2"
        strokeLinecap="round"
        className="opacity-60"
      />
    </svg>
  );
};

export interface NovaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'symbol' | 'app-icon' | 'monochrome';
  showSubtitle?: boolean;
  themeMode?: 'light' | 'dark' | 'on-indigo';
  className?: string;
  onClick?: () => void;
}

export const NovaLogo: React.FC<NovaLogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  themeMode = 'light',
  className = '',
  onClick,
}) => {
  const isOnIndigo = themeMode === 'on-indigo';

  const iconSizes = {
    xs: 18,
    sm: 22,
    md: 26,
    lg: 32,
    xl: 44,
  }[size];

  const titleSizes = {
    xs: 'text-xs',
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-xl sm:text-2xl',
  }[size];

  // App Icon variant (Squircle with gradient for mobile / app store)
  if (variant === 'app-icon') {
    return (
      <div
        onClick={onClick}
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#312E81] p-2.5 shadow-md shadow-indigo-500/20 select-none ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        style={{ width: typeof size === 'number' ? size : 48, height: typeof size === 'number' ? size : 48 }}
      >
        <div className="absolute inset-0 rounded-2xl border border-white/20" />
        <NovaSymbol size={30} variant="white" />
      </div>
    );
  }

  // Symbol only
  if (variant === 'symbol') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <NovaSymbol
          size={iconSizes}
          variant={isOnIndigo ? 'white' : 'indigo'}
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Icon frame */}
      <div
        className={`relative flex items-center justify-center rounded-xl p-1.5 transition-all ${
          isOnIndigo
            ? 'bg-white/10 text-white'
            : 'border border-stone-200/90 bg-white text-indigo-600 shadow-2xs dark:border-stone-800 dark:bg-stone-900'
        }`}
      >
        <NovaSymbol
          size={iconSizes}
          variant={isOnIndigo ? 'white' : 'indigo'}
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${
              isOnIndigo
                ? 'text-white'
                : 'text-[#111318] dark:text-white'
            } ${titleSizes}`}
          >
            IELTS NOVA AI
          </span>
          <span className="rounded-sm bg-indigo-50 px-1 py-0.5 text-[9px] font-bold tracking-wider text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            PRO
          </span>
        </div>

        {showSubtitle && variant === 'full' && (
          <span
            className={`mt-1 text-[10px] tracking-normal ${
              isOnIndigo
                ? 'text-indigo-200'
                : 'text-[#626873] dark:text-stone-400'
            }`}
          >
            Editorial IELTS Companion
          </span>
        )}
      </div>
    </div>
  );
};
