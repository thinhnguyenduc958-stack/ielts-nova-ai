import React, { useState } from 'react';
import { useApp, AppTab } from '../context/AppContext';
import {
  Compass,
  Bookmark,
  Zap,
  Mic,
  PenTool,
  BookOpen,
  Headphones,
  Bot,
  TrendingUp,
  Languages,
  ScanText,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NovaLogo } from './NovaLogo';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavGroup {
  title?: string;
  items: {
    id: AppTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const SIDEBAR_GROUPS: NavGroup[] = [
  {
    items: [{ id: 'home', label: 'Home', icon: Compass }],
  },
  {
    title: 'LEARN',
    items: [
      { id: 'vocabulary', label: 'Vocabulary', icon: Bookmark },
      { id: 'grammar', label: 'Grammar', icon: Zap },
    ],
  },
  {
    title: 'PRACTICE',
    items: [
      { id: 'speaking', label: 'Speaking', icon: Mic },
      { id: 'writing', label: 'Writing', icon: PenTool },
      { id: 'reading', label: 'Reading', icon: BookOpen },
      { id: 'listening', label: 'Listening', icon: Headphones },
    ],
  },
  {
    items: [{ id: 'tutor', label: 'NOVA AI', icon: Bot, badge: 'AI' }],
  },
  {
    items: [{ id: 'progress', label: 'Progress', icon: TrendingUp }],
  },
  {
    title: 'TOOLS',
    items: [
      { id: 'translator', label: 'Translator', icon: Languages },
      { id: 'scan', label: 'Smart Scan', icon: ScanText },
    ],
  },
  {
    items: [{ id: 'download', label: 'Download', icon: Download }],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentTab, setCurrentTab, vocabulary } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const handleSelectTab = (tab: AppTab) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  const isItemActive = (id: AppTab) => {
    if (id === currentTab) return true;
    if (id === 'tutor' && currentTab === 'tutor') return true;
    return false;
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-2 py-4 bg-white dark:bg-[#111215]">
      <div className="space-y-4">
        {/* Mobile Header in Drawer */}
        <div className="px-2 md:hidden">
          <NovaLogo size="sm" />
        </div>

        {/* Navigation Groups */}
        <div className="space-y-3.5">
          {SIDEBAR_GROUPS.map((group, gIdx) => (
            <div key={group.title || `group-${gIdx}`}>
              {group.title && !collapsed && (
                <p className="mb-1 px-3 text-[10px] font-bold tracking-wider text-[#5F6368] uppercase dark:text-stone-500">
                  {group.title}
                </p>
              )}
              {group.title && collapsed && (
                <div className="mx-auto my-1.5 h-px w-6 bg-stone-200 dark:bg-stone-800" />
              )}
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.id);
                  const isVocab = item.id === 'vocabulary';
                  const count = isVocab ? vocabulary.length : null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex w-full items-center rounded-lg transition-all ${
                        collapsed
                          ? 'h-10 justify-center px-0'
                          : 'justify-between px-3 py-2 text-xs'
                      } ${
                        active
                          ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/70 dark:text-indigo-300'
                          : 'text-[#5F6368] hover:bg-stone-50 hover:text-[#111318] dark:text-stone-400 dark:hover:bg-stone-850 dark:hover:text-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            active
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-[#5F6368] group-hover:text-[#111318] dark:text-stone-400 dark:group-hover:text-stone-200'
                          }`}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </div>

                      {!collapsed && (
                        <div className="flex items-center gap-1.5">
                          {count !== null && (
                            <span
                              className={`rounded-full px-1.5 py-0.2 text-[10px] font-medium ${
                                active
                                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                  : 'bg-stone-100 text-[#5F6368] dark:bg-stone-800 dark:text-stone-400'
                              }`}
                            >
                              {count}
                            </span>
                          )}

                          {item.badge && (
                            <span
                              className={`rounded px-1 py-0.2 text-[9px] font-bold uppercase ${
                                active
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Collapse Toggle at bottom */}
      <div className="mt-4 pt-3 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[11px] text-[#5F6368] dark:text-stone-500 font-medium px-2">
            Collapse sidebar
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-white text-[#5F6368] hover:text-[#111318] hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors ${
            collapsed ? 'mx-auto' : ''
          }`}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Pure White Sidebar with Collapsible Width */}
      <aside
        className={`hidden shrink-0 border-r border-stone-200/80 bg-white dark:border-stone-800 dark:bg-[#111215] md:flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] z-30 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
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
