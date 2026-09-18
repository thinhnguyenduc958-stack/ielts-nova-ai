import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, VocabularyItem, VocabStatus, IELTSBand, AppTheme } from '../types';
import { initialUserProfile, sampleVocabulary } from '../data/mockIELTSData';

export type AppTab =
  | 'home'
  | 'landing'
  | 'learn'
  | 'practice'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'scan'
  | 'smart-scan'
  | 'translator'
  | 'translate'
  | 'vocabulary'
  | 'grammar'
  | 'tutor'
  | 'nova'
  | 'progress'
  | 'profile'
  | 'download';

export interface ActivityItem {
  id: string;
  title: string;
  skill: string;
  score?: string;
  timestamp: string;
}

interface AppContextType {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setTargetBand: (band: IELTSBand) => void;
  vocabulary: VocabularyItem[];
  addVocabulary: (item: Partial<VocabularyItem> & { word: string; meaning: string }) => void;
  updateVocabStatus: (id: string, status: VocabStatus) => void;
  updateVocabNotes: (id: string, notes: string) => void;
  deleteVocabulary: (id: string) => void;
  recentActivities: ActivityItem[];
  recordActivity: (title: string, skill: string, score?: string) => void;
  toast: string | null;
  toastMessage?: string | null;
  showToast: (msg: string) => void;
  selectedLookupWord: { word: string; context?: string } | null;
  openWordLookup: (word: string, context?: string) => void;
  closeWordLookup: () => void;
  // Theme System
  theme: AppTheme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  resetAllData: () => void;
}

const CLEAN_STATE_KEY = 'ielts_nova_clean_state_v3_white';

// One-time migration to guarantee clean white light theme default
try {
  if (typeof window !== 'undefined' && localStorage.getItem(CLEAN_STATE_KEY) !== 'true') {
    localStorage.setItem('ielts_nova_theme', 'light');
    localStorage.setItem(CLEAN_STATE_KEY, 'true');
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
} catch {}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');

  // Theme state: default strictly to clean light mode
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('ielts_nova_theme') as AppTheme;
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {}
    return 'light';
  });

  const effectiveTheme: 'light' | 'dark' = theme === 'dark' ? 'dark' : 'light';

  // Synchronize .dark class and color-scheme style on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = effectiveTheme;
  }, [effectiveTheme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('ielts_nova_theme', newTheme);
    } catch {}
    setUserProfile((prev) => ({ ...prev, theme: newTheme }));
    showToast(
      `Switched to ${newTheme === 'system' ? 'System Default Theme' : newTheme === 'dark' ? 'Dark Theme' : 'Light Theme'}`
    );
  };

  const toggleTheme = () => {
    const nextTheme: AppTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ielts_nova_user_profile');
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(() => {
    try {
      const saved = localStorage.getItem('ielts_nova_vocab');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('ielts_nova_activities');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [toast, setToast] = useState<string | null>(null);
  const [selectedLookupWord, setSelectedLookupWord] = useState<{ word: string; context?: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('ielts_nova_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('ielts_nova_vocab', JSON.stringify(vocabulary));
  }, [vocabulary]);

  useEffect(() => {
    localStorage.setItem('ielts_nova_activities', JSON.stringify(recentActivities));
  }, [recentActivities]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    showToast('Profile preferences updated');
  };

  const setTargetBand = (band: IELTSBand) => {
    setUserProfile((prev) => ({ ...prev, targetBand: band }));
    showToast(`Target set to Band ${band}`);
  };

  const addVocabulary = (item: Partial<VocabularyItem> & { word: string; meaning: string }) => {
    const cleanWord = item.word.trim().toLowerCase();
    const existingIndex = vocabulary.findIndex((v) => v.word.toLowerCase() === cleanWord);

    if (existingIndex >= 0) {
      showToast(`'${item.word}' is already in your vocabulary database!`);
      return;
    }

    const newItem: VocabularyItem = {
      id: `vocab-${Date.now()}`,
      word: item.word.trim(),
      meaning: item.meaning,
      contextMeaning: item.contextMeaning || item.meaning,
      partOfSpeech: item.partOfSpeech || 'noun',
      ipa: item.ipa || '/.../',
      exampleSentence: item.exampleSentence || `Example sentence featuring "${item.word}".`,
      synonyms: item.synonyms || [],
      antonyms: item.antonyms || [],
      collocations: item.collocations || [],
      ieltsRelevance: item.ieltsRelevance || 'Band 7.0+ Academic IELTS',
      difficulty: item.difficulty || 'advanced',
      userNotes: item.userNotes || '',
      status: 'new',
      sourceContext: item.sourceContext || '',
      dateAdded: new Date().toISOString().split('T')[0],
      reviewCount: 0,
    };

    setVocabulary((prev) => [newItem, ...prev]);
    showToast(`Saved '${item.word}' to your Vocabulary Bank!`);
  };

  const updateVocabStatus = (id: string, status: VocabStatus) => {
    setVocabulary((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status,
              reviewCount: v.reviewCount + 1,
              lastReviewed: new Date().toISOString(),
            }
          : v
      )
    );
  };

  const updateVocabNotes = (id: string, notes: string) => {
    setVocabulary((prev) => prev.map((v) => (v.id === id ? { ...v, userNotes: notes } : v)));
    showToast('Personal note updated');
  };

  const deleteVocabulary = (id: string) => {
    setVocabulary((prev) => prev.filter((v) => v.id !== id));
    showToast('Vocabulary word removed');
  };

  const recordActivity = (title: string, skill: string, score?: string) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title,
      skill,
      score,
      timestamp: 'Just now',
    };
    setRecentActivities((prev) => [newAct, ...prev.slice(0, 9)]);
    setUserProfile((prev) => ({
      ...prev,
      completedActivities: prev.completedActivities + 1,
    }));
  };

  const openWordLookup = (word: string, context?: string) => {
    const clean = word.replace(/[^a-zA-Z\s-]/g, '').trim();
    if (clean) {
      setSelectedLookupWord({ word: clean, context });
    }
  };

  const closeWordLookup = () => {
    setSelectedLookupWord(null);
  };

  const resetAllData = () => {
    try {
      localStorage.removeItem('ielts_nova_user_profile');
      localStorage.removeItem('ielts_nova_vocab');
      localStorage.removeItem('ielts_nova_activities');
      localStorage.removeItem('ielts_nova_theme');
      localStorage.setItem(CLEAN_STATE_KEY, 'true');
    } catch {}
    setUserProfile(initialUserProfile);
    setVocabulary([]);
    setRecentActivities([]);
    setThemeState('system');
    showToast('All application data reset to clean initial state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        userProfile,
        updateUserProfile,
        updateProfile: updateUserProfile,
        setTargetBand,
        vocabulary,
        addVocabulary,
        updateVocabStatus,
        updateVocabNotes,
        deleteVocabulary,
        recentActivities,
        recordActivity,
        toast,
        toastMessage: toast,
        showToast,
        selectedLookupWord,
        openWordLookup,
        closeWordLookup,
        theme,
        effectiveTheme,
        setTheme,
        toggleTheme,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
