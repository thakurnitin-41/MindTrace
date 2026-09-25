import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  KeyRound,
  Building2,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminRole } from '../../types';
import { VALID_INSTITUTIONAL_KEYS } from '../../data/adminData';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    adminAuthModalMode,
    closeAdminAuthModal,
    loginAdmin,
    loginAdminWithGoogle,
    registerAdmin,
    isFirebaseLoading
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(adminAuthModalMode === 'register' ? 'register' : 'login');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('aris.vance@cs.mit.edu');
  const [loginPin, setLoginPin] = useState<string>('749201');
  const [loginAuthKey, setLoginAuthKey] = useState<string>('MINDTRACE-ADMIN-2026');

  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regInstitution, setRegInstitution] = useState<string>('Indian Institute of Technology Bombay');
  const [regDepartment, setRegDepartment] = useState<string>('Department of Computer Science & Engineering');
  const [regRole, setRegRole] = useState<AdminRole>('faculty_lead');
  const [regAuthKey, setRegAuthKey] = useState<string>('FACULTY-DEAN-CS');
  const [regPin, setRegPin] = useState<string>('654321');

  if (!isAdminAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await loginAdmin(loginEmail, loginPin, loginAuthKey);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        setSuccessMessage(`Welcome back, ${res.admin?.name || 'Administrator'}!`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login encounter an unexpected error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regAuthKey.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerAdmin({
        name: regName,
        email: regEmail,
        institution: regInstitution,
        department: regDepartment,
        role: regRole,
        authKey: regAuthKey,
        securityPin: regPin
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed.');
      } else {
        setSuccessMessage('Institutional faculty credentials successfully verified!');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration encountered an error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSSO = async () => {
    setErrorMessage(null);
    const res = await loginAdminWithGoogle();
    if (!res.success) {
      setErrorMessage(res.error || 'Google SSO failed.');
    }
  };

  return (
    <div
      id="admin-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={closeAdminAuthModal}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                Institutional Security Gateway
              </span>
              <h3 className="text-lg font-bold text-white">Faculty & Administrative Portal</h3>
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-2">
            Verification required to monitor student cohorts, manage pedagogical interventions, and audit data disclosures.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 mt-5 p-1 bg-white/10 rounded-xl text-xs font-medium">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-gray-900 font-semibold shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Faculty Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-gray-900 font-semibold shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Register Credentials
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FACULTY LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Institutional Faculty Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="faculty@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Institutional Authorization Clearance Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={loginAuthKey}
                    onChange={(e) => setLoginAuthKey(e.target.value.toUpperCase())}
                    placeholder="MINDTRACE-ADMIN-2026"
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase"
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-500">
                  <span>Authorized Keys:</span>
                  {Object.keys(VALID_INSTITUTIONAL_KEYS).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setLoginAuthKey(k)}
                      className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-700 font-mono text-[10px] transition-colors"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    6-Digit Faculty Security PIN
                  </label>
                  <span className="text-[11px] text-gray-400">Default PIN: 749201</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    maxLength={6}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm tracking-widest font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                {isSubmitting ? 'Verifying Institutional Clearance...' : 'Authenticate Faculty Access'}
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider absolute">
                  Or Single Sign-On
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSSO}
                disabled={isFirebaseLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {isFirebaseLoading ? 'Authenticating...' : 'Sign In with University Google Account'}
              </button>
            </form>
          )}

          {/* FACULTY REGISTER MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name & Academic Title
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Prof. Radhika Iyer, Ph.D."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Institutional Email (.edu / .ac.in)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="radhika.iyer@cse.iitb.ac.in"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    required
                    value={regInstitution}
                    onChange={(e) => setRegInstitution(e.target.value)}
                    placeholder="IIT Bombay"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="Computer Science & Eng"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Faculty Clearance Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="faculty_lead">Faculty Lead / Chair</option>
                    <option value="department_head">Department Head</option>
                    <option value="academic_advisor">Academic Advisor</option>
                    <option value="dean">Dean of Academic Affairs</option>
                    <option value="system_admin">System Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    6-Digit Security PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value)}
                    placeholder="654321"
                    className="w-full px-3 py-2 text-sm font-mono tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Institutional Clearance Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={regAuthKey}
                    onChange={(e) => setRegAuthKey(e.target.value.toUpperCase())}
                    placeholder="FACULTY-DEAN-CS"
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono uppercase border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Valid test keys: <code className="text-gray-700 font-mono">MINDTRACE-ADMIN-2026</code>,{' '}
                  <code className="text-gray-700 font-mono">FACULTY-DEAN-CS</code>,{' '}
                  <code className="text-gray-700 font-mono">CAMPUS-AUTH-99</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? 'Registering Faculty Credentials...' : 'Register & Enter Admin Portal'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-500">
          Role-Based Access Control • Data Privacy & Protection Policy (DPDP / FERPA)
        </div>
      </div>
    </div>
  );
};
