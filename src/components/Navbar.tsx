import React from 'react';
import { useApp } from '../context/AppContext';
import { IELTSBand } from '../types';
import { Flame, Target, Menu, X, Sun, Moon, Laptop, Bot, Download } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 px-4 backdrop-blur-md transition-colors dark:border-stone-800 dark:bg-[#111215]/95 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-[#111111] transition-all hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 md:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div
            onClick={() => setCurrentTab('home')}
            className="cursor-pointer transition-opacity hover:opacity-90"
          >
            <NovaLogo size="md" />
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick AI Tutor Launcher */}
          <button
            onClick={() => setCurrentTab('tutor')}
            className={`hidden items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all sm:flex ${
              currentTab === 'tutor'
                ? 'bg-[#111111] text-white shadow-2xs dark:bg-white dark:text-[#111111]'
                : 'border border-stone-200/90 bg-white text-[#111111] hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200'
            }`}
          >
            <Bot className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Tutor</span>
          </button>

          {/* Download Center Link */}
          <button
            onClick={() => setCurrentTab('download')}
            className={`hidden items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all md:flex ${
              currentTab === 'download'
                ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                : 'text-[#555555] hover:text-[#111111] dark:text-stone-400 dark:hover:text-white'
            }`}
            title="Download Apps"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>

          {/* Streak Counter Pill */}
          <div className="flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-2.5 py-1 text-xs font-medium text-[#111111] shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>{userProfile.streakDays}d</span>
          </div>

          {/* Target Band Pill Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-white px-2.5 py-1 text-xs text-[#111111] shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200">
            <Target className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden text-[11px] text-[#777777] dark:text-stone-400 sm:inline">
              Target
            </span>
            <select
              value={userProfile.targetBand}
              onChange={(e) => setTargetBand(e.target.value as IELTSBand)}
              className="cursor-pointer bg-transparent font-bold text-[#111111] focus:outline-hidden dark:text-stone-100"
            >
              {BAND_OPTIONS.map((b) => (
                <option
                  key={b}
                  value={b}
                  className="bg-white text-[#111111] dark:bg-stone-900 dark:text-stone-100"
                >
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Minimal Theme Toggle (Optional setting) */}
          <button
            onClick={handleCycleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200/90 bg-white text-[#555555] hover:text-[#111111] hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
            title={`Theme: ${theme}`}
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
