import React from 'react';
import {
  ShieldCheck,
  LogOut,
  Building,
  UserCheck,
  Lock,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminHeader: React.FC = () => {
  const {
    activeAdmin,
    logoutAdmin,
    auditLogs,
    students
  } = useApp();

  const pendingRequestsCount = students.filter(
    (s) => s.dataAccessStatus === 'pending'
  ).length;

  return (
    <header
      id="admin-header"
      className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding & Role Banner */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">MindTrace</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Admin Portal
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" /> RBAC Enforced
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Institutional Student Progress Monitoring & Governance
              </p>
            </div>
          </div>
        </div>

        {/* Right: Faculty Identity & Role Controls (Strict RBAC - No switching sections or external links) */}
        <div className="flex items-center gap-3">
          {/* Pending Consent Badge */}
          {pendingRequestsCount > 0 && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{pendingRequestsCount} Pending Consent</span>
            </div>
          )}

          {/* Secure Admin Profile Display (Read-Only Identity with direct Sign Out, NO switching sections) */}
          {activeAdmin && (
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl py-1.5 px-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={activeAdmin.avatar}
                    alt={activeAdmin.name}
                    className="w-8 h-8 rounded-lg border border-indigo-400/50 object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{activeAdmin.name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-bold">
                      {activeAdmin.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[10px] text-indigo-300 truncate max-w-[170px]">
                    {activeAdmin.roleTitle}
                  </p>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-700" />

              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Sign out of Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
