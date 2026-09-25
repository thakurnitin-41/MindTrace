import React from 'react';
import {
  Flame,
  Brain,
  Sparkles,
  Home,
  ArrowRight,
  ArrowLeft,
  Bell,
  Lock,
  LogOut,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Mic,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';

export const TopHeader: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    canGoBack,
    goBack,
    previousPage,
    activeStudent,
    logoutStudent,
    openAuthModal,
    unreadNotificationsCount,
    setIsNotificationModalOpen,
    openLiveVoiceModal,
    achievements
  } = useApp();

  const getPageTitle = (page: PageId = currentPage) => {
    switch (page) {
      case 'landing':
        return 'Overview & Tour';
      case 'dashboard':
        return 'Student Intelligence Dashboard';
      case 'assessment':
        return 'Diagnostic Assessment — Trees & Recursion';
      case 'autopsy':
        return 'AI Learning Autopsy & Prerequisite Diagnosis';
      case 'knowledge-graph':
        return 'Interactive Knowledge Dependency Graph';
      case 'tutor':
        return 'Reasoning-First AI Tutor';
      case 'practice':
        return 'Dynamic Adaptive Practice Engine';
      case 'twin':
        return 'My Learning Twin & Mistake DNA';
      case 'rescue':
        return 'Rescue Mode Sprint';
      case 'study-buddy':
        return 'Study Buddy Cohort Pairing & Live Collaboration';
      case 'achievements':
        return 'Achievement Badges & Cognitive Milestones';
      case 'progress':
        return 'Progress Analytics & Mastery Evolution';
      case 'settings':
        return "My Profile ('Me') & Account Security";
      default:
        return 'MindTrace';
    }
  };

  const getShortPageTitle = (page: PageId) => {
    switch (page) {
      case 'landing':
        return 'Overview';
      case 'dashboard':
        return 'Dashboard';
      case 'assessment':
        return 'Assessment';
      case 'autopsy':
        return 'Autopsy';
      case 'knowledge-graph':
        return 'Knowledge Graph';
      case 'tutor':
        return 'AI Tutor';
      case 'practice':
        return 'Practice';
      case 'twin':
        return 'Learning Twin';
      case 'rescue':
        return 'Rescue Sprint';
      case 'study-buddy':
        return 'Study Buddy';
      case 'achievements':
        return 'Achievements';
      case 'progress':
        return 'Progress';
      case 'settings':
        return 'Me (Profile)';
      default:
        return 'Previous Page';
    }
  };

  const previousTitle = previousPage ? getShortPageTitle(previousPage) : null;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Back Button & Workflow Breadcrumb */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Back Option to Go to Previous Page */}
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            canGoBack
              ? 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border-slate-200 shadow-2xs cursor-pointer group active:scale-95'
              : 'bg-slate-50 text-slate-300 border-slate-100 opacity-50 cursor-not-allowed'
          }`}
          title={previousTitle ? `Back to ${previousTitle}` : 'Go back to previous page'}
          aria-label="Back to previous page"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-slate-600" />
          <span>Back</span>
          {previousTitle && canGoBack && (
            <span className="hidden xl:inline text-slate-500 font-normal border-l border-slate-200 pl-1.5 ml-0.5">
              to {previousTitle}
            </span>
          )}
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center text-xs text-slate-500 font-medium">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Workspace</span>
          </button>
          <span className="mx-1.5 sm:mx-2 text-slate-300">/</span>
          <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-[320px] md:max-w-[420px]">
            {getPageTitle(currentPage)}
          </span>
        </div>
      </div>

      {/* Right: Secure Profile Session & Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {activeStudent ? (
          <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200/80 rounded-xl p-1 pl-2 pr-1.5 shadow-2xs">
            <button
              onClick={() => setCurrentPage('settings')}
              className="flex items-center gap-2 min-w-0 text-left hover:opacity-85 transition-opacity cursor-pointer group"
              title="View My Profile ('Me') & Account Security"
            >
              <div className="relative">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-300 shrink-0 group-hover:border-blue-400"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 truncate max-w-[130px] leading-tight flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                  <span>{activeStudent.name}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[130px] leading-tight">
                  {activeStudent.institution || 'Verified Student'} • Me
                </div>
              </div>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            <button
              onClick={() => logoutStudent()}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign out of current account (Password will be required to sign back in)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
              title="Sign in with your password"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              title="Register new student account"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Learning Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 rounded-lg text-xs font-semibold">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{activeStudent ? `${activeStudent.currentStreak} Day Streak` : 'Guest'}</span>
        </div>

        {/* Overall Mastery Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200/80 text-blue-800 rounded-lg text-xs font-semibold">
          <Brain className="w-4 h-4 text-blue-600" />
          <span>Mastery: {activeStudent ? `${activeStudent.overallMastery}%` : '0%'}</span>
        </div>

        {/* Gemini Live API Real-Time Voice Tutor */}
        <button
          type="button"
          onClick={openLiveVoiceModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer group"
          title="Start real-time voice conversation with Gemini Live AI Tutor"
        >
          <Mic className="w-3.5 h-3.5 text-purple-200 group-hover:scale-110 transition-transform animate-pulse" />
          <span className="hidden lg:inline">Live Voice Tutor</span>
        </button>

        {/* Dispatched Email & SMS Message Center Trigger */}
        <button
          type="button"
          onClick={() => setIsNotificationModalOpen(true)}
          className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer group"
          title="Dispatched Email & SMS Message Center"
          aria-label="View dispatched messages"
        >
          <Bell className="w-4 h-4 group-hover:scale-105 transition-transform" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Achievements Quick Badge Link */}
        <button
          onClick={() => setCurrentPage('achievements')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors"
          title="View Your Achievement Badges & Milestones"
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{achievements.filter((a) => a.isUnlocked).length} Badges</span>
        </button>

        {/* Quick Launch CTA if on other pages */}
        {currentPage !== 'autopsy' && (
          <button
            onClick={() => setCurrentPage('autopsy')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>View Autopsy</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>
    </header>
  );
};
