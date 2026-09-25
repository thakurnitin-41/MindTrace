import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  HelpCircle,
  Flame,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingUp,
  GitFork,
  Calendar,
  Check,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStreakMilestone, getTodayDateString } from '../utils/streakUtils';

export const StudentDashboard: React.FC = () => {
  const {
    activeStudent,
    topics,
    setCurrentPage,
    setSelectedGraphNodeId,
    computedAssessmentScore,
    checkInToday,
    updateStudentStreak,
    students,
    studyBuddyPairings,
    achievements
  } = useApp();

  const [checkedInToast, setCheckedInToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCheckIn = () => {
    checkInToday();
    const nextStreak = (activeStudent?.currentStreak || 2) + 1;
    setToastMessage(`Day ${nextStreak} Streak Verified & Dynamically Saved!`);
    setCheckedInToast(true);
    setTimeout(() => setCheckedInToast(false), 3000);
  };

  const handleSetStreak = (streakVal: number) => {
    if (!activeStudent) return;
    updateStudentStreak(activeStudent.id, streakVal);
    setToastMessage(`Streak updated to Day ${streakVal}!`);
    setCheckedInToast(true);
    setTimeout(() => setCheckedInToast(false), 3000);
  };

  const currentStreakCount = activeStudent?.currentStreak || 2;
  const streakMilestone = getStreakMilestone(currentStreakCount);

  const masteryItems = [
    { id: 'arrays', name: 'Arrays', mastery: topics.arrays?.mastery ?? 92, status: 'Mastered', color: 'bg-emerald-500' },
    { id: 'searching', name: 'Searching', mastery: topics.searching?.mastery ?? 81, status: 'Proficient', color: 'bg-blue-500' },
    { id: 'trees', name: 'Trees', mastery: topics.trees?.mastery ?? 79, status: 'Proficient', color: 'bg-blue-500' },
    { id: 'binary_search', name: 'Binary Search', mastery: topics.binary_search?.mastery ?? 63, status: 'Developing', color: 'bg-amber-500' },
    { id: 'recursion', name: 'Recursion', mastery: topics.recursion?.mastery ?? 42, status: 'Needs Attention', color: 'bg-rose-500' }
  ];

  const recentActivities = [
    {
      id: 'act-1',
      title: 'Diagnostic Assessment Completed',
      subtitle: 'Trees & Recursion — 10 questions evaluated',
      score: `${computedAssessmentScore.correct}/10`,
      time: '12 minutes ago',
      impact: 'Identified Recursion as primary prerequisite root gap',
      action: 'autopsy' as const,
      badge: 'Needs Autopsy',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'act-2',
      title: 'Adaptive Drill: Binary Search Boundaries',
      subtitle: 'Divide & Conquer module',
      score: '4/5',
      time: 'Yesterday at 4:30 PM',
      impact: 'Strengthened integer midpoint overflow awareness',
      action: 'practice' as const,
      badge: 'Proficient',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'act-3',
      title: 'Array In-place Traversal Practice',
      subtitle: 'Two-pointer technique test',
      score: '10/10',
      time: '2 days ago',
      impact: 'Solidified arrays into Mastered tier (92%)',
      action: 'knowledge-graph' as const,
      badge: 'Mastered',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Guest Mode Notice if no profile active */}
      {!activeStudent && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold">No Profile Active</div>
              <div className="text-xs text-amber-700">
                You are currently in guest mode. Register a profile for your personalized diagnostic, or choose a persona from the top bar to inspect demo data.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentPage('landing')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Register / Sign In
            </button>
          </div>
        </div>
      )}

      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Good evening, {activeStudent ? activeStudent.name : 'Learner'}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {activeStudent ? (
                <>
                  {activeStudent.institution && (
                    <span className="font-bold mr-1">{activeStudent.institution} •</span>
                  )}
                  {activeStudent.degree}
                </>
              ) : (
                'Guest Mode'
              )}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Here's what MindTrace understands about your learning today.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentPage('rescue')}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Rescue Mode (30m)</span>
          </button>
          <button
            onClick={() => setCurrentPage('assessment')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Take Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Learning-first action center */}
      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4">
        <section className="rounded-2xl bg-slate-900 text-white p-5 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">Continue learning</p>
              <h2 className="text-xl font-bold mt-2">{activeStudent?.currentCourse || 'Data Structures & Algorithms'}</h2>
              <p className="text-sm text-slate-300 mt-1">Current chapter: {activeStudent?.currentChapter || 'Binary Search Trees'}</p>
            </div>
            <BookOpen className="w-5 h-5 text-blue-300" />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-white/15 overflow-hidden"><div className="h-full rounded-full bg-blue-400" style={{ width: `${activeStudent?.courseProgress ?? 63}%` }} /></div>
            <span className="text-xs font-semibold text-slate-300">{activeStudent?.courseProgress ?? 63}%</span>
          </div>
          <button onClick={() => setCurrentPage('my-learning')} className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-blue-50">Continue learning <ArrowRight className="w-3.5 h-3.5" /></button>
        </section>
        <section className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between"><h2 className="font-bold text-slate-900">Today's plan</h2><Calendar className="w-4 h-4 text-blue-600" /></div>
          <div className="mt-3 space-y-2.5 text-xs">
            {['08 min — Recursion Recovery', '12 min — BST Concepts', '07 min — Practice'].map((item, index) => <div key={item} className="flex items-center gap-2 text-slate-600"><span className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-slate-300'}`} />{item}</div>)}
          </div>
          <button onClick={() => setCurrentPage('practice')} className="mt-4 text-xs font-semibold text-blue-700 hover:text-blue-900">Start plan <ArrowRight className="inline w-3 h-3 ml-1" /></button>
        </section>
      </div>

      {/* Top 4 Key Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Mastery</span>
            <Brain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {activeStudent ? `${activeStudent.overallMastery}%` : '0%'}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+4% from last diagnostic</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Concepts Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {activeStudent ? activeStudent.conceptsMastered : 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">out of 26 DSA modules</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Questions Solved</span>
            <HelpCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {activeStudent ? activeStudent.questionsSolved : 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">74% first-attempt accuracy</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/80 shadow-2xs relative group hover:border-amber-400 transition-all bg-gradient-to-b from-amber-50/30 to-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Dynamic Streak</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                Day {currentStreakCount} Active 🔥
              </span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-baseline gap-1.5">
              <span>{currentStreakCount}</span>
              <span className="text-sm font-semibold text-slate-500">
                {currentStreakCount === 1 ? 'day' : 'days'}
              </span>
            </div>
            {activeStudent && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCheckIn}
                  title="Check in for today to advance your streak"
                  className="text-[11px] font-bold px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Flame className="w-3.5 h-3.5 text-white fill-white" />
                  <span>+1 Check In</span>
                </button>
              </div>
            )}
          </div>

          {/* 7-Day Visual Roadmap */}
          <div className="mt-3 pt-2.5 border-t border-amber-100">
            <div className="flex items-center justify-between gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                const isCompleted = dayNum < currentStreakCount;
                const isCurrent = dayNum === currentStreakCount;
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSetStreak(dayNum)}
                    title={`Day ${dayNum}: Click to set or view Day ${dayNum} streak`}
                    className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-md transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500 text-white font-bold ring-2 ring-amber-300 ring-offset-1 scale-105'
                        : isCompleted
                        ? 'bg-amber-100 text-amber-900 font-semibold'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-[9px] uppercase leading-none">D{dayNum}</span>
                    <span className="text-[11px] mt-0.5 leading-none">
                      {isCompleted ? '✓' : isCurrent ? '🔥' : '○'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-amber-900/90 font-medium mt-2 truncate flex items-center gap-1">
            <span className="font-semibold">{streakMilestone.badgeTitle}:</span>
            <span className="truncate">{streakMilestone.statusText}</span>
          </div>

          {checkedInToast && (
            <div className="absolute inset-x-2 -bottom-9 bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-xl text-center z-20 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{toastMessage || `Day ${currentStreakCount} Streak Verified & Saved!`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Badges Showcase Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 shrink-0 shadow-md shadow-amber-500/20">
            <Award className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Cognitive Milestones
              </span>
              <span className="text-xs font-bold text-amber-950">
                {achievements.filter((a) => a.isUnlocked).length} of {achievements.length} Badges Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Recent unlock: <strong>{achievements.filter((a) => a.isUnlocked).slice(-1)[0]?.title || 'Diagnostic Pioneer'}</strong> (+{achievements.filter((a) => a.isUnlocked).slice(-1)[0]?.rewardXP || 150} XP)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex -space-x-1.5 overflow-hidden">
            {achievements.filter((a) => a.isUnlocked).slice(0, 4).map((badge) => (
              <div
                key={badge.id}
                title={`${badge.title}: ${badge.description}`}
                className="w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-slate-950 shadow-2xs text-xs font-bold"
              >
                🏅
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage('achievements')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer hover:scale-105"
          >
            <span>View Badges</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Card: NEXT BEST ACTION */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Next Best Action</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              “Strengthen Recursion before continuing Binary Search Trees.”
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Your recent 6/10 assessment shows Binary Search Tree validation errors are directly caused by an unreinforced prerequisite: <strong>recursive problem decomposition and stack unwinding</strong>. Fixing this 8-minute gap unlocks 3 downstream topics.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Est. Time: 8 mins
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Impact: High (+18% BST accuracy)
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-purple-300 font-medium">
                Prerequisite Traced: Recursion → BST
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentPage('practice')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Start 8-min Intervention</span>
            </button>
            <button
              onClick={() => setCurrentPage('autopsy')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Inspect Autopsy Reasoning</span>
            </button>
          </div>
        </div>
      </div>

      {/* Study Buddy Cohort Spotlight */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-emerald-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
            <Users className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Cohort Study Buddy Radar
              </span>
              <span className="text-xs text-slate-400">
                • {students.filter((s) => s.id !== activeStudent?.id && s.learningFocus?.availability === 'available_now').length || 3} Peers Online Now
              </span>
            </div>

            <h3 className="text-base font-bold text-white">
              Struggling with Recursion Call Stacks? Cohort peers are pairing up right now!
            </h3>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Share your current focus topic or pair up with peers like Rohan Mehta (DTU) and Priya Patel (BITS Pilani) in our interactive live coding scratchpad.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setCurrentPage('study-buddy')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer hover:scale-105"
          >
            <Users className="w-4 h-4" />
            <span>Launch Study Buddy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Columns: Mastery Overview Chart & Recent Learning Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mastery Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Topic Mastery Overview</h3>
              <p className="text-xs text-slate-500">
                Sorted by prerequisite relationship and diagnostic status
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('knowledge-graph')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>View Full Graph</span>
            </button>
          </div>

          <div className="space-y-4">
            {masteryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedGraphNodeId(item.id);
                  setCurrentPage('knowledge-graph');
                }}
                className="group p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/60 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    <span>{item.name}</span>
                    {item.id === 'recursion' && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                        Root Bottleneck
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.mastery}%</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'Mastered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'Proficient'
                          ? 'bg-blue-50 text-blue-700'
                          : item.status === 'Developing'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700 font-semibold'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.mastery}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-2.5 text-xs text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-950">MindTrace Principle: </span>
              Notice that Recursion is at 42% while Trees is at 79%. The student can answer tree traversal definitions, but struggles when a problem requires formulating a recursive tree function.
            </div>
          </div>
        </div>

        {/* Right Column: Recent Learning Activity (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Learning Activity</h3>
                <p className="text-xs text-slate-500">Live timeline of assessments and drills</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setCurrentPage(act.action)}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {act.title}
                    </span>
                    <span className="text-[11px] text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{act.subtitle}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100/60 text-xs">
                    <span className="text-slate-600 font-medium">Result: {act.score}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${act.badgeColor}`}
                    >
                      {act.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('twin')}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Complete Mistake DNA Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
