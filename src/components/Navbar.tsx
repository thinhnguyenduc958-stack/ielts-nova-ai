import React from 'react';
import { useApp } from '../context/AppContext';
import { IELTSBand } from '../types';
import { Flame, Target, Menu, X, ArrowDownToLine, User } from 'lucide-react';
import { NovaLogo } from './NovaLogo';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const BAND_OPTIONS: IELTSBand[] = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];

export const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { userProfile, setTargetBand, setCurrentTab, currentTab } = useApp();

  const isPracticeActive =
    currentTab === 'practice' ||
    currentTab === 'speaking' ||
    currentTab === 'writing' ||
    currentTab === 'reading' ||
    currentTab === 'listening';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* LEFT: Larger Recognizable Brand Logo (NOVA Symbol + IELTS NOVA AI) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-[#111318] transition-all hover:bg-stone-50 md:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div
            onClick={() => setCurrentTab('home')}
            className="cursor-pointer transition-opacity hover:opacity-90 flex items-center"
          >
            <NovaLogo size="md" showSubtitle={false} />
          </div>
        </div>

        {/* CENTER: Learn, Practice, NOVA AI, Progress */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <button
            onClick={() => setCurrentTab('learn')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              currentTab === 'learn'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-[#5C616B] hover:text-[#111318] hover:bg-stone-50'
            }`}
          >
            Learn
          </button>

          <button
            onClick={() => setCurrentTab('practice')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              isPracticeActive
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-[#5C616B] hover:text-[#111318] hover:bg-stone-50'
            }`}
          >
            Practice
          </button>

          <button
            onClick={() => setCurrentTab('tutor')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              currentTab === 'tutor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/70'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>NOVA AI</span>
          </button>

          <button
            onClick={() => setCurrentTab('progress')}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              currentTab === 'progress'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-[#5C616B] hover:text-[#111318] hover:bg-stone-50'
            }`}
          >
            Progress
          </button>
        </nav>

        {/* RIGHT: Download, Profile, Target, Streak */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Download Link */}
          <button
            onClick={() => setCurrentTab('download')}
            className={`hidden lg:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
              currentTab === 'download'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-[#5C616B] hover:text-[#111318] hover:bg-stone-50'
            }`}
            title="Download Apps"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>

          {/* Profile Link */}
          <button
            onClick={() => setCurrentTab('profile')}
            className={`hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
              currentTab === 'profile'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-[#5C616B] hover:text-[#111318] hover:bg-stone-50'
            }`}
            title="Candidate Profile"
          >
            <User className="h-3.5 w-3.5" />
            <span>Profile</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-stone-200" />

          {/* Target Band Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-[#111318] shadow-2xs">
            <Target className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="hidden text-[11px] font-semibold text-[#5C616B] sm:inline">
              Target
            </span>
            <select
              value={userProfile.targetBand}
              onChange={(e) => setTargetBand(e.target.value as IELTSBand)}
              className="cursor-pointer bg-transparent font-bold text-[#111318] focus:outline-hidden text-xs"
              aria-label="Select Target IELTS Band"
            >
              {BAND_OPTIONS.map((b) => (
                <option key={b} value={b} className="bg-white text-[#111318]">
                  Band {b}
                </option>
              ))}
            </select>
          </div>

          {/* Streak Counter Pill */}
          <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#111318] shadow-2xs">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span>{userProfile.streakDays}d</span>
          </div>
        </div>
      </div>
    </header>
  );
};
