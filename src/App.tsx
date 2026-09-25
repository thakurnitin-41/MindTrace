import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { MyLearningView } from './components/MyLearningView';
import { MyCoursesView } from './components/MyCoursesView';
import { CourseDetailView } from './components/CourseDetailView';
import { ChapterLearningView } from './components/ChapterLearningView';
import { MessagesView } from './components/MessagesView';
import { DiagnosticAssessment } from './components/DiagnosticAssessment';
import { LearningAutopsy } from './components/LearningAutopsy';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { AiTutorView } from './components/AiTutorView';
import { AdaptivePracticeView } from './components/AdaptivePracticeView';
import { LearningTwinView } from './components/LearningTwinView';
import { RescueModeView } from './components/RescueModeView';
import { StudyBuddyView } from './components/StudyBuddyView';
import { AchievementsView } from './components/AchievementsView';
import { AchievementToast } from './components/AchievementToast';
import { ProgressInsightsView } from './components/ProgressInsightsView';
import { SettingsView } from './components/SettingsView';
import { NotificationModal } from './components/NotificationModal';
import { DispatchToast } from './components/DispatchToast';
import { AuthModal } from './components/AuthModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { Menu, X, ArrowLeft, Bell } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentUserRole,
    canGoBack,
    goBack,
    activeStudent,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    unreadNotificationsCount,
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    isLiveVoiceModalOpen,
    closeLiveVoiceModal,
    newlyUnlockedBadge,
    dismissUnlockedBadgeToast
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin Section Routing with Role-Based Access Control:
  if (currentPage.startsWith('admin-') || currentUserRole === 'admin') {
    return (
      <>
        <AdminPortal />
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
        />
        <DispatchToast />
      </>
    );
  }

  // Strict Authentication Guard:
  // If user is not authenticated (signed out), or currently on the landing page,
  // directly render the external LandingPage. Unauthenticated users cannot access internal pages.
  if (!activeStudent || currentPage === 'landing') {
    return (
      <>
        <LandingPage />
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
        />
        <DispatchToast />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalMode}
          onSuccess={() => {}}
        />
        <LiveVoiceModal
          isOpen={isLiveVoiceModalOpen}
          onClose={closeLiveVoiceModal}
        />
      </>
    );
  }

  // Render current workspace page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'my-learning':
        return <MyLearningView />;
      case 'my-courses':
        return <MyCoursesView />;
      case 'course-detail':
        return <CourseDetailView />;
      case 'chapter-learning':
        return <ChapterLearningView />;
      case 'messages':
        return <MessagesView />;
      case 'assessment':
        return <DiagnosticAssessment />;
      case 'autopsy':
        return <LearningAutopsy />;
      case 'knowledge-graph':
        return <KnowledgeGraphView />;
      case 'tutor':
        return <AiTutorView />;
      case 'practice':
        return <AdaptivePracticeView />;
      case 'twin':
        return <LearningTwinView />;
      case 'rescue':
        return <RescueModeView />;
      case 'study-buddy':
        return <StudyBuddyView />;
      case 'achievements':
        return <AchievementsView />;
      case 'progress':
        return <ProgressInsightsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 flex w-72 flex-col bg-slate-900">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Mobile Top App Bar (Only visible on small screens) */}
        <div className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {canGoBack && (
              <button
                onClick={goBack}
                className="px-2.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-200/80"
                aria-label="Back to previous page"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>
          <div className="font-bold text-slate-900 text-sm">MindTrace AI</div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Dispatched Email & SMS Messages"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-xs text-blue-600 font-semibold px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              Landing
            </button>
          </div>
        </div>

        {/* Global Desktop Workspace Header */}
        <TopHeader />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Notification Center & Toast for Workspace */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
      <DispatchToast />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        onSuccess={() => {}}
      />
      <LiveVoiceModal
        isOpen={isLiveVoiceModalOpen}
        onClose={closeLiveVoiceModal}
      />
      <AchievementToast
        badge={newlyUnlockedBadge}
        onDismiss={dismissUnlockedBadgeToast}
        onViewAchievements={() => setCurrentPage('achievements')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
