import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Flame,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressInsightsView: React.FC = () => {
  const { activeStudent, topics, setCurrentPage } = useApp();

  // Weekly mastery progress trend data
  const trendData = [
    { day: 'Mon', mastery: 54, accuracy: 62 },
    { day: 'Tue', mastery: 56, accuracy: 65 },
    { day: 'Wed', mastery: 58, accuracy: 68 },
    { day: 'Thu', mastery: 61, accuracy: 70 },
    { day: 'Fri', mastery: 64, accuracy: 73 },
    { day: 'Sat', mastery: 66, accuracy: 72 },
    { day: 'Sun', mastery: 68, accuracy: 78 }
  ];

  const recentlyMastered = ['Arrays', 'Linked Lists', 'Tree Traversals'];
  const needsAttention = ['Recursion', 'BST Operations', 'Complexity Analysis'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-100 text-blue-700">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Progress & Insights
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Longitudinal Analytics
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tracking knowledge retention and the velocity of prerequisite stabilization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('practice')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Practice Today</span>
          </button>
        </div>
      </div>

      {/* Prominent AI Learning Insight Banner per prompt */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-800 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-purple-300" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
            AI Learning Insight
          </div>
          <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            “Your performance improved by 14% after prerequisite-focused practice. Your biggest current opportunity is applying recursion to multi-step problems.”
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Overall Mastery
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {activeStudent ? `${activeStudent.overallMastery}%` : '0%'}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% this month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Questions Solved
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {activeStudent ? activeStudent.questionsSolved : 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across 14 learning sessions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Diagnostic Accuracy
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            78%
          </div>
          <div className="text-xs text-blue-600 font-semibold mt-1">+8% first-attempt rate</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Learning Streak
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <span>{activeStudent ? activeStudent.currentStreak : 0}</span>
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-1">Peak streak: 12 days</div>
        </div>
      </div>

      {/* Weekly Mastery Trend Chart */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Weekly Mastery Trajectory</h3>
            <p className="text-xs text-slate-500">
              Velocity of concept acquisition vs practice accuracy
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Steady Acceleration
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="masteryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="mastery"
                name="Mastery %"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#masteryGrad)"
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy %"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column: Recently Mastered vs Needs Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recently Mastered */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Recently Mastered
            </h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {recentlyMastered.map((topic, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
                  <span className="text-emerald-600 font-extrabold">✓</span>
                  <span>{topic}</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700">85–92% Mastery</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Needs Attention
            </h3>
            <span className="text-xs text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
              Action Required
            </span>
          </div>

          <div className="space-y-2.5">
            {needsAttention.map((topic, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-rose-950">
                  <span className="text-rose-600 font-extrabold">⚠</span>
                  <span>{topic}</span>
                </div>
                <button
                  onClick={() => setCurrentPage('practice')}
                  className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
                >
                  <span>Practice</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
