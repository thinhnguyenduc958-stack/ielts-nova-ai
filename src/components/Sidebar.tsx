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
import { NovaLogo, NovaSymbol } from './NovaLogo';

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
    <div className="flex h-full flex-col justify-between overflow-y-auto px-2 py-4 bg-[#FFFFFF]">
      <div className="space-y-4">
        {/* Mobile Header in Drawer */}
        <div className="px-2 pb-2 md:hidden border-b border-stone-100">
          <NovaLogo size="sm" />
        </div>

        {/* Navigation Groups */}
        <div className="space-y-3">
          {SIDEBAR_GROUPS.map((group, gIdx) => (
            <div key={group.title || `group-${gIdx}`}>
              {group.title && !collapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-bold tracking-widest text-[#5C616B] uppercase">
                  {group.title}
                </p>
              )}
              {group.title && collapsed && (
                <div className="mx-auto my-1.5 h-px w-6 bg-stone-200" />
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
                      className={`group relative flex w-full items-center rounded-xl transition-all ${
                        collapsed
                          ? 'h-10 justify-center px-0'
                          : 'justify-between px-3 py-2.5 text-xs'
                      } ${
                        active
                          ? 'bg-[#EEF2FF] text-indigo-700 font-bold'
                          : 'text-[#5C616B] hover:bg-stone-50 hover:text-[#111318]'
                      }`}
                    >
                      {/* Indigo Accent Indicator on the Left for active item */}
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-indigo-600" />
                      )}

                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            active
                              ? 'text-indigo-600'
                              : 'text-[#5C616B] group-hover:text-[#111318]'
                          }`}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </div>

                      {!collapsed && (
                        <div className="flex items-center gap-1.5">
                          {count !== null && (
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                active
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-stone-100 text-[#5C616B]'
                              }`}
                            >
                              {count}
                            </span>
                          )}

                          {item.badge && (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                active
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-emerald-100 text-emerald-800'
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
      <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 text-[11px] font-medium text-[#5C616B]">
            <NovaSymbol size={16} variant="indigo" />
            <span>NOVA Core v3</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-[#5C616B] hover:bg-stone-100 hover:text-[#111318] transition-colors ${
            collapsed ? 'mx-auto' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Crisp, White, Unobtrusive */}
      <aside
        className={`hidden md:block shrink-0 border-r border-stone-200/80 bg-[#FFFFFF] transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{navContent}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/30 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-[#FFFFFF] shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
