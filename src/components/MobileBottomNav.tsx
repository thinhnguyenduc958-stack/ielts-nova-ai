import React from 'react';
import { useApp, AppTab } from '../context/AppContext';
import { Compass, BookOpen, Headphones, Mic, Bookmark, MoreHorizontal } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMore: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMore }) => {
  const { currentTab, setCurrentTab } = useApp();

  const primaryTabs: { id: AppTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'reading', label: 'Reading', icon: BookOpen },
    { id: 'listening', label: 'Audio', icon: Headphones },
    { id: 'speaking', label: 'Speaking', icon: Mic },
    { id: 'vocabulary', label: 'Vault', icon: Bookmark },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="fixed bottom-3 left-3 right-3 z-40 mx-auto flex h-14 max-w-sm items-center justify-around rounded-full border border-stone-200/80 bg-[#FAF9F5]/95 px-2.5 shadow-lg backdrop-blur-xl transition-all duration-200 dark:border-stone-800 dark:bg-[#131417]/95 md:hidden">
      {primaryTabs.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center px-2 py-1 transition-all ${
              isActive
                ? 'text-stone-900 font-semibold dark:text-amber-200 scale-105'
                : 'text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'stroke-[2.25]' : 'stroke-2'}`} />
            <span className="mt-0.5 text-[9px] tracking-tight">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center px-2 py-1 text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300 transition-all"
        aria-label="Open Navigation Drawer"
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="mt-0.5 text-[9px] tracking-tight">More</span>
      </button>
    </nav>
  );
};
