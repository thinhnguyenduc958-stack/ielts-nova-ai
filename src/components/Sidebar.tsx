import React from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  Compass,
  GraduationCap,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Bookmark,
  Bot,
  TrendingUp,
  User,
  Zap,
  Download,
  Languages,
  ScanText,
} from 'lucide-react';
import { NovaLogo } from './NovaLogo';

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
    title: 'Overview',
    items: [
      { id: 'home', label: 'Home', icon: Compass },
      { id: 'learn', label: 'Study Hub', icon: GraduationCap },
    ],
  },
  {
    title: 'Core Skills',
    items: [
      { id: 'speaking', label: 'Speaking Lab', icon: Mic, badge: 'AI' },
      { id: 'writing', label: 'Writing Studio', icon: PenTool, badge: 'Rubric' },
      { id: 'reading', label: 'Reading Drills', icon: BookOpen },
      { id: 'listening', label: 'Listening Lab', icon: Headphones },
    ],
  },
  {
    title: 'Vocabulary & Tools',
    items: [
      { id: 'vocabulary', label: 'Lexicon Vault', icon: Bookmark },
      { id: 'grammar', label: 'Grammar Master', icon: Zap, badge: 'Band 8+' },
      { id: 'tutor', label: 'AI Tutor', icon: Bot, badge: 'NOVA' },
      { id: 'translator', label: 'Translator', icon: Languages },
      { id: 'scan', label: 'Smart Scan', icon: ScanText },
    ],
  },
  {
    title: 'Performance & App',
    items: [
      { id: 'progress', label: 'Progress & Analytics', icon: TrendingUp },
      { id: 'download', label: 'Download Center', icon: Download },
      { id: 'profile', label: 'Settings', icon: User },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentTab, setCurrentTab, vocabulary, userProfile } = useApp();

  const handleSelectTab = (tab: AppTab) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-3 py-6 bg-white dark:bg-[#111215]">
      <div className="space-y-6">
        {/* Mobile Header in Drawer */}
        <div className="px-2 md:hidden">
          <NovaLogo size="md" />
        </div>

        {/* Grouped Navigation */}
        <div className="space-y-5">
          {NAV_SECTIONS.map((sec) => (
            <div key={sec.title}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-wider text-[#777777] uppercase dark:text-stone-500">
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
                      className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#111111] text-white font-semibold shadow-2xs dark:bg-white dark:text-[#111111]'
                          : 'text-[#555555] hover:bg-stone-50 hover:text-[#111111] dark:text-stone-400 dark:hover:bg-stone-850 dark:hover:text-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? 'text-white dark:text-[#111111]'
                              : 'text-[#777777] group-hover:text-[#111111] dark:text-stone-500 dark:group-hover:text-stone-300'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {vocabCount !== null && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              isActive
                                ? 'bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-800'
                                : 'bg-stone-100 text-[#555555] dark:bg-stone-800 dark:text-stone-400'
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
                                : 'bg-stone-100 text-[#777777] dark:bg-stone-800 dark:text-stone-400'
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

      {/* Trajectory Footnote */}
      <div className="mt-6 pt-4 border-t border-stone-200/80 dark:border-stone-800">
        <div className="rounded-xl border border-stone-200/90 bg-white p-3 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#111111] dark:text-stone-200">
              Trajectory
            </span>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              Goal {userProfile.targetBand}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#777777] dark:text-stone-400">
            Current Band {userProfile.currentBand === 'Not assessed' ? '5.5' : userProfile.currentBand}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Inset Clean White Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-stone-200/80 bg-white dark:border-stone-800 dark:bg-[#111215] md:flex flex-col sticky top-16 h-[calc(100vh-4rem)] z-30">
        {navContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-white shadow-xl dark:bg-[#111215] animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
