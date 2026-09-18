import React from 'react';
import { useApp } from '../context/AppContext';
import { IELTSBand } from '../types';
import { Flame, Target, Menu, X, Sun, Moon, Laptop } from 'lucide-react';
import { NovaLogo } from './NovaLogo';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const BAND_OPTIONS: IELTSBand[] = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];

export const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { userProfile, setTargetBand, setCurrentTab, currentTab, theme, setTheme } = useApp();

  const handleCycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const isPracticeActive =
    currentTab === 'practice' ||
    currentTab === 'speaking' ||
    currentTab === 'writing' ||
    currentTab === 'reading' ||
    currentTab === 'listening';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 px-4 backdrop-blur-md transition-colors dark:border-stone-800 dark:bg-[#111215]/95 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
        {/* Left: Mobile Drawer Trigger + NOVA Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-[#111318] transition-all hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 md:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div
            onClick={() => setCurrentTab('home')}
            className="cursor-pointer transition-opacity hover:opacity-90 flex items-center"
          >
            <NovaLogo size="sm" showSubtitle={false} />
          </div>
        </div>

        {/* Center / Right Primary Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('learn')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentTab === 'learn'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                  : 'text-[#5F6368] hover:text-[#111318] hover:bg-stone-50 dark:text-stone-400 dark:hover:text-white dark:hover:bg-stone-900'
              }`}
            >
              Learn
            </button>

            <button
              onClick={() => setCurrentTab('practice')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isPracticeActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                  : 'text-[#5F6368] hover:text-[#111318] hover:bg-stone-50 dark:text-stone-400 dark:hover:text-white dark:hover:bg-stone-900'
              }`}
            >
              Practice
            </button>

            <button
              onClick={() => setCurrentTab('tutor')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentTab === 'tutor'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-600 hover:bg-indigo-50/80 dark:text-indigo-400 dark:hover:bg-indigo-950/50'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>NOVA AI</span>
            </button>

            <button
              onClick={() => setCurrentTab('progress')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                currentTab === 'progress'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                  : 'text-[#5F6368] hover:text-[#111318] hover:bg-stone-50 dark:text-stone-400 dark:hover:text-white dark:hover:bg-stone-900'
              }`}
            >
              Progress
            </button>
          </nav>

          {/* Subtle Nav Separator */}
          <div className="hidden md:block h-4 w-px bg-stone-200 dark:bg-stone-800 mx-1" />

          {/* Secondary Nav: Download & Profile */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('download')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                currentTab === 'download'
                  ? 'bg-stone-100 text-[#111318] font-semibold dark:bg-stone-800 dark:text-white'
                  : 'text-[#5F6368] hover:text-[#111318] dark:text-stone-400 dark:hover:text-white'
              }`}
            >
              Download
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                currentTab === 'profile'
                  ? 'bg-stone-100 text-[#111318] font-semibold dark:bg-stone-800 dark:text-white'
                  : 'text-[#5F6368] hover:text-[#111318] dark:text-stone-400 dark:hover:text-white'
              }`}
            >
              Profile
            </button>
          </div>

          {/* Subtle Separator before utility indicators */}
          <div className="hidden sm:block h-4 w-px bg-stone-200 dark:bg-stone-800 mx-1" />

          {/* Streak Counter Pill */}
          <div className="flex items-center gap-1.5 rounded-lg border border-stone-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-[#111318] shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{userProfile.streakDays}d</span>
          </div>

          {/* Target Band Pill Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-stone-200/80 bg-white px-2.5 py-1 text-xs text-[#111318] shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200">
            <Target className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden text-[11px] text-[#5F6368] dark:text-stone-400 sm:inline">
              Target
            </span>
            <select
              value={userProfile.targetBand}
              onChange={(e) => setTargetBand(e.target.value as IELTSBand)}
              className="cursor-pointer bg-transparent font-bold text-[#111318] focus:outline-hidden dark:text-stone-100 text-xs"
              aria-label="Select Target IELTS Band"
            >
              {BAND_OPTIONS.map((b) => (
                <option
                  key={b}
                  value={b}
                  className="bg-white text-[#111318] dark:bg-stone-900 dark:text-stone-100"
                >
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Minimal Theme Toggle */}
          <button
            onClick={handleCycleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200/80 bg-white text-[#5F6368] hover:text-[#111318] hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
            title={`Theme: ${theme}`}
            aria-label="Cycle theme"
          >
            {theme === 'light' ? (
              <Sun className="h-3.5 w-3.5" />
            ) : theme === 'dark' ? (
              <Moon className="h-3.5 w-3.5" />
            ) : (
              <Laptop className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
