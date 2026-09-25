import React from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShieldAlert,
  KeyRound,
  FileText,
  Lock,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminRole, PageId } from '../../types';

interface AdminNavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string | null;
  badgeColor?: string;
}

interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const AdminSidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    activeAdmin,
    students,
    logoutAdmin
  } = useApp();

  const pendingRequestsCount = students.filter(
    (s) => s.dataAccessStatus === 'pending'
  ).length;

  const criticalStudentsCount = students.filter(
    (s) => s.riskLevel === 'critical'
  ).length;

  const currentRole: AdminRole = activeAdmin?.role || 'department_head';

  // Role Purview Descriptions & Mandate
  const getRolePurview = (role: AdminRole) => {
    switch (role) {
      case 'dean':
        return {
          title: 'Accreditation & Institutional Governance',
          mandate: 'Institutional DPDP Compliance, Accreditation Audits & Academic Standing',
          badgeColor: 'bg-purple-900/60 text-purple-300 border-purple-700/60'
        };
      case 'department_head':
        return {
          title: 'Curriculum & Cognitive Diagnostics',
          mandate: 'Prerequisite Failure Chains, Batch Diagnostics & Pedagogical Interventions',
          badgeColor: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60'
        };
      case 'faculty_lead':
        return {
          title: 'Direct Instruction & Remediation',
          mandate: '1-on-1 Student Autopsies, Remediation Sandboxes & Faculty Commendations',
          badgeColor: 'bg-blue-900/60 text-blue-300 border-blue-700/60'
        };
      case 'academic_advisor':
        return {
          title: 'Placement Readiness & Mentorship',
          mandate: 'Campus SDE Placements, Early Warning Risk Flags & Career Coaching',
          badgeColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60'
        };
      case 'system_admin':
        return {
          title: 'System Security & Access Clearance',
          mandate: 'FERPA Security Clearance, MFA Enforcement & Governance Audit Logs',
          badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-700/60'
        };
      default:
        return {
          title: 'Faculty Administration',
          mandate: 'Cohort Monitoring & Academic Operations',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        };
    }
  };

  const rolePurview = getRolePurview(currentRole);

  // Dynamic Navigation Sections based on Role Responsibilities:
  const getRoleSections = (role: AdminRole): AdminNavSection[] => {
    switch (role) {
      case 'dean':
        return [
          {
            title: "Dean's Institutional Purview",
            items: [
              { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
              {
                id: 'admin-audit',
                label: 'Accreditation & DPDP Audit',
                icon: FileText,
                badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : null,
                badgeColor: 'bg-amber-100 text-amber-800'
              },
              { id: 'admin-students', label: 'Academic Standing (Cohort)', icon: Users }
            ]
          },
          {
            title: 'Governance & Institutional Health',
            items: [
              { id: 'admin-analytics', label: 'Cross-Department Mastery', icon: BarChart3 },
              { id: 'admin-settings', label: 'Institutional Clearance Keys', icon: KeyRound }
            ]
          }
        ];

      case 'department_head':
        return [
          {
            title: 'Curriculum & Diagnostic Purview',
            items: [
              { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
              { id: 'admin-analytics', label: 'Cognitive Diagnostics & Gaps', icon: BarChart3 },
              {
                id: 'admin-students',
                label: 'Cohort Directory & Interventions',
                icon: Users,
                badge: criticalStudentsCount > 0 ? `${criticalStudentsCount} Alert` : null,
                badgeColor: 'bg-rose-100 text-rose-700'
              }
            ]
          },
          {
            title: 'Faculty Supervision & Governance',
            items: [
              {
                id: 'admin-audit',
                label: 'Data Access & Audit Trail',
                icon: FileText,
                badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : null,
                badgeColor: 'bg-amber-100 text-amber-800'
              },
              { id: 'admin-settings', label: 'Faculty Credentials', icon: KeyRound }
            ]
          }
        ];

      case 'faculty_lead':
        return [
          {
            title: 'Mentorship & Instruction Purview',
            items: [
              {
                id: 'admin-students',
                label: 'Student Directory & Autopsies',
                icon: Users,
                badge: criticalStudentsCount > 0 ? `${criticalStudentsCount} Alert` : null,
                badgeColor: 'bg-rose-100 text-rose-700'
              },
              { id: 'admin-analytics', label: 'Question Misconception Analytics', icon: BarChart3 },
              { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard }
            ]
          },
          {
            title: 'Academic Records',
            items: [
              { id: 'admin-audit', label: 'Intervention Audit Logs', icon: FileText },
              { id: 'admin-settings', label: 'Faculty Profile & PIN', icon: KeyRound }
            ]
          }
        ];

      case 'academic_advisor':
        return [
          {
            title: 'Placements & Career Purview',
            items: [
              { id: 'admin-dashboard', label: 'Executive Overview (Placements)', icon: LayoutDashboard },
              {
                id: 'admin-students',
                label: 'Placement Candidate Radar',
                icon: Users,
                badge: criticalStudentsCount > 0 ? `${criticalStudentsCount} At-Risk` : null,
                badgeColor: 'bg-rose-100 text-rose-700'
              },
              { id: 'admin-analytics', label: 'SDE Readiness Benchmarks', icon: BarChart3 }
            ]
          },
          {
            title: 'Advising Governance',
            items: [
              { id: 'admin-audit', label: 'Consent & Advising Audits', icon: FileText },
              { id: 'admin-settings', label: 'Advisor Credentials', icon: KeyRound }
            ]
          }
        ];

      case 'system_admin':
        return [
          {
            title: 'Security & Access Purview',
            items: [
              { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
              {
                id: 'admin-audit',
                label: 'System Governance & Audit Logs',
                icon: FileText,
                badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Audits` : null,
                badgeColor: 'bg-amber-100 text-amber-800'
              },
              { id: 'admin-settings', label: 'MFA Keys & Institutional Clearance', icon: KeyRound }
            ]
          },
          {
            title: 'Infrastructure & Data',
            items: [
              { id: 'admin-students', label: 'Cohort Data Registry', icon: Users },
              { id: 'admin-analytics', label: 'Diagnostic System Analytics', icon: BarChart3 }
            ]
          }
        ];

      default:
        return [
          {
            title: 'Administrative Operations',
            items: [
              { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
              { id: 'admin-students', label: 'Cohort Directory', icon: Users },
              { id: 'admin-analytics', label: 'Cognitive Diagnostics', icon: BarChart3 },
              { id: 'admin-audit', label: 'Governance & Audit', icon: FileText },
              { id: 'admin-settings', label: 'Faculty Credentials', icon: KeyRound }
            ]
          }
        ];
    }
  };

  const navSections = getRoleSections(currentRole);

  return (
    <aside
      id="admin-sidebar"
      className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 text-slate-300"
    >
      {/* Faculty Clearance & Role Purview Card */}
      {activeAdmin && (
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-4 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <img
              src={activeAdmin.avatar}
              alt={activeAdmin.name}
              className="w-10 h-10 rounded-full border-2 border-indigo-400 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{activeAdmin.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{activeAdmin.roleTitle}</p>
            </div>
          </div>

          {/* Role Mandate Pill */}
          <div className="pt-2 border-t border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border ${rolePurview.badgeColor}`}>
                {activeAdmin.role.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Clearance Active
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight">
              {rolePurview.mandate}
            </p>
          </div>
        </div>
      )}

      {/* RBAC Security & Session Isolation Status */}
      <div className="mb-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Lock className="w-3 h-3 text-indigo-400" />
            RBAC Session
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] border border-emerald-500/30">
            ISOLATED
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Authenticated as <strong className="text-white">{activeAdmin?.name}</strong>. Cross-account switching and student views are strictly blocked by RBAC policy.
        </p>
      </div>

      {/* Role-Differentiated Navigation Links */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-1.5">
              {section.title}
            </p>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info & Secure Sign Out */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <button
          onClick={logoutAdmin}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 text-xs font-semibold transition-colors border border-slate-700/80 hover:border-rose-800/60 cursor-pointer"
          title="Sign out of current admin session"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span>Sign Out of Admin Portal</span>
        </button>

        <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Compliant with FERPA & DPDP. Full student autopsies require formal student consent.
          </span>
        </div>
      </div>
    </aside>
  );
};
