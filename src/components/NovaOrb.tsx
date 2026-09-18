import React from 'react';
import { motion } from 'motion/react';
import { NovaState } from '../types';
import { NovaSymbol } from './NovaLogo';

interface NovaOrbProps {
  state?: NovaState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onClick?: () => void;
  showSparkle?: boolean;
  showLabel?: boolean;
  message?: string;
}

/**
 * LAYERED NOVA AI CORE
 * Construction:
 * 1. Outer Orbit with orbiting micro-satellites
 * 2. Soft glow / radiant field
 * 3. Geometric core with precision concentric rings
 * 4. NOVA Symbol at center
 * 5. State-driven motion (IDLE, LISTENING, THINKING, SPEAKING, SUCCESS)
 */
export const NovaOrb: React.FC<NovaOrbProps> = ({
  state = 'idle',
  size = 'md',
  className = '',
  onClick,
  showLabel = false,
  message,
}) => {
  const isIdle = state === 'idle';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';
  const isSuccess = state === 'success';

  const sizeConfig = {
    sm: {
      box: 'w-10 h-10',
      core: 'w-7 h-7',
      symbolSize: 14,
      orbit1: 'w-9 h-9',
      orbit2: 'w-11 h-11',
      labelText: 'text-[9px]',
    },
    md: {
      box: 'w-16 h-16',
      core: 'w-11 h-11',
      symbolSize: 20,
      orbit1: 'w-15 h-15',
      orbit2: 'w-18 h-18',
      labelText: 'text-[11px]',
    },
    lg: {
      box: 'w-24 h-24',
      core: 'w-16 h-16',
      symbolSize: 28,
      orbit1: 'w-22 h-22',
      orbit2: 'w-26 h-26',
      labelText: 'text-xs',
    },
    hero: {
      box: 'w-36 h-36 sm:w-44 sm:h-44',
      core: 'w-24 h-24 sm:w-28 sm:h-28',
      symbolSize: 42,
      orbit1: 'w-34 h-34 sm:w-40 sm:h-40',
      orbit2: 'w-42 h-42 sm:w-48 sm:h-48',
      labelText: 'text-xs tracking-widest',
    },
  }[size];

  // Dynamic glow color based on state
  const glowColor = isSuccess
    ? 'bg-emerald-400/25'
    : isListening
    ? 'bg-amber-400/25'
    : isSpeaking
    ? 'bg-indigo-500/25'
    : isThinking
    ? 'bg-violet-500/30'
    : 'bg-indigo-500/15';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      role={onClick ? 'button' : 'presentation'}
      aria-label={`NOVA AI Core (${state})`}
    >
      {/* Container holding layered core */}
      <div className={`relative flex items-center justify-center ${sizeConfig.box}`}>
        {/* 1. SOFT GLOW / RADIANT FIELD */}
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.15, 1] : isListening ? [1, 1.1, 1] : isThinking ? [0.95, 1.08, 0.95] : [1, 1.04, 1],
            opacity: isListening || isSpeaking ? [0.4, 0.75, 0.4] : [0.2, 0.35, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: isSpeaking ? 1.6 : isThinking ? 1.2 : 3.5,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 rounded-full blur-xl ${glowColor}`}
        />

        {/* 2. OUTER ORBIT (Layer 1) with clockwise rotation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: isThinking ? 6 : isListening ? 14 : 28,
            ease: 'linear',
          }}
          className={`absolute rounded-full border border-indigo-200/60 dark:border-indigo-900/50 ${sizeConfig.orbit1}`}
        >
          {/* Micro-satellite node */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <span className="h-2 w-2 rounded-full border border-indigo-500 bg-white shadow-xs dark:bg-stone-900" />
          </div>
        </motion.div>

        {/* 3. SECONDARY TILTED ORBIT (Layer 2) counter-clockwise for hero/lg sizes */}
        {(size === 'hero' || size === 'lg') && (
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: isThinking ? 8 : 36,
              ease: 'linear',
            }}
            className={`absolute rounded-full border border-dashed border-violet-200/60 dark:border-violet-900/50 ${sizeConfig.orbit2}`}
          >
            {/* Secondary micro-spark node */}
            <div className="absolute -bottom-1 right-1/4 h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          </motion.div>
        )}

        {/* 4. GEOMETRIC CORE CONTAINER */}
        <motion.div
          animate={{
            scale: isThinking
              ? [1, 1.04, 0.98, 1]
              : isSpeaking
              ? [1, 1.06, 0.98, 1]
              : isListening
              ? [1, 1.05, 1]
              : [1, 1.02, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: isSpeaking ? 1.4 : isThinking ? 1.8 : 3.2,
            ease: 'easeInOut',
          }}
          className={`relative z-10 flex items-center justify-center rounded-full border border-stone-200/90 bg-white shadow-sm transition-colors dark:border-stone-800 dark:bg-stone-900 ${sizeConfig.core}`}
        >
          {/* Inner hairline orbit ring */}
          <div className="absolute inset-1 rounded-full border border-indigo-50 dark:border-indigo-950/60" />

          {/* Center NOVA Symbol */}
          <NovaSymbol
            size={sizeConfig.symbolSize}
            variant="indigo"
            className="transition-transform group-hover:scale-105"
          />
        </motion.div>

        {/* 5. AUDIO WAVEFORM RIPPLES WHEN SPEAKING OR LISTENING */}
        {(isSpeaking || isListening) && size === 'hero' && (
          <div className="absolute -bottom-6 flex items-center gap-1">
            {[12, 24, 18, 28, 16, 22, 10].map((h, idx) => (
              <motion.span
                key={idx}
                animate={{ height: [6, h, 6] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + (idx % 3) * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-1 rounded-full bg-indigo-600 dark:bg-indigo-400"
              />
            ))}
          </div>
        )}
      </div>

      {/* Companion Message / Status Label */}
      {message && (
        <p className="mt-3 text-xs font-medium text-[#626873] dark:text-stone-400 text-center max-w-xs">
          {message}
        </p>
      )}

      {showLabel && !message && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className={`font-mono font-bold tracking-widest text-[#111318] uppercase dark:text-stone-200 ${sizeConfig.labelText}`}>
            NOVA CORE
          </span>
        </div>
      )}
    </div>
  );
};
