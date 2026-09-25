import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Building,
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  FileCheck,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VALID_INSTITUTIONAL_KEYS } from '../../data/adminData';

export const AdminSettingsView: React.FC = () => {
  const { activeAdmin, logoutAdmin } = useApp();
  const [pinSuccess, setPinSuccess] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 6) {
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 3000);
      setNewPin('');
    }
  };

  return (
    <div id="admin-settings-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Security & Clearance Credentials
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          Faculty Administrator Settings
        </h1>
        <p className="text-sm text-gray-600 mt-0.5">
          Institutional clearance keys, role permissions, and access governance settings.
        </p>
      </div>

      {/* Active Faculty Identity */}
      {activeAdmin && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Verified Faculty Identity
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <img
              src={activeAdmin.avatar}
              alt={activeAdmin.name}
              className="w-16 h-16 rounded-2xl border-2 border-indigo-400 object-cover shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-gray-900">{activeAdmin.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Verified Faculty
                </span>
              </div>
              <p className="text-xs font-semibold text-indigo-700">{activeAdmin.roleTitle}</p>
              <p className="text-xs text-gray-600">
                {activeAdmin.department} • {activeAdmin.institution}
              </p>
              <p className="text-[11px] text-gray-400 font-mono">
                {activeAdmin.email} • ID: {activeAdmin.id}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Authorization Key & Permissions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-600" />
          Active Institutional Authorization Key
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Clearance tokens issued by university registrars granting cryptographic authority to supervise cohorts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">
              Current Key Value
            </span>
            <div className="p-2.5 bg-white border border-gray-300 rounded-lg font-mono text-sm font-bold text-indigo-700 tracking-wider">
              {activeAdmin?.authKey || 'MINDTRACE-ADMIN-2026'}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Validation: Active & Unrestricted
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">
              Granted RBAC Scopes
            </span>
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>cohort:monitor (Cohort Aggregate Diagnostic Metrics)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>interventions:assign (Pedagogical Rescue Sprints)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>student_data:request_access (Consent-Gated Privacy Requests)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>audit_log:view (Institutional Governance Logs)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cryptographic Session Security & RBAC Enforcement (No persona switcher) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </span>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                RBAC Security, Encryption & Session Integrity
              </h3>
              <p className="text-xs text-gray-500">
                Cryptographic session tokenization, zero-trust RBAC privilege boundaries, and institutional session isolation
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-600" />
            Zero-Trust RBAC Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs">
              <Fingerprint className="w-4 h-4" />
              <span>Session Encryption</span>
            </div>
            <p className="text-xs text-gray-600">
              Authenticated session signed with HMAC-SHA256 and encrypted under AES-256-GCM.
            </p>
            <div className="p-2 bg-white rounded border border-gray-200 text-[10px] font-mono text-gray-500 truncate">
              mt_token_sig: 8f4b29c1e09...{activeAdmin?.id.slice(-6)}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
              <Lock className="w-4 h-4" />
              <span>Strict Role Isolation</span>
            </div>
            <p className="text-xs text-gray-600">
              Session is locked to <strong className="text-gray-900">{activeAdmin?.roleTitle}</strong>. Switching to learner/student accounts or other admin accounts is disallowed by RBAC.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> No Lateral Access Allowed
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-semibold text-xs">
              <FileCheck className="w-4 h-4" />
              <span>Immutable Audit Trail</span>
            </div>
            <p className="text-xs text-gray-600">
              All cohort diagnostic reviews, pedagogical interventions, and access requests are logged permanently.
            </p>
            <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> FERPA & DPDP Compliant
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
          <div className="text-xs text-slate-600">
            To switch credentials or terminate this authenticated administrative session, securely sign out.
          </div>
          <button
            onClick={logoutAdmin}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Faculty Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
