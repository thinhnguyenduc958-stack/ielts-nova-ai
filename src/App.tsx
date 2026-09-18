import React, { useState, useEffect } from 'react';
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
import { GrammarModule } from './components/GrammarModule';
import { AITutorModule } from './components/AITutorModule';
import { ProgressModule } from './components/ProgressModule';
import { ProfileModule } from './components/ProfileModule';
import { DownloadModule } from './components/DownloadModule';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { NovaVoiceDialog } from './components/NovaVoiceDialog';

const MainContent: React.FC = () => {
  const { currentTab, toastMessage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  useEffect(() => {
    // Check if first-time onboarding has been done
    const onboarded = localStorage.getItem('ielts_nova_onboarded');
    if (!onboarded) {
      // Show onboarding after splash screen fades
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] dark:bg-[#111215] dark:text-[#F3F4F6] flex flex-col font-sans antialiased transition-colors duration-200">
      {/* 1. App Launch Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 2. Onboarding Modal for New Candidates */}
      <OnboardingModal isOpen={showOnboarding} onComplete={() => setShowOnboarding(false)} />

      {/* 3. Top Navigation */}
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* 4. Main Layout Body */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-10">
          {currentTab === 'home' && <HomeDashboard />}
          {(currentTab === 'learn' || currentTab === 'practice') && <LearnHub />}
          {currentTab === 'listening' && <ListeningModule />}
          {currentTab === 'reading' && <ReadingModule />}
          {currentTab === 'writing' && <WritingModule />}
          {currentTab === 'speaking' && <SpeakingModule />}
          {(currentTab === 'scan' || currentTab === 'smart-scan') && <SmartScanModule />}
          {(currentTab === 'translator' || currentTab === 'translate') && <TranslatorModule />}
          {currentTab === 'vocabulary' && <VocabularyModule />}
          {currentTab === 'grammar' && <GrammarModule />}
          {currentTab === 'tutor' && <AITutorModule />}
          {currentTab === 'progress' && <ProgressModule />}
          {currentTab === 'download' && <DownloadModule />}
          {currentTab === 'profile' && <ProfileModule />}
        </main>
      </div>

      {/* 5. Mobile Bottom Navigation Bar with Signature Elevated NOVA Orb */}
      <MobileBottomNav
        onOpenMore={() => setMobileMenuOpen(true)}
        onOpenNova={() => setVoiceOpen(true)}
      />

      {/* 6. NOVA Voice Companion Dialog */}
      <NovaVoiceDialog isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />

      {/* 7. Global Vocabulary Word Lookup & Save Modal */}
      <WordLookupModal />

      {/* 8. Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-stone-800/80 dark:border-stone-700 bg-stone-900/95 dark:bg-stone-800/95 px-4 py-2 text-xs font-medium text-stone-100 shadow-xl backdrop-blur-md transition-all md:bottom-6">
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
