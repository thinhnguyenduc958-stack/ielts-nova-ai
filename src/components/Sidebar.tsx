import React from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  Compass,
  GraduationCap,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ScanText,
  Languages,
  Bookmark,
  Bot,
  TrendingUp,
  User,
  Sparkles,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavSection {
  title: string;
  items: {
    id: AppTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Sanctuary',
    items: [
      { id: 'home', label: 'Overview', icon: Compass },
      { id: 'learn', label: 'Study Hub', icon: GraduationCap },
    ],
  },
  {
    title: 'Core Skills',
    items: [
      { id: 'listening', label: 'Listening', icon: Headphones, badge: 'Audio' },
      { id: 'reading', label: 'Reading', icon: BookOpen, badge: 'Lexicon' },
      { id: 'writing', label: 'Writing Studio', icon: PenTool, badge: 'Rubric' },
      { id: 'speaking', label: 'Speaking Lab', icon: Mic, badge: 'Coach' },
    ],
  },
  {
    title: 'Intelligence & Vault',
    items: [
      { id: 'vocabulary', label: 'Lexicon Vault', icon: Bookmark },
      { id: 'scan', label: 'Smart Scan', icon: ScanText, badge: 'OCR' },
      { id: 'translator', label: 'Verified Translator', icon: Languages, badge: 'IELTS' },
      { id: 'tutor', label: 'AI Tutor', icon: Bot, badge: 'Nova' },
    ],
  },
  {
    title: 'Journey',
    items: [
      { id: 'progress', label: 'Band Progression', icon: TrendingUp },
      { id: 'profile', label: 'Preferences', icon: User },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentTab, setCurrentTab, vocabulary, userProfile, theme, setTheme } = useApp();

  const handleSelectTab = (tab: AppTab) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-3.5 py-6">
      <div className="space-y-6">
        {/* Mobile Header in Drawer */}
        <div className="flex items-center gap-3 px-2 md:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-stone-900 text-amber-200 shadow-sm dark:bg-stone-100 dark:text-stone-900">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100">
                IELTS Nova
              </span>
              <span className="rounded-full bg-stone-200/70 px-1.5 py-0.5 text-[9px] font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                Studio
              </span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">
              Cambridge Learning Studio
            </p>
          </div>
        </div>

        {/* Grouped Navigation Sections */}
        <div className="space-y-5">
          {NAV_SECTIONS.map((sec) => (
            <div key={sec.title}>
              <p className="mb-1.5 px-3 text-[10px] font-medium tracking-wider text-stone-400 dark:text-stone-500 uppercase">
                {sec.title}
              </p>
              <nav className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  const vocabCount = item.id === 'vocabulary' ? vocabulary.length : null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`group flex w-full items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-stone-900 text-stone-50 shadow-2xs dark:bg-stone-100 dark:text-stone-900 font-semibold'
                          : 'text-stone-700 hover:bg-stone-200/40 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800/60 dark:hover:text-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? 'text-amber-300 dark:text-stone-900'
                              : 'text-stone-400 group-hover:text-stone-700 dark:text-stone-500 dark:group-hover:text-stone-300'
                          }`}
                        />
                        <span className="tracking-tight">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {vocabCount !== null && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              isActive
                                ? 'bg-stone-800 text-amber-200 dark:bg-stone-200 dark:text-stone-800'
                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                            }`}
                          >
                            {vocabCount}
                          </span>
                        )}

                        {item.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                              isActive
                                ? 'bg-stone-800 text-stone-300 dark:bg-stone-200 dark:text-stone-700'
                                : 'bg-stone-200/60 text-stone-600 dark:bg-stone-800/80 dark:text-stone-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Area: Target Track & Mode Toggles */}
      <div className="mt-6 space-y-3 pt-4 border-t border-stone-200/60 dark:border-stone-800/60">
        {/* Soft Target Track Card */}
        <div className="rounded-2xl border border-stone-200/70 bg-white/70 p-3.5 shadow-2xs dark:border-stone-800 dark:bg-stone-900/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Trajectory
            </span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
              Goal {userProfile.targetBand}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
            Current:{' '}
            <span className="font-medium text-stone-800 dark:text-stone-200">
              {userProfile.currentBand === 'Not assessed' ? 'Diagnostic pending' : `Band ${userProfile.currentBand}`}
            </span>
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
            <div
              className="h-full rounded-full bg-stone-800 dark:bg-amber-300 transition-all duration-500"
              style={{
                width: `${
                  userProfile.currentBand === 'Not assessed'
                    ? 10
                    : Math.min(100, Math.round((parseFloat(userProfile.currentBand) / parseFloat(userProfile.targetBand)) * 100))
                }%`,
              }}
            />
          </div>
        </div>

        {/* Minimalist Theme Segment */}
        <div className="flex items-center justify-between rounded-full border border-stone-200/70 bg-white/60 p-1 text-xs dark:border-stone-800 dark:bg-stone-900/60">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1 transition-all ${
              theme === 'light'
                ? 'bg-stone-900 font-semibold text-stone-50 shadow-2xs dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
            title="Light Theme"
          >
            <Sun className="h-3 w-3" />
            <span className="text-[10px]">Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1 transition-all ${
              theme === 'dark'
                ? 'bg-stone-900 font-semibold text-stone-50 shadow-2xs dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
            title="Dark Theme"
          >
            <Moon className="h-3 w-3" />
            <span className="text-[10px]">Dark</span>
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1 transition-all ${
              theme === 'system'
                ? 'bg-stone-900 font-semibold text-stone-50 shadow-2xs dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
            title="Auto Theme"
          >
            <Laptop className="h-3 w-3" />
            <span className="text-[10px]">Auto</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Inset Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-stone-200/60 bg-[#FAF9F5]/70 dark:border-stone-800/60 dark:bg-[#131417]/70 md:flex flex-col sticky top-16 h-[calc(100vh-4rem)] z-30">
        {navContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-[#FAF9F5] shadow-2xl dark:bg-[#131417] animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
