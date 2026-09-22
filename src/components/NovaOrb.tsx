import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NovaState } from '../types';
import { NovaSymbol } from './NovaLogo';
import { Mic, PenTool, BookOpen, Headphones, Bookmark, MessageSquare, X, Sparkles } from 'lucide-react';

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
 * NOVA AI CORE 2.0
 * Signature visual element of IELTS NOVA AI:
 * - Geometric NOVA Symbol
 * - Pristine white central core with subtle ambient shadow
 * - 3–4 delicate concentric orbital rings with stateful animation
 * - Micro-particles with single mint/lime accent (#10B981)
 * - Subtle light effect without aggressive neon
 * - State animations: IDLE (slow breathing), LISTENING (outer ring reacts),
 *   THINKING (slow orbit rotation), SPEAKING (core pulses), SUCCESS (brief elegant expansion)
 * - Compact NOVA command panel ("How can NOVA help?") with rock-solid close interaction
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
  const isSuccess = state === 'success';

  // ESC key listener for NOVA command panel
  useEffect(() => {
    if (!panelOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panelOpen]);

  const sizeMap = {
    sm: {
      outer: 'w-10 h-10',
      core: 'w-7 h-7',
      symbolSize: 16,
      hasRings: false,
    },
    md: {
      outer: 'w-16 h-16',
      core: 'w-12 h-12',
      symbolSize: 22,
      hasRings: true,
      ringsCount: 2,
    },
    lg: {
      outer: 'w-28 h-28',
      core: 'w-18 h-18',
      symbolSize: 32,
      hasRings: true,
      ringsCount: 3,
    },
    hero: {
      outer: 'w-56 h-56 sm:w-64 sm:h-64',
      core: 'w-28 h-28 sm:w-32 sm:h-32',
      symbolSize: 48,
      hasRings: true,
      ringsCount: 4,
    },
  }[size];

  const handleCoreClick = () => {
    if (interactivePanel) {
      setPanelOpen(true);
    }
    onClick?.();
  };

  const handleSelectAction = (actId: string) => {
    setPanelOpen(false);
    onActionSelect?.(actId);
  };

  return (
    <>
      <div
        className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer System Container */}
        <div
          onClick={handleCoreClick}
          className={`relative flex items-center justify-center cursor-pointer ${sizeMap.outer}`}
          role="button"
          tabIndex={0}
          aria-label={`NOVA AI Core (${state})`}
        >
          {/* Subtle Ambient Light Field (Soft indigo/violet energy) */}
          <motion.div
            animate={{
              scale: isSpeaking
                ? [1, 1.08, 1]
                : isListening
                ? [1, 1.06, 1]
                : isSuccess
                ? [1, 1.15, 1]
                : isThinking
                ? [0.98, 1.04, 0.98]
                : [1, 1.02, 1],
              opacity: isListening || isSpeaking
                ? [0.25, 0.5, 0.25]
                : isSuccess
                ? [0.4, 0.7, 0.3]
                : [0.12, 0.2, 0.12],
            }}
            transition={{
              repeat: isSuccess ? 1 : Infinity,
              duration: isSpeaking ? 1.4 : isThinking ? 2 : 4,
              ease: 'easeInOut',
            }}
            className="absolute inset-4 rounded-full bg-indigo-300/30 blur-2xl pointer-events-none"
          />

          {/* 1. ORBITAL RING 1: Innermost Delicate Hairline Track */}
          {sizeMap.hasRings && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: isThinking ? 10 : 36,
                ease: 'linear',
              }}
              className="absolute inset-6 sm:inset-7 rounded-full border border-indigo-200/60 pointer-events-none"
            >
              {/* Small Indigo Satellite Particle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-2xs" />
            </motion.div>
          )}

          {/* 2. ORBITAL RING 2: Middle Dashed Orbital Track with Mint Accent */}
          {sizeMap.hasRings && (
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                repeat: Infinity,
                duration: isThinking ? 14 : 44,
                ease: 'linear',
              }}
              className="absolute inset-3 sm:inset-4 rounded-full border border-dashed border-violet-200/50 pointer-events-none"
            >
              {/* Signature Mint/Lime Accent Beacon (#10B981) */}
              <div className="absolute -top-1.5 left-1/4 flex items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-[#10B981] shadow-xs" />
              </div>
            </motion.div>
          )}

          {/* 3. ORBITAL RING 3: Outer Ring reacting to sound or state */}
          {sizeMap.hasRings && (size === 'lg' || size === 'hero') && (
            <motion.div
              animate={{
                rotate: 360,
                scale: isListening ? [1, 1.05, 1] : isSuccess ? [1, 1.08, 1] : 1,
              }}
              transition={{
                rotate: { repeat: Infinity, duration: isThinking ? 16 : 56, ease: 'linear' },
                scale: { repeat: isListening ? Infinity : 1, duration: 1.2, ease: 'easeInOut' },
              }}
              className="absolute inset-0 rounded-full border border-indigo-100/80 pointer-events-none"
            >
              {/* Secondary delicate particle */}
              <div className="absolute bottom-2 right-1/4 h-2 w-2 rounded-full border border-white bg-indigo-400/80 shadow-2xs" />
            </motion.div>
          )}

          {/* 4. ORBITAL RING 4: Outermost expansion halo (Hero size) */}
          {size === 'hero' && (
            <motion.div
              animate={{
                scale: isSpeaking ? [1, 1.03, 1] : isListening ? [1, 1.06, 1] : [1, 1.015, 1],
                opacity: isListening || isSpeaking ? [0.6, 0.9, 0.6] : [0.3, 0.5, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: isSpeaking ? 1.5 : isListening ? 1.2 : 4.5,
                ease: 'easeInOut',
              }}
              className="absolute -inset-2 rounded-full border border-indigo-100/40 pointer-events-none"
            />
          )}

          {/* CENTRAL CORE: Pristine White Circular Pedestal */}
          <motion.div
            animate={{
              scale: isSuccess
                ? [1, 1.08, 1]
                : isSpeaking
                ? [1, 1.04, 1]
                : isHovered
                ? 1.04
                : [1, 1.015, 1],
            }}
            transition={{
              scale: {
                repeat: isSuccess ? 1 : isHovered ? 0 : Infinity,
                duration: isSpeaking ? 1.2 : 3.6,
                ease: 'easeInOut',
              },
            }}
            className={`relative z-10 flex items-center justify-center rounded-full bg-white border border-indigo-100/90 shadow-[0_8px_30px_rgb(79,70,229,0.12)] transition-shadow hover:shadow-[0_12px_36px_rgb(79,70,229,0.18)] ${sizeMap.core}`}
          >
            {/* Subtle concentric hairline ring inside core */}
            <div className="absolute inset-1.5 rounded-full border border-indigo-50 pointer-events-none" />

            {/* NOVA Geometric Symbol */}
            <NovaSymbol
              size={sizeMap.symbolSize}
              variant="indigo"
              className="transition-transform duration-300 group-hover:scale-105"
            />

            {/* Micro active status dot with mint accent */}
            <span className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-[#10B981] ring-2 ring-white" />
          </motion.div>

          {/* Sound Waveform Indicator (When Speaking or Listening) */}
          {(isSpeaking || isListening) && size === 'hero' && (
            <div className="absolute -bottom-6 flex items-center gap-1.5 pointer-events-none">
              {[8, 20, 14, 26, 18, 22, 10].map((h, idx) => (
                <motion.span
                  key={idx}
                  animate={{ height: [6, h, 6] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + (idx % 3) * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="w-1 rounded-full bg-indigo-600"
                />
              ))}
            </div>
          )}
        </div>

        {/* Optional Companion Message */}
        {message && (
          <p className="mt-3 text-xs font-medium text-[#5C616B] text-center max-w-xs leading-relaxed">
            {message}
          </p>
        )}

        {/* Optional NOVA Label */}
        {showLabel && !message && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-[#111318] uppercase">
              NOVA CORE 2.0
            </span>
          </div>
        )}
      </div>

      {/* 05 — NOVA INTERACTION: Compact NOVA Command Panel */}
      <AnimatePresence>
        {panelOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/25 backdrop-blur-2xs cursor-pointer pointer-events-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPanelOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-sm overflow-hidden rounded-3xl border border-indigo-100 bg-white p-6 shadow-2xl shadow-indigo-600/12 text-left relative cursor-default pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <NovaSymbol size={18} variant="indigo" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111318]">How can NOVA help?</h3>
                    <p className="text-[11px] text-[#5C616B]">Choose an IELTS skill or ask a question</p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-close-nova-panel"
                  data-testid="close-nova-panel"
                  onClick={() => setPanelOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-400 hover:text-[#111318] hover:bg-stone-100 active:scale-95 transition-all cursor-pointer z-20 pointer-events-auto shadow-2xs"
                  aria-label="Close"
                  title="Close (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Six Actions: Speaking, Writing, Reading, Listening, Vocabulary, Ask NOVA */}
              <div className="grid grid-cols-2 gap-2.5 pt-4">
                {[
                  { id: 'speaking', label: 'Speaking', desc: 'Mock examiner drills', icon: Mic, color: 'text-amber-600 bg-amber-50' },
                  { id: 'writing', label: 'Writing', desc: 'Task 1 & 2 evaluation', icon: PenTool, color: 'text-violet-600 bg-violet-50' },
                  { id: 'reading', label: 'Reading', desc: 'Academic comprehension', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
                  { id: 'listening', label: 'Listening', desc: 'Distractor recognition', icon: Headphones, color: 'text-emerald-600 bg-emerald-50' },
                  { id: 'vocabulary', label: 'Vocabulary', desc: 'Band 7.5+ Lexical vault', icon: Bookmark, color: 'text-indigo-600 bg-indigo-50' },
                  { id: 'tutor', label: 'Ask NOVA', desc: 'Instant AI conversation', icon: MessageSquare, color: 'text-fuchsia-600 bg-fuchsia-50' },
                ].map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleSelectAction(act.id)}
                      className="group flex flex-col items-start rounded-2xl border border-stone-200/80 p-3 hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-xs active:scale-98 transition-all cursor-pointer pointer-events-auto"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${act.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold text-[#111318] group-hover:text-indigo-700">
                          {act.label}
                        </span>
                      </div>
                      <span className="mt-1.5 text-[10px] text-[#5C616B] leading-tight">
                        {act.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer hint */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#5C616B]">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-indigo-600" />
                  Powered by Gemini 2.5
                </span>
                <span className="text-[10px] font-mono text-stone-400">ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
