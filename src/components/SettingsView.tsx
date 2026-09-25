import React from 'react';
import {
  User,
  Settings,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Info,
  ShieldCheck,
  Brain,
  Bell,
  Mail,
  Smartphone,
  Lock,
  LogOut,
  Fingerprint,
  Award,
  Flame,
  GraduationCap,
  Building,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    activeStudent,
    logoutStudent,
    resetAssessment,
    setCurrentPage,
    dispatchedNotifications,
    setIsNotificationModalOpen,
    grantStudentDataAccess,
    revokeStudentDataAccess,
    achievements
  } = useApp();

  const isProfessional = activeStudent?.roleType === 'professional';
  const unlockedBadgesCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-5">
        <span className="p-1 rounded-md bg-blue-100 text-blue-700">
          <User className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Profile ('Me') & Account Security
          </h1>
          <p className="text-xs text-slate-500">
            Authenticated learner identity, RBAC isolation, session encryption, and data disclosure clearances.
          </p>
        </div>
      </div>

      {/* Authenticated Learner Profile ('Me') Card - Zero Switching Sections */}
      {activeStudent ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{activeStudent.name}</h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {isProfessional ? 'Verified Professional' : 'Verified Learner (Student / Intern)'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {activeStudent.email} • ID: <span className="font-mono text-slate-500">{activeStudent.id}</span>
                </p>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeStudent.institution ? `${activeStudent.institution} • ` : ''}{activeStudent.degree}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2">
              <button
                onClick={() => logoutStudent()}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Sign out of your active session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Active Session</span>
              </button>
            </div>
          </div>

          {/* Quick Academic & Diagnostic Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
              <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Mastery Score</div>
              <div className="text-lg font-bold text-blue-900 mt-0.5">{activeStudent.overallMastery}%</div>
              <div className="text-[10px] text-blue-600">Cognitive Retention</div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
              <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Learning Streak</div>
              <div className="text-lg font-bold text-amber-900 mt-0.5">{activeStudent.currentStreak} Days</div>
              <div className="text-[10px] text-amber-600">Daily Diagnostic Habit</div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
              <div className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Milestone Badges</div>
              <div className="text-lg font-bold text-purple-900 mt-0.5">{unlockedBadgesCount} Won</div>
              <div className="text-[10px] text-purple-600">Achievements Unlocked</div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Track Target</div>
              <div className="text-xs font-bold text-emerald-900 mt-1 truncate">{activeStudent.targetExam || 'Core Systems & DSA'}</div>
              <div className="text-[10px] text-emerald-600 truncate">{activeStudent.problemArchetype}</div>
            </div>
          </div>

          {/* RBAC Security & Session Isolation (Zero-Trust) */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  RBAC Security & Cryptographic Session Isolation
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AES-256 & SHA-256
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your profile is strictly locked to your authenticated credentials under Role-Based Access Control (RBAC). Cross-account switching, lateral session browsing, and access to institutional administrator portals are strictly prohibited.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Single-Tenant RBAC Sandbox</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Encrypted Token Authentication</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Admin Elevation Blocked</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <User className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">No Active Student Profile</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please sign in from the main portal with your email and password to access your learning profile.
          </p>
        </div>
      )}

      {/* Notification & Communication Dispatch Center */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-100 text-blue-700">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Email & SMS Dispatched Messages</h3>
              <p className="text-xs text-slate-500">
                Track all automated welcome emails, registration confirmations, and security login SMS alerts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNotificationModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open Message Center ({dispatchedNotifications.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Email Dispatch Engine</div>
              <div className="text-[11px] text-slate-500">
                Delivers official HTML welcome cards, student IDs, and verification links.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">SMS & WhatsApp Gateway</div>
              <div className="text-[11px] text-slate-500">
                Dispatches instantaneous 6-digit security PINs & login alerts to mobile.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Privacy & Faculty Consent Controls (DPDP & FERPA Compliance) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Data Privacy & Faculty Access Clearances
              </h3>
              <p className="text-xs text-slate-500">
                Manage what data institutional faculty administrators can inspect about your learning progress.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            DPDP & FERPA Gated
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800">
                Current Data Clearance Status:
              </span>
              <span className="text-xs text-slate-500 ml-2">
                {activeStudent?.dataAccessStatus === 'granted'
                  ? 'Full Disclosure Granted to Verified Faculty'
                  : activeStudent?.dataAccessStatus === 'pending'
                  ? 'Faculty Access Request Pending Your Review'
                  : 'Masked & Protected (Role Default)'}
              </span>
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                activeStudent?.dataAccessStatus === 'granted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeStudent?.dataAccessStatus === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              {activeStudent?.dataAccessStatus === 'granted'
                ? 'Consent Verified'
                : activeStudent?.dataAccessStatus === 'pending'
                ? 'Consent Requested'
                : 'Masked (Privacy Mode)'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            By default, faculty administrators only receive <strong>necessary academic metrics</strong> (mastery score, learning streak, questions solved, and high-level root gap). Your personal phone number, email address, and granular question autopsies are strictly masked unless you grant explicit consent.
          </p>

          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-3">
            {activeStudent && activeStudent.dataAccessStatus !== 'granted' ? (
              <button
                onClick={() => activeStudent && grantStudentDataAccess(activeStudent.id)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Grant Full Disclosure to Faculty</span>
              </button>
            ) : (
              <button
                onClick={() => activeStudent && revokeStudentDataAccess(activeStudent.id)}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Revoke Consent (Re-mask Confidential Data)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick State Resets */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Prototype Controls</h3>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <div className="text-sm font-semibold text-slate-900">Retake Diagnostic Test</div>
            <p className="text-xs text-slate-500 mt-0.5">
              Clears current responses and restarts from Question 1.
            </p>
          </div>
          <button
            onClick={resetAssessment}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Assessment</span>
          </button>
        </div>
      </div>

      {/* About MindTrace */}
      <div className="p-5 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          MindTrace — Learning Intelligence System
        </div>
        <p>
          Built for students, instructors, and hackathon presentation. Demonstrates the core pipeline:
          <strong> Assess → Analyze → Trace → Intervene → Practice → Reassess → Adapt</strong>.
        </p>
      </div>
    </div>
  );
};
