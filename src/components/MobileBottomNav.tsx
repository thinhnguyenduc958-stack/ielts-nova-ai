import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, GraduationCap, Target, Activity } from 'lucide-react';
import { NovaOrb } from './NovaOrb';

interface MobileBottomNavProps {
  onOpenMore?: () => void;
  onOpenNova?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenNova }) => {
  const { currentTab, setCurrentTab } = useApp();

  const isPracticeActive =
    currentTab === 'practice' ||
    currentTab === 'speaking' ||
    currentTab === 'writing' ||
    currentTab === 'reading' ||
    currentTab === 'listening';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex items-center justify-around border-t border-stone-200/90 bg-white px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:hidden"
    >
      {/* 1. Home */}
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all cursor-pointer ${
          currentTab === 'home'
            ? 'text-indigo-600 font-bold'
            : 'text-[#5C616B] hover:text-[#111318]'
        }`}
      >
        <Compass
          className={`h-5 w-5 ${
            currentTab === 'home' ? 'stroke-[2.5] text-indigo-600' : 'stroke-[1.75]'
          }`}
        />
        <span className="mt-1 text-[11px] tracking-tight">Home</span>
      </button>

      {/* 2. Learn */}
      <button
        onClick={() => setCurrentTab('learn')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all cursor-pointer ${
          currentTab === 'learn'
            ? 'text-indigo-600 font-bold'
            : 'text-[#5C616B] hover:text-[#111318]'
        }`}
      >
        <GraduationCap
          className={`h-5 w-5 ${
            currentTab === 'learn' ? 'stroke-[2.5] text-indigo-600' : 'stroke-[1.75]'
          }`}
        />
        <span className="mt-1 text-[11px] tracking-tight">Learn</span>
      </button>

      {/* 3. Practice */}
      <button
        onClick={() => setCurrentTab('practice')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all cursor-pointer ${
          isPracticeActive
            ? 'text-indigo-600 font-bold'
            : 'text-[#5C616B] hover:text-[#111318]'
        }`}
      >
        <Target
          className={`h-5 w-5 ${
            isPracticeActive ? 'stroke-[2.5] text-indigo-600' : 'stroke-[1.75]'
          }`}
        />
        <span className="mt-1 text-[11px] tracking-tight">Practice</span>
      </button>

      {/* 4. NOVA (Visually distinctive) */}
      <div className="relative -top-3 flex flex-col items-center">
        <button
          id="btn-nova-nav-center"
          onClick={() => {
            if (onOpenNova) {
              onOpenNova();
            } else {
              setCurrentTab('tutor');
            }
          }}
          className="group relative flex h-13 w-13 items-center justify-center rounded-full border-2 border-indigo-100 bg-white shadow-md shadow-indigo-500/15 transition-transform active:scale-95 cursor-pointer ring-4 ring-white"
          aria-label="Open NOVA AI Companion"
        >
          <NovaOrb state="idle" size="sm" showSparkle={false} />
        </button>
        <span className="text-[10px] font-black tracking-wider text-indigo-700 mt-0.5 uppercase">
          NOVA
        </span>
      </div>

      {/* 5. Progress */}
      <button
        onClick={() => setCurrentTab('progress')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all cursor-pointer ${
          currentTab === 'progress'
            ? 'text-indigo-600 font-bold'
            : 'text-[#5C616B] hover:text-[#111318]'
        }`}
      >
        <Activity
          className={`h-5 w-5 ${
            currentTab === 'progress' ? 'stroke-[2.5] text-indigo-600' : 'stroke-[1.75]'
          }`}
        />
        <span className="mt-1 text-[11px] tracking-tight">Progress</span>
      </button>
    </nav>
  );
};
