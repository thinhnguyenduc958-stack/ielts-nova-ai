import React from 'react';
import { motion } from 'motion/react';
import { NovaState } from '../types';

interface NovaOrbProps {
  state?: NovaState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onClick?: () => void;
  showSparkle?: boolean;
  showLabel?: boolean;
}

export const NovaOrb: React.FC<NovaOrbProps> = ({
  state = 'idle',
  size = 'md',
  className = '',
  onClick,
  showLabel = false,
}) => {
  // Dimensions
  const config = {
    sm: {
      container: 'w-10 h-10',
      centerCircle: 'w-6 h-6',
      centerIcon: 'w-2.5 h-2.5',
      orbit1: 'w-8 h-8',
      labelSize: 'text-[9px]',
    },
    md: {
      container: 'w-16 h-16',
      centerCircle: 'w-9 h-9',
      centerIcon: 'w-3.5 h-3.5',
      orbit1: 'w-14 h-14',
      labelSize: 'text-[10px]',
    },
    lg: {
      container: 'w-24 h-24',
      centerCircle: 'w-14 h-14',
      centerIcon: 'w-5 h-5',
      orbit1: 'w-20 h-20',
      labelSize: 'text-xs',
    },
    hero: {
      container: 'w-36 h-36 sm:w-44 sm:h-44',
      centerCircle: 'w-20 h-20 sm:w-24 sm:h-24',
      centerIcon: 'w-7 h-7 sm:w-8 sm:h-8',
      orbit1: 'w-32 h-32 sm:w-38 sm:h-38',
      labelSize: 'text-xs tracking-widest',
    },
  }[size];

  // State colors: subtle, refined indigo/blue palette designed for pure white surfaces
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      role={onClick ? 'button' : 'presentation'}
      aria-label={`NOVA AI Core (${state})`}
    >
      {/* Top minimal coordinates: · ✦ · */}
      {size === 'hero' && (
        <div className="mb-2 flex items-center gap-2 text-[10px] text-stone-400 dark:text-stone-500">
          <span className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-600" />
          <span className="text-indigo-600 dark:text-indigo-400 text-xs">✦</span>
          <span className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-600" />
        </div>
      )}

      <div className={`relative flex items-center justify-center ${config.container}`}>
        {/* Softest accent light bloom (very low opacity, subtle on pure white) */}
        <motion.div
          animate={{
            scale: isSpeaking || isListening ? [1, 1.08, 1] : [1, 1.03, 1],
            opacity: isListening ? [0.15, 0.25, 0.15] : [0.08, 0.14, 0.08],
          }}
          transition={{ repeat: Infinity, duration: isListening ? 1.8 : 4, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-indigo-500 blur-xl"
        />

        {/* Thin Orbital Ring 1 (outer clean dashed line) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: isThinking ? 8 : 28,
            ease: 'linear',
          }}
          className={`absolute rounded-full border border-stone-200/90 dark:border-stone-800 ${config.orbit1}`}
        >
          {/* Subtle micro satellite node ◌ */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full border border-indigo-400/80 bg-white dark:bg-stone-900" />
        </motion.div>

        {/* Thin Orbital Ring 2 (counter-rotation with subtle satellite) */}
        {size === 'hero' && (
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: 36,
              ease: 'linear',
            }}
            className="absolute h-28 w-28 sm:h-32 sm:w-32 rounded-full border border-dashed border-stone-200/80 dark:border-stone-800/80"
          >
            <div className="absolute -bottom-0.5 right-4 h-1.5 w-1.5 rounded-full bg-indigo-500/70" />
          </motion.div>
        )}

        {/* Central Geometric Core ◯ */}
        <motion.div
          animate={{
            scale: isThinking ? [1, 1.04, 0.98, 1] : isSpeaking ? [1, 1.06, 1] : [1, 1.02, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: isThinking ? 2 : isSpeaking ? 1.4 : 3.5,
            ease: 'easeInOut',
          }}
          className={`relative z-10 flex items-center justify-center rounded-full border border-stone-200/90 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900 ${config.centerCircle}`}
        >
          {/* Inner clean ring */}
          <div className="absolute inset-1 rounded-full border border-indigo-100/80 dark:border-indigo-950" />

          {/* Minimalist central coordinate icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`${config.centerIcon} text-indigo-600 dark:text-indigo-400`}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isListening ? (
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            ) : isThinking ? (
              <>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v3m0 12v3m9-9h-3M6 12H3" strokeWidth="1.75" />
              </>
            ) : (
              <>
                {/* 4-point minimalist diamond node */}
                <path d="M12 3L14.2 9.8L21 12L14.2 14.2L12 21L9.8 14.2L3 12L9.8 9.8L12 3Z" fill="currentColor" />
              </>
            )}
          </svg>
        </motion.div>

        {/* Orbit coordinate pair ◌ ◌ on sides for hero */}
        {size === 'hero' && (
          <div className="pointer-events-none absolute -bottom-1 flex w-full justify-between px-2 text-[10px] text-stone-400">
            <span className="h-1.5 w-1.5 rounded-full border border-stone-300 dark:border-stone-700" />
            <span className="h-1.5 w-1.5 rounded-full border border-stone-300 dark:border-stone-700" />
          </div>
        )}
      </div>

      {/* Minimal Bottom Wordmark: NOVA */}
      {showLabel && (
        <span
          className={`mt-2.5 font-mono font-medium tracking-widest text-stone-700 uppercase dark:text-stone-300 ${config.labelSize}`}
        >
          NOVA
        </span>
      )}
    </div>
  );
};
