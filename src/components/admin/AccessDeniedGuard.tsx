import React from 'react';
import { ShieldAlert, ArrowLeft, KeyRound, Lock, UserCheck, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccessDeniedGuard: React.FC = () => {
  const {
    activeStudent,
    openAdminAuthModal,
    switchUserRole,
    setCurrentPage
  } = useApp();

  return (
    <div id="access-denied-guard" className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white border border-rose-200 rounded-2xl shadow-xl shadow-rose-950/5 overflow-hidden">
        {/* Security Banner Header */}
        <div className="bg-rose-50 border-b border-rose-200 p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wider">
                Role-Based Access Control (RBAC)
              </span>
              <span className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> 403 Clearance Required
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              Administrative Clearance Restricted
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              You are attempting to access institutional faculty and administration controls.
            </p>
          </div>
        </div>

        {/* Security Policy Information */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Authenticated Session</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Role: Student
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <img
                src={activeStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={activeStudent?.name || 'Active Student'}
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{activeStudent?.name || 'Active Student'}</p>
                <p className="text-xs text-gray-500">
                  {activeStudent?.degree || 'Student Account'} • {activeStudent?.institution || 'Enrolled Learner'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Institutional Privacy & Protection Safeguards:
            </h4>
            <ul className="space-y-2 list-disc list-inside text-gray-600 pl-1 text-xs sm:text-sm">
              <li>
                <strong className="text-gray-800">Student Account Isolation:</strong> Student credentials do not possess institutional clearance to view cohort diagnostics, other student records, or administrative intervention tools.
              </li>
              <li>
                <strong className="text-gray-800">FERPA & DPDP Compliance:</strong> All faculty access is strictly bound by role authorization keys, MFA verification, and explicit student consent agreements.
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              id="back-to-student-btn"
              onClick={() => {
                switchUserRole('student');
                setCurrentPage('dashboard');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Student Portal
            </button>

            <button
              id="auth-as-admin-btn"
              onClick={() => {
                openAdminAuthModal('login');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Sign In as Verified Faculty Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
