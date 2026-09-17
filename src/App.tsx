import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WordLookupModal } from './components/WordLookupModal';
import { HomeDashboard } from './components/HomeDashboard';
import { LearnHub } from './components/LearnHub';
import { ListeningModule } from './components/ListeningModule';
import { ReadingModule } from './components/ReadingModule';
import { WritingModule } from './components/WritingModule';
import { SpeakingModule } from './components/SpeakingModule';
import { SmartScanModule } from './components/SmartScanModule';
import { TranslatorModule } from './components/TranslatorModule';
import { VocabularyModule } from './components/VocabularyModule';
import { AITutorModule } from './components/AITutorModule';
import { ProgressModule } from './components/ProgressModule';
import { ProfileModule } from './components/ProfileModule';

const MainContent: React.FC = () => {
  const { currentTab, toastMessage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#121316] text-stone-900 dark:text-stone-100 flex flex-col font-sans antialiased transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Layout Body */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-10">
          {currentTab === 'home' && <HomeDashboard />}
          {currentTab === 'learn' && <LearnHub />}
          {currentTab === 'listening' && <ListeningModule />}
          {currentTab === 'reading' && <ReadingModule />}
          {currentTab === 'writing' && <WritingModule />}
          {currentTab === 'speaking' && <SpeakingModule />}
          {currentTab === 'scan' && <SmartScanModule />}
          {currentTab === 'translator' && <TranslatorModule />}
          {currentTab === 'vocabulary' && <VocabularyModule />}
          {currentTab === 'tutor' && <AITutorModule />}
          {currentTab === 'progress' && <ProgressModule />}
          {currentTab === 'profile' && <ProfileModule />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenMore={() => setMobileMenuOpen(true)} />

      {/* Global Vocabulary Word Lookup & Save Modal */}
      <WordLookupModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-stone-800/80 dark:border-stone-700 bg-stone-900/95 dark:bg-stone-800/95 px-4 py-2 text-xs font-medium text-stone-100 shadow-xl backdrop-blur-md transition-all lg:bottom-6">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
