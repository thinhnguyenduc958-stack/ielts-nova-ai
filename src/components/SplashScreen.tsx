import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NovaOrb } from './NovaOrb';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 350);
    }, 1100);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-[#111111] select-none dark:bg-[#111215] dark:text-white"
        >
          <div className="relative flex flex-col items-center">
            {/* Minimalist NOVA AI Core */}
            <NovaOrb state="idle" size="lg" showSparkle={false} />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mt-6 text-center space-y-1.5"
            >
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                IELTS NOVA AI
              </h1>
              <p className="text-xs text-[#777777] dark:text-stone-400">
                Your Personal IELTS AI Companion
              </p>
            </motion.div>

            {/* Micro loading line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="mt-6 h-[2px] rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden"
            >
              <div className="h-full w-full bg-indigo-600 dark:bg-indigo-400" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
