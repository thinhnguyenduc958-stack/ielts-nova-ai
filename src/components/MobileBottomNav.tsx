import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, GraduationCap, Target, Activity, MoreHorizontal } from 'lucide-react';
import { NovaOrb } from './NovaOrb';

interface MobileBottomNavProps {
  onOpenMore: () => void;
  onOpenNova?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMore, onOpenNova }) => {
  const { currentTab, setCurrentTab } = useApp();

  const isPracticeActive =
    currentTab === 'speaking' ||
    currentTab === 'writing' ||
    currentTab === 'reading' ||
    currentTab === 'listening' ||
    currentTab === 'practice';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex items-center justify-around border-t border-stone-200/80 bg-white/98 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1.5 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-[#111215]/98 md:hidden"
    >
      {/* 1. Home */}
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 transition-all ${
          currentTab === 'home'
            ? 'text-[#111111] font-bold dark:text-white'
            : 'text-[#777777] hover:text-[#111111] dark:text-stone-400 dark:hover:text-stone-200'
        }`}
      >
        <Compass className={`h-5 w-5 ${currentTab === 'home' ? 'stroke-[2.25] text-indigo-600 dark:text-indigo-400' : 'stroke-[1.75]'}`} />
        <span className="mt-1 text-[10px] tracking-tight">Home</span>
      </button>

      {/* 2. Learn */}
      <button
        onClick={() => setCurrentTab('learn')}
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 transition-all ${
          currentTab === 'learn'
            ? 'text-[#111111] font-bold dark:text-white'
            : 'text-[#777777] hover:text-[#111111] dark:text-stone-400 dark:hover:text-stone-200'
        }`}
      >
        <GraduationCap className={`h-5 w-5 ${currentTab === 'learn' ? 'stroke-[2.25] text-indigo-600 dark:text-indigo-400' : 'stroke-[1.75]'}`} />
        <span className="mt-1 text-[10px] tracking-tight">Learn</span>
      </button>

      {/* 3. Central NOVA AI Core (Subtle elevated trigger) */}
      <div className="relative -top-2 flex flex-col items-center">
        <button
          id="btn-nova-nav-center"
          onClick={() => {
            if (onOpenNova) {
              onOpenNova();
            } else {
              setCurrentTab('tutor');
            }
          }}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white shadow-xs transition-transform active:scale-95 dark:border-stone-800 dark:bg-stone-900"
          aria-label="Open NOVA AI Companion"
        >
          <NovaOrb state="idle" size="sm" showSparkle={false} />
        </button>
        <span className="text-[9px] font-bold tracking-wider text-[#111111] dark:text-stone-300 mt-0.5 uppercase">
          NOVA
        </span>
      </div>

      {/* 4. Practice */}
      <button
        onClick={() => setCurrentTab('speaking')}
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 transition-all ${
          isPracticeActive
            ? 'text-[#111111] font-bold dark:text-white'
            : 'text-[#777777] hover:text-[#111111] dark:text-stone-400 dark:hover:text-stone-200'
        }`}
      >
        <Target className={`h-5 w-5 ${isPracticeActive ? 'stroke-[2.25] text-indigo-600 dark:text-indigo-400' : 'stroke-[1.75]'}`} />
        <span className="mt-1 text-[10px] tracking-tight">Practice</span>
      </button>

      {/* 5. Progress */}
      <button
        onClick={() => setCurrentTab('progress')}
        className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 transition-all ${
          currentTab === 'progress'
            ? 'text-[#111111] font-bold dark:text-white'
            : 'text-[#777777] hover:text-[#111111] dark:text-stone-400 dark:hover:text-stone-200'
        }`}
      >
        <Activity className={`h-5 w-5 ${currentTab === 'progress' ? 'stroke-[2.25] text-indigo-600 dark:text-indigo-400' : 'stroke-[1.75]'}`} />
        <span className="mt-1 text-[10px] tracking-tight">Progress</span>
      </button>

      {/* 6. More */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 text-[#777777] hover:text-[#111111] dark:text-stone-400 dark:hover:text-stone-200 transition-all"
        aria-label="Open More Modules"
      >
        <MoreHorizontal className="h-5 w-5 stroke-[1.75]" />
        <span className="mt-1 text-[10px] tracking-tight">More</span>
      </button>
    </nav>
  );
};
