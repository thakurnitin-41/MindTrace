import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Brain,
  Zap,
  Target,
  Users,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  Filter,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Activity,
  GitFork
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AchievementBadge, AchievementCategory, PageId } from '../types';

export const AchievementsView: React.FC = () => {
  const {
    achievements,
    activeStudent,
    setCurrentPage,
    topics,
    computedAssessmentScore
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const filteredBadges = achievements.filter((badge) => {
    if (selectedCategory === 'all') return true;
    return badge.category === selectedCategory;
  });

  const unlockedCount = achievements.filter((b) => b.isUnlocked).length;
  const totalCount = achievements.length;
  const totalXpEarned = achievements
    .filter((b) => b.isUnlocked)
    .reduce((sum, b) => sum + b.rewardXP, 0);

  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'diagnostic':
        return Brain;
      case 'mastery':
        return Zap;
      case 'streak':
        return Flame;
      case 'collaboration':
        return Users;
      case 'rescue':
        return Activity;
      default:
        return Award;
    }
  };

  const getRarityStyle = (rarity: AchievementBadge['rarity'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        cardBg: 'bg-white border-slate-200 opacity-80',
        badgePill: 'bg-slate-100 text-slate-500 border-slate-200',
        iconBg: 'bg-slate-100 text-slate-400'
      };
    }
    switch (rarity) {
      case 'legendary':
        return {
          cardBg: 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border-amber-300 shadow-sm shadow-amber-500/10',
          badgePill: 'bg-amber-100 text-amber-900 border-amber-300 font-black',
          iconBg: 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
        };
      case 'epic':
        return {
          cardBg: 'bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 border-purple-300 shadow-sm shadow-purple-500/10',
          badgePill: 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold',
          iconBg: 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-300'
        };
      case 'rare':
        return {
          cardBg: 'bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 border-blue-300 shadow-sm shadow-blue-500/10',
          badgePill: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
          iconBg: 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/20'
        };
      default:
        return {
          cardBg: 'bg-white border-slate-200',
          badgePill: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
          iconBg: 'bg-emerald-500 text-white'
        };
    }
  };

  const getActionForCategory = (category: AchievementCategory): PageId => {
    switch (category) {
      case 'diagnostic':
        return 'assessment';
      case 'mastery':
        return 'practice';
      case 'collaboration':
        return 'study-buddy';
      case 'rescue':
        return 'rescue';
      default:
        return 'dashboard';
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Hero Banner with Achievement Statistics */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Cognitive Milestone Recognition</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Achievement & Mastery Badges
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Earn badges as you unlock prerequisite breakthroughs, complete cognitive diagnostics, elevate topic mastery, and collaborate with your study cohort.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {totalXpEarned} XP Accumulated
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {unlockedCount} of {totalCount} Badges Unlocked
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">
                Track: <strong className="text-white capitalize">{activeStudent?.roleType || 'Campus Placement'}</strong>
              </span>
            </div>
          </div>

          {/* Quick Progress Dial Card */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shrink-0 text-center space-y-2 sm:w-56 backdrop-blur-sm">
            <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Completion Rate
            </div>
            <div className="text-3xl font-black text-amber-400">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              {totalCount - unlockedCount} Badges Remaining
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Badges', count: totalCount },
            { id: 'diagnostic', label: 'Diagnostic Assessment', count: achievements.filter(b => b.category === 'diagnostic').length },
            { id: 'mastery', label: 'Subject Mastery', count: achievements.filter(b => b.category === 'mastery').length },
            { id: 'streak', label: 'Streaks & Habits', count: achievements.filter(b => b.category === 'streak').length },
            { id: 'collaboration', label: 'Cohort Collaboration', count: achievements.filter(b => b.category === 'collaboration').length },
            { id: 'rescue', label: 'Rescue Sprint', count: achievements.filter(b => b.category === 'rescue').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Showing {filteredBadges.length} milestones
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const styles = getRarityStyle(badge.rarity, badge.isUnlocked);
          const CatIcon = getCategoryIcon(badge.category);
          const progressPercent = Math.min(
            100,
            Math.round((badge.progress.current / badge.progress.max) * 100)
          );

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${styles.cardBg} ${
                badge.isUnlocked ? 'hover:scale-[1.01] hover:shadow-md' : ''
              }`}
            >
              <div className="space-y-4">
                {/* Header with Icon, Rarity, and XP */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                    {badge.isUnlocked ? (
                      <Award className="w-6 h-6 fill-current" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles.badgePill}`}>
                      {badge.rarity}
                    </span>
                    <div className="text-xs font-bold text-amber-600">
                      +{badge.rewardXP} XP
                    </div>
                  </div>
                </div>

                {/* Badge Titles & Description */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                    {badge.title}
                    {badge.isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Criteria Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-900">Criteria: </span>
                  {badge.criteria}
                </div>

                {/* Progress bar (if not unlocked) */}
                {!badge.isUnlocked && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>Progress</span>
                      <span>
                        {badge.progress.current} / {badge.progress.max} ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {badge.isUnlocked ? (
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Unlocked {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Active'}
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(getActionForCategory(badge.category))}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Work toward this badge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <span className="text-[10px] text-slate-400 capitalize">
                  {badge.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
