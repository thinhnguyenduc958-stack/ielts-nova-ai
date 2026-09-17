import React from 'react';
import { useApp, AppTab } from '../context/AppContext';
import { IELTSBand } from '../types';
import { Sparkles, Flame, Target, Globe, Menu, X, Sun, Moon, Laptop, Bot } from 'lucide-react';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const BAND_OPTIONS: IELTSBand[] = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];

export const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { userProfile, setTargetBand, setCurrentTab, currentTab, theme, effectiveTheme, setTheme } = useApp();

  const handleCycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/60 bg-[#FAF9F5]/90 px-4 backdrop-blur-xl transition-colors duration-300 dark:border-stone-800/70 dark:bg-[#131417]/90 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white/60 text-stone-700 transition-all hover:bg-white hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300 dark:hover:bg-stone-900 lg:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div
            onClick={() => setCurrentTab('home')}
            className="group flex cursor-pointer items-center gap-2.5 transition-all select-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-700 text-amber-200/90 shadow-sm transition-transform group-hover:scale-102 dark:from-stone-800 dark:via-stone-700 dark:to-stone-600 dark:text-amber-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  IELTS Nova
                </span>
                <span className="rounded-full bg-stone-200/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  Studio
                </span>
              </div>
              <span className="hidden text-[10px] font-normal text-stone-500 dark:text-stone-400 sm:block">
                Cambridge AI Companion
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Control Cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick AI Tutor Launcher */}
          <button
            onClick={() => setCurrentTab('tutor')}
            className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all md:flex ${
              currentTab === 'tutor'
                ? 'bg-stone-900 text-white shadow-xs dark:bg-stone-100 dark:text-stone-900'
                : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/70 dark:bg-stone-850 dark:text-stone-300 dark:hover:bg-stone-800'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>AI Tutor</span>
          </button>

          {/* Streak Counter Pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50/60 px-2.5 py-1 text-xs font-semibold text-amber-900/90 shadow-2xs dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <Flame className="h-3.5 w-3.5 fill-amber-500/80 text-amber-600 dark:text-amber-400" />
            <span>{userProfile.streakDays}d</span>
          </div>

          {/* Target Band Pill Selector */}
          <div className="flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/70 px-2.5 py-1 text-xs text-stone-800 shadow-2xs dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-200">
            <Target className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" />
            <span className="hidden text-[11px] font-medium text-stone-500 dark:text-stone-400 sm:inline">Target</span>
            <select
              value={userProfile.targetBand}
              onChange={(e) => setTargetBand(e.target.value as IELTSBand)}
              className="cursor-pointer bg-transparent font-bold text-stone-900 focus:outline-hidden dark:text-stone-100"
            >
              {BAND_OPTIONS.map((b) => (
                <option key={b} value={b} className="bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Accent Variant Indicator */}
          <div className="hidden items-center gap-1 rounded-full border border-stone-200/70 bg-white/60 px-2.5 py-1 text-xs font-medium text-stone-600 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-300 lg:flex">
            <Globe className="h-3.5 w-3.5 text-stone-400" />
            <span>{userProfile.preferredVariant === 'UK' ? 'UK' : 'US'}</span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={handleCycleTheme}
            title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
            aria-label="Switch Theme"
            className="flex h-8 items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/70 px-2.5 text-stone-700 shadow-2xs transition-all hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            {theme === 'system' ? (
              <>
                <Laptop className="h-3.5 w-3.5 text-stone-500" />
                <span className="hidden text-[10px] font-medium sm:inline">Auto</span>
              </>
            ) : effectiveTheme === 'dark' ? (
              <>
                <Moon className="h-3.5 w-3.5 text-amber-300" />
                <span className="hidden text-[10px] font-medium sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-600" />
                <span className="hidden text-[10px] font-medium sm:inline">Light</span>
              </>
            )}
          </button>

          {/* User Profile Pill */}
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex items-center gap-2 rounded-full border p-1 pl-2.5 pr-1 transition-all ${
              currentTab === 'profile'
                ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                : 'border-stone-200/80 bg-white/70 text-stone-800 hover:bg-white dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-200 dark:hover:bg-stone-900'
            }`}
          >
            <span className="hidden text-xs font-semibold sm:inline">
              {userProfile.name}
            </span>
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
              currentTab === 'profile'
                ? 'bg-stone-700 text-white dark:bg-stone-300 dark:text-stone-900'
                : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
            }`}>
              {userProfile.name.charAt(0)}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
