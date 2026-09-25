import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  Activity,
  GitFork,
  Bot,
  Zap,
  Fingerprint,
  Flame,
  LineChart,
  Settings,
  ChevronRight,
  BookOpen,
  User,
  Users,
  Award,
  GraduationCap,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    activeStudent,
    achievements
  } = useApp();

  const unlockedAchievementsCount = achievements.filter((a) => a.isUnlocked).length;
  const isProfessional = activeStudent?.roleType === 'professional';
  const navSections: NavSection[] = [
    {
      title: 'Learning',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-learning', label: 'My Learning', icon: BookOpen },
        { id: 'my-courses', label: 'My Courses', icon: BookOpen },
        { id: 'assessment', label: 'Assessments', icon: ClipboardCheck },
        { id: 'practice', label: 'Practice', icon: Zap },
      ]
    },
    {
      title: 'MindTrace AI',
      items: [
        { id: 'knowledge-graph', label: 'Knowledge Map', icon: GitFork },
        { id: 'tutor', label: 'AI Tutor', icon: Bot },
        { id: 'twin', label: 'Learning Insights', icon: Fingerprint },
        { id: 'autopsy', label: 'Assessment Results', icon: Activity, badge: 'AI Analysis', badgeColor: 'bg-purple-100 text-purple-700 border-purple-200' },
        { id: 'rescue', label: 'Rescue Mode', icon: Flame, badge: 'Intervention', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' }
      ]
    },
    {
      title: 'Communication',
      items: [
        { id: 'messages', label: 'Messages', icon: MessageSquare }
      ]
    },
    {
      title: 'Community',
      items: [
        { id: 'study-buddy', label: 'Study Buddy', icon: Users },
        { id: 'achievements', label: 'Achievements', icon: Award, badge: `${unlockedAchievementsCount} Won`, badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
        { id: 'progress', label: 'Progress', icon: LineChart },
        { id: 'settings', label: 'Profile & Security', icon: User }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <button
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight flex items-center gap-1.5 text-base">
              MindTrace
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/20">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">Find the Gap Behind the Gap</p>
          </div>
        </button>
      </div>

      {/* Learner Track & Role Indicator */}
      <div className="px-3 pt-3 pb-1">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
          {isProfessional ? (
            <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
          ) : (
            <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-white truncate">
              {activeStudent?.primaryGoal || (isProfessional ? 'Software Developer' : 'Campus Placements')}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Target: {activeStudent?.targetExam || 'Learning path in progress'}
            </div>
          </div>
        </div>
      </div>

      {/* Role-Differentiated Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${
                        isActive
                          ? 'bg-blue-700/80 text-white border-blue-500'
                          : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
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
      </nav>

      {/* Student Profile Quick Card in Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {activeStudent ? (
          <button
            onClick={() => setCurrentPage('settings')}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
            title="View My Profile ('Me') & Account Security"
          >
            <div className="relative">
              <img
                src={activeStudent.avatar}
                alt={activeStudent.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-blue-400 transition-colors"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                <span>{activeStudent.name}</span>
                <span className="text-[10px] text-blue-400 bg-blue-950/60 border border-blue-800/50 px-1 rounded font-mono">
                  {isProfessional ? 'SDE' : 'DSA'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {activeStudent.institution ? `${activeStudent.institution} • ` : ''}Me (Profile)
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentPage('landing')}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-300">No Active Profile</div>
              <div className="text-[10px] text-slate-500 truncate">Click to Register / Log In</div>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
};
