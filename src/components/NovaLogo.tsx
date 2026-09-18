import React from 'react';

export interface NovaSymbolProps {
  size?: number | string;
  variant?: 'indigo' | 'white' | 'monochrome' | 'dark';
  className?: string;
}

/**
 * ORIGINAL GEOMETRIC NOVA SYMBOL
 * Conceptual architectural fusion of:
 * - Geometric letter 'N' (monumental vertical steles and forward kinetic diagonal)
 * - Orbital trajectory (elliptical planetary coordinate ring)
 * - Luminous Nova / Star (4-point central diamond precision spark)
 * - AI Intelligence node (lime/mint pulse beacon)
 */
export const NovaSymbol: React.FC<NovaSymbolProps> = ({
  size = 32,
  variant = 'indigo',
  className = '',
}) => {
  const isWhite = variant === 'white';
  const isDark = variant === 'dark';
  const isMono = variant === 'monochrome';

  // Core Palette
  const primaryColor = isWhite ? '#FFFFFF' : isDark ? '#111318' : isMono ? 'currentColor' : '#4F46E5';
  const secondaryColor = isWhite ? '#E0E7FF' : isDark ? '#4F46E5' : isMono ? 'currentColor' : '#7C3AED';
  const accentMint = isWhite ? '#A7F3D0' : isDark ? '#10B981' : isMono ? 'currentColor' : '#10B981';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="NOVA Geometric Symbol"
    >
      <defs>
        <linearGradient id="nova-grad-n" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id="nova-grad-orbit" x1="2" y1="18" x2="34" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.85" />
          <stop offset="60%" stopColor={secondaryColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accentMint} stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Planetary Orbital Ring (Tilted at 28 degrees) */}
      <ellipse
        cx="18"
        cy="18"
        rx="15"
        ry="7"
        transform="rotate(-28 18 18)"
        stroke="url(#nova-grad-orbit)"
        strokeWidth="1.6"
        strokeDasharray="48 6"
        strokeLinecap="round"
      />

      {/* Orbiting Satellite Node (Intelligence Anchor) */}
      <circle
        cx="30"
        cy="12"
        r="2"
        fill={accentMint}
        stroke={isWhite ? '#4F46E5' : '#FFFFFF'}
        strokeWidth="1"
      />

      {/* Letter 'N' Left Pillar */}
      <rect
        x="8"
        y="7"
        width="3.6"
        height="22"
        rx="1.8"
        fill="url(#nova-grad-n)"
      />

      {/* Letter 'N' Right Pillar */}
      <rect
        x="24.4"
        y="7"
        width="3.6"
        height="22"
        rx="1.8"
        fill="url(#nova-grad-n)"
      />

      {/* Dynamic Kinetic Diagonal Beam */}
      <path
        d="M9.8 8.8L26.2 27.2"
        stroke="url(#nova-grad-n)"
        strokeWidth="3.6"
        strokeLinecap="round"
      />

      {/* Central Nova Radiant Diamond (4-Point Star) */}
      <path
        d="M18 13.5L19.4 17.2L22.5 18L19.4 18.8L18 22.5L16.6 18.8L13.5 18L16.6 17.2Z"
        fill={accentMint}
      />

      {/* Core Intelligence Spark */}
      <circle
        cx="18"
        cy="18"
        r="1.2"
        fill="#FFFFFF"
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
  showSubtitle = false,
  themeMode = 'light',
  className = '',
  onClick,
}) => {
  const isOnIndigo = themeMode === 'on-indigo';

  const iconSizes = {
    xs: 20,
    sm: 26,
    md: 32,
    lg: 38,
    xl: 48,
  }[size];

  const titleSizes = {
    xs: 'text-xs',
    sm: 'text-sm font-black',
    md: 'text-base font-black',
    lg: 'text-lg font-black',
    xl: 'text-2xl font-black',
  }[size];

  // App Icon variant (Squircle for App Store / PWA install)
  if (variant === 'app-icon') {
    return (
      <div
        onClick={onClick}
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#312E81] shadow-lg shadow-indigo-500/25 select-none ${
          onClick ? 'cursor-pointer hover:opacity-95' : ''
        } ${className}`}
        style={{ width: typeof size === 'number' ? size : 56, height: typeof size === 'number' ? size : 56 }}
      >
        <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
        <NovaSymbol size={34} variant="white" />
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
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Icon frame */}
      <div
        className={`relative flex items-center justify-center rounded-xl p-1 transition-all ${
          isOnIndigo
            ? 'bg-white/10 text-white'
            : 'bg-indigo-50/70 border border-indigo-100 group-hover:border-indigo-300'
        }`}
      >
        <NovaSymbol
          size={iconSizes}
          variant={isOnIndigo ? 'white' : 'indigo'}
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-2">
          <span
            className={`tracking-tight ${
              isOnIndigo ? 'text-white' : 'text-[#111318]'
            } ${titleSizes}`}
          >
            IELTS NOVA <span className="text-indigo-600">AI</span>
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`text-[10px] tracking-wider uppercase font-bold ${
              isOnIndigo ? 'text-indigo-200' : 'text-[#5C616B]'
            }`}
          >
            Editorial Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
