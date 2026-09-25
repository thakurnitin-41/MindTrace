import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminStudentsView } from './AdminStudentsView';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminAuditView } from './AdminAuditView';
import { AdminSettingsView } from './AdminSettingsView';
import { AccessDeniedGuard } from './AccessDeniedGuard';
import { AdminAuthModal } from './AdminAuthModal';

export const AdminPortal: React.FC = () => {
  const {
    currentUserRole,
    activeAdmin,
    currentPage,
    openAdminAuthModal,
    setCurrentPage
  } = useApp();

  // 1. ROLE-BASED ACCESS CONTROL (RBAC) GUARD:
  // If the active user session is a student, access is completely denied.
  if (currentUserRole === 'student') {
    return (
      <div id="admin-portal-guarded" className="min-h-screen bg-slate-50">
        <AccessDeniedGuard />
        <AdminAuthModal />
      </div>
    );
  }

  // 2. UNAUTHENTICATED ADMIN GUARD:
  // If in admin role but no faculty session is active, require login or registration
  if (!activeAdmin) {
    return (
      <div id="admin-portal-unauth" className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full text-center space-y-5 bg-slate-800/80 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Faculty & Administrative Portal</h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Authenticate using your institutional faculty credentials, university SSO, or registrar clearance key. Student profiles cannot access this administrative portal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => openAdminAuthModal('login')}
              className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              Faculty Sign In
            </button>
            <button
              onClick={() => openAdminAuthModal('register')}
              className="py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-indigo-200 border border-slate-600 font-semibold text-xs transition-colors cursor-pointer"
            >
              Faculty Registration
            </button>
          </div>

          <div className="pt-2 border-t border-slate-700/60">
            <button
              onClick={() => {
                setCurrentPage('landing');
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>← Return to MindTrace Overview</span>
            </button>
          </div>
        </div>
        <AdminAuthModal />
      </div>
    );
  }

  // 3. AUTHORIZED FACULTY PORTAL:
  const renderCurrentAdminView = () => {
    switch (currentPage) {
      case 'admin-students':
        return <AdminStudentsView />;
      case 'admin-analytics':
        return <AdminAnalyticsView />;
      case 'admin-audit':
        return <AdminAuditView />;
      case 'admin-settings':
        return <AdminSettingsView />;
      case 'admin-dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div id="admin-portal" className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentAdminView()}
        </main>
      </div>
      <AdminAuthModal />
    </div>
  );
};
