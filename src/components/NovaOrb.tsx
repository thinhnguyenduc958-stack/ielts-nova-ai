import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NovaState } from '../types';
import { NovaSymbol } from './NovaLogo';
import { Mic, PenTool, BookOpen, Headphones, Bookmark, X, Sparkles } from 'lucide-react';

interface NovaOrbProps {
  state?: NovaState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onClick?: () => void;
  showSparkle?: boolean;
  showLabel?: boolean;
  message?: string;
  interactivePanel?: boolean;
  onActionSelect?: (action: string) => void;
}

/**
 * SIGNATURE NOVA AI CORE (V3 Architectural System)
 * Designed strictly on a pristine white surface:
 * - Concentric hairline indigo orbital tracks with subtle rotation
 * - Planetary satellite nodes with lime/mint beacon
 * - Central luminous white disc with subtle ambient indigo shadow
 * - Geometric NOVA symbol that activates upon interaction
 * - Interactive conversation panel when clicked ("Hi. I'm NOVA. What should we work on today?")
 */
export const NovaOrb: React.FC<NovaOrbProps> = ({
  state = 'idle',
  size = 'md',
  className = '',
  onClick,
  showLabel = false,
  message,
  interactivePanel = false,
  onActionSelect,
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';

  const sizeMap = {
    sm: {
      outer: 'w-10 h-10',
      core: 'w-7 h-7',
      symbolSize: 16,
      orbitRings: false,
    },
    md: {
      outer: 'w-16 h-16',
      core: 'w-12 h-12',
      symbolSize: 22,
      orbitRings: true,
    },
    lg: {
      outer: 'w-24 h-24',
      core: 'w-18 h-18',
      symbolSize: 30,
      orbitRings: true,
    },
    hero: {
      outer: 'w-52 h-52 sm:w-60 sm:h-60',
      core: 'w-28 h-28 sm:w-32 sm:h-32',
      symbolSize: 46,
      orbitRings: true,
    },
  }[size];

  const handleCoreClick = () => {
    if (interactivePanel) {
      setPanelOpen((prev) => !prev);
    }
    onClick?.();
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer System Boundary */}
      <div
        onClick={handleCoreClick}
        className={`relative flex items-center justify-center cursor-pointer ${sizeMap.outer}`}
        role="button"
        tabIndex={0}
        aria-label={`NOVA AI Core (${state})`}
      >
        {/* Soft Ambient Field (Light indigo aura, subtle shadow) */}
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.08, 1] : isListening ? [1, 1.05, 1] : isThinking ? [0.98, 1.04, 0.98] : [1, 1.02, 1],
            opacity: isListening || isSpeaking ? [0.35, 0.65, 0.35] : [0.15, 0.25, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: isSpeaking ? 1.6 : isThinking ? 1.2 : 4,
            ease: 'easeInOut',
          }}
          className="absolute inset-2 rounded-full bg-indigo-200/40 blur-2xl pointer-events-none"
        />

        {/* 1. OUTER ORBITAL TRACK (Hero / Lg sizes) */}
        {sizeMap.orbitRings && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: isThinking ? 8 : isListening ? 14 : 32,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-full border border-indigo-200/50 pointer-events-none"
          >
            {/* Primary Satellite Node with Mint Accent */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <span className="h-3 w-3 rounded-full border-2 border-white bg-[#10B981] shadow-xs" />
            </div>
          </motion.div>
        )}

        {/* 2. SECONDARY COUNTER-ROTATING ELLIPTICAL ORBIT */}
        {size === 'hero' && (
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: isThinking ? 10 : 40,
              ease: 'linear',
            }}
            className="absolute inset-4 rounded-full border border-dashed border-violet-200/60 pointer-events-none"
          >
            {/* Soft violet micro-particle */}
            <div className="absolute -bottom-1 right-1/4 h-2 w-2 rounded-full bg-indigo-500 shadow-2xs" />
          </motion.div>
        )}

        {/* 3. CENTRAL WHITE CIRCULAR PEDESTAL (The Signature Core Surface) */}
        <motion.div
          animate={{
            scale: panelOpen || isHovered ? 1.05 : isSpeaking ? 1.03 : 1,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative z-10 flex items-center justify-center rounded-full bg-white border border-indigo-100 shadow-[0_8px_30px_rgb(79,70,229,0.12)] transition-shadow hover:shadow-[0_12px_36px_rgb(79,70,229,0.18)] ${sizeMap.core}`}
        >
          {/* Subtle concentric hairline ring inside core */}
          <div className="absolute inset-1.5 rounded-full border border-indigo-50/90 pointer-events-none" />

          {/* NOVA Geometric Symbol */}
          <NovaSymbol
            size={sizeMap.symbolSize}
            variant="indigo"
            className="transition-transform duration-300 group-hover:scale-105"
          />

          {/* Micro pulsing beacon node */}
          <span className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-[#10B981] ring-2 ring-white" />
        </motion.div>

        {/* 4. SOUND WAVEFORM (When Speaking or Listening) */}
        {(isSpeaking || isListening) && size === 'hero' && (
          <div className="absolute -bottom-6 flex items-center gap-1.5 pointer-events-none">
            {[10, 22, 16, 26, 18, 24, 12].map((h, idx) => (
              <motion.span
                key={idx}
                animate={{ height: [6, h, 6] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7 + (idx % 3) * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-1 rounded-full bg-indigo-600"
              />
            ))}
          </div>
        )}
      </div>

      {/* Optional Companion Label or State Description */}
      {message && (
        <p className="mt-3 text-xs font-medium text-[#5C616B] text-center max-w-xs leading-relaxed">
          {message}
        </p>
      )}

      {showLabel && !message && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#111318] uppercase">
            NOVA CORE
          </span>
        </div>
      )}

      {/* 5. INTERACTIVE CONVERSATION PANEL (Section 10 Requirement) */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full mt-4 z-40 w-72 sm:w-80 rounded-2xl border border-indigo-100 bg-white p-4 shadow-xl shadow-indigo-500/10 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <Sparkles className="h-3 w-3" />
                </span>
                <span className="text-xs font-bold text-[#111318]">NOVA Companion</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPanelOpen(false);
                }}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Conversational Prompt */}
            <div className="py-2.5">
              <p className="text-xs font-semibold text-[#111318]">"Hi. I'm NOVA."</p>
              <p className="text-[11px] text-[#5C616B] mt-0.5">What should we work on today?</p>
            </div>

            {/* Quick Action Choices */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { label: 'Speaking', icon: Mic, id: 'speaking', color: 'text-amber-600 bg-amber-50' },
                { label: 'Writing', icon: PenTool, id: 'writing', color: 'text-violet-600 bg-violet-50' },
                { label: 'Reading', icon: BookOpen, id: 'reading', color: 'text-blue-600 bg-blue-50' },
                { label: 'Listening', icon: Headphones, id: 'listening', color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Vocabulary', icon: Bookmark, id: 'vocabulary', color: 'text-indigo-600 bg-indigo-50' },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPanelOpen(false);
                      onActionSelect?.(act.id);
                    }}
                    className="flex items-center gap-2 rounded-xl border border-stone-200/70 p-2 text-left hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-xs font-semibold text-[#111318]"
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${act.color}`}>
                      <Icon className="h-3 w-3" />
                    </span>
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
