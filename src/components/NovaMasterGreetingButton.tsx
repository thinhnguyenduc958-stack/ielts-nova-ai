import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { NovaOrb } from './NovaOrb';
import { BookOpen, PenTool, Mic, Headphones, Volume2, MessageSquare, ArrowRight } from 'lucide-react';
import { NovaState } from '../types';

interface NovaMasterGreetingButtonProps {
  onOpenVoiceMode?: () => void;
}

export const NovaMasterGreetingButton: React.FC<NovaMasterGreetingButtonProps> = ({
  onOpenVoiceMode,
}) => {
  const { setCurrentTab, userProfile } = useApp();
  const [orbState, setOrbState] = useState<NovaState>('idle');
  const [isActivated, setIsActivated] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const handleMasterGreetingPress = async () => {
    setStep(1);
    setOrbState('thinking');

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Chào chủ nhân. NOVA sẵn sàng đồng hành cùng bạn.');
        utterance.lang = 'vi-VN';
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
        setAudioPlayed(true);
      }
    } catch {}

    setTimeout(() => {
      setStep(2);
      setOrbState('speaking');

      setTimeout(() => {
        setStep(3);
        setOrbState('idle');
        setIsActivated(true);
      }, 500);
    }, 400);
  };

  const handleResetGreeting = () => {
    setIsActivated(false);
    setStep(0);
    setOrbState('idle');
  };

  return (
    <div className="relative flex flex-col items-center justify-center text-center">
      {/* 1. Minimalist NOVA AI Core */}
      <div className="relative mb-6 flex items-center justify-center">
        <NovaOrb
          state={orbState}
          size={isActivated ? 'lg' : 'hero'}
          onClick={handleMasterGreetingPress}
          showLabel={false}
          className="transition-all duration-300"
        />
      </div>

      {/* 2. State Content */}
      <AnimatePresence mode="wait">
        {!isActivated ? (
          <motion.div
            key="idle-greeting"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center max-w-md mx-auto space-y-5"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                NOVA AI
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] dark:text-[#F3F4F6]">
                Ready when you are.
              </h2>
              <p className="text-sm text-[#555555] dark:text-stone-400">
                Chào {userProfile.name} • Mục tiêu Band {userProfile.targetBand}
              </p>
            </div>

            {/* Clean Primary Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                id="btn-chao-chu-nhan"
                onClick={handleMasterGreetingPress}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-7 py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#222222] active:scale-98 dark:bg-white dark:text-[#111111] dark:hover:bg-stone-100"
              >
                <span>Bắt đầu phiên học</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {onOpenVoiceMode && (
                <button
                  onClick={onOpenVoiceMode}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200/90 bg-white px-5 py-3.5 text-sm font-medium text-[#111111] shadow-2xs transition-all hover:bg-stone-50 active:scale-98 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  <Mic className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Nói với NOVA</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-[#777777] dark:text-stone-500">
              Nhấn bắt đầu hoặc trò chuyện trực tiếp cùng trợ lý AI cá nhân
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="active-options"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full max-w-xl space-y-6"
          >
            {/* AI Master Response Box */}
            <div className="relative mx-auto rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
                <span>✦ NOVA AI</span>
                {audioPlayed && <Volume2 className="h-3 w-3 text-indigo-500" />}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#111111] dark:text-white">
                Chào {userProfile.name} ✦ Bạn muốn rèn luyện kỹ năng nào hôm nay?
              </h3>
              <p className="mt-1 text-xs text-[#555555] dark:text-stone-400">
                Lộ trình đang được hiệu chỉnh tới{' '}
                <span className="font-semibold text-[#111111] dark:text-stone-200">
                  Band {userProfile.targetBand}
                </span>
                . Chọn trọng tâm hoặc nói chuyện trực tiếp:
              </p>
            </div>

            {/* Quick Skill Pathways (Clean editorial tiles) */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                onClick={() => setCurrentTab('vocabulary')}
                className="group flex flex-col items-center justify-center rounded-2xl border border-stone-200/80 bg-white p-4 text-center shadow-2xs transition-all hover:border-stone-300 hover:shadow-xs active:scale-98 dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-[#111111] dark:bg-stone-800 dark:text-stone-200 group-hover:text-indigo-600 transition-colors">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-[#111111] dark:text-stone-100">
                  Từ vựng
                </span>
                <span className="text-[10px] text-[#777777] dark:text-stone-500 mt-0.5">
                  200+ topics
                </span>
              </button>

              <button
                onClick={() => setCurrentTab('speaking')}
                className="group flex flex-col items-center justify-center rounded-2xl border border-stone-200/80 bg-white p-4 text-center shadow-2xs transition-all hover:border-stone-300 hover:shadow-xs active:scale-98 dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-[#111111] dark:bg-stone-800 dark:text-stone-200 group-hover:text-indigo-600 transition-colors">
                  <Mic className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-[#111111] dark:text-stone-100">
                  Speaking
                </span>
                <span className="text-[10px] text-[#777777] dark:text-stone-500 mt-0.5">
                  Examiner lab
                </span>
              </button>

              <button
                onClick={() => setCurrentTab('writing')}
                className="group flex flex-col items-center justify-center rounded-2xl border border-stone-200/80 bg-white p-4 text-center shadow-2xs transition-all hover:border-stone-300 hover:shadow-xs active:scale-98 dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-[#111111] dark:bg-stone-800 dark:text-stone-200 group-hover:text-indigo-600 transition-colors">
                  <PenTool className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-[#111111] dark:text-stone-100">
                  Writing
                </span>
                <span className="text-[10px] text-[#777777] dark:text-stone-500 mt-0.5">
                  Task 1 & 2
                </span>
              </button>

              <button
                onClick={() => setCurrentTab('reading')}
                className="group flex flex-col items-center justify-center rounded-2xl border border-stone-200/80 bg-white p-4 text-center shadow-2xs transition-all hover:border-stone-300 hover:shadow-xs active:scale-98 dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-[#111111] dark:bg-stone-800 dark:text-stone-200 group-hover:text-indigo-600 transition-colors">
                  <Headphones className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-[#111111] dark:text-stone-100">
                  Listening / Reading
                </span>
                <span className="text-[10px] text-[#777777] dark:text-stone-500 mt-0.5">
                  Drills
                </span>
              </button>
            </div>

            {/* Actions & Dialog controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenVoiceMode}
                className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#222222] active:scale-98 dark:bg-white dark:text-[#111111] dark:hover:bg-stone-100 transition-all"
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Nói với NOVA</span>
              </button>

              <button
                onClick={() => setCurrentTab('tutor')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-4 py-2.5 text-xs font-medium text-[#111111] hover:bg-stone-50 active:scale-98 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
                <span>Mở AI Chat</span>
              </button>

              <button
                onClick={handleResetGreeting}
                className="text-xs text-[#777777] hover:text-[#111111] dark:text-stone-400 dark:hover:text-white"
              >
                Thu nhỏ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
