import React from 'react';
import {
  Fingerprint,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Flame,
  ShieldAlert,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { useApp } from '../context/AppContext';

export const LearningTwinView: React.FC = () => {
  const {
    activeStudent,
    learningTwin,
    mistakeDna,
    setCurrentPage,
    updateTopicMastery
  } = useApp();

  // Radar data for the 4 core learning pillars
  const radarData = [
    { subject: 'Knowledge', score: learningTwin.knowledge, fullMark: 100 },
    { subject: 'Application', score: learningTwin.application, fullMark: 100 },
    { subject: 'Retention', score: learningTwin.retention, fullMark: 100 },
    { subject: 'Consistency', score: learningTwin.consistency, fullMark: 100 }
  ];

  // Mistake DNA Donut Data
  const donutData = [
    { name: 'Conceptual Misunderstanding', value: mistakeDna.conceptual, color: '#4f46e5' },
    { name: 'Application Errors', value: mistakeDna.application, color: '#2563eb' },
    { name: 'Prerequisite Gaps', value: mistakeDna.prerequisite, color: '#9333ea' },
    { name: 'Careless Mistakes', value: mistakeDna.careless, color: '#94a3b8' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-100 text-indigo-700">
              <Fingerprint className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Learning Twin
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Digital Cognitive Model
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            “Your continuously updated learning profile.”
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('practice')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Target Next Action</span>
          </button>
        </div>
      </div>

      {/* Section 1: Learning Twin Radar & Bottleneck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Visualization & 4 Metrics (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cognitive Pillar Profile</h3>
              <p className="text-xs text-slate-500">Multidimensional competence radar</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Sync: Live</span>
          </div>

          {/* 4 Metrics Pill Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Knowledge
              </div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">
                {learningTwin.knowledge}%
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Application
              </div>
              <div className="text-xl font-bold text-blue-600 mt-0.5">
                {learningTwin.application}%
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Retention
              </div>
              <div className="text-xl font-bold text-emerald-600 mt-0.5">
                {learningTwin.retention}%
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Consistency
              </div>
              <div className="text-xl font-bold text-purple-600 mt-0.5">
                {learningTwin.consistency}%
              </div>
            </div>
          </div>

          {/* Radar Chart Container */}
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Bottleneck & Behaviour Insights (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Learning Behaviour Diagnostics</h3>
              <p className="text-xs text-slate-500">Autonomous pattern recognition</p>
            </div>

            {/* Current Bottleneck Card */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Current Bottleneck
              </div>
              <div className="text-xl font-extrabold text-rose-950">
                {learningTwin.currentBottleneck}
              </div>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Stalls progression into Binary Search Trees, AVL balance rotations, and recursive graph DFS.
              </p>
            </div>

            {/* Learning Behaviour Bullets */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Observed Cognitive Traits
              </div>
              <div className="space-y-2">
                {learningTwin.learningBehaviors.map((trait, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <span>{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Next Action */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Recommended Next Action
              </div>
              <div className="text-sm font-bold text-blue-950 mt-0.5">
                “{learningTwin.recommendedAction}”
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('practice')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Launch Recovery Path</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Mistake DNA (Dedicated Section per Section 8) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-purple-100 text-purple-700">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Your Mistake DNA</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              “Your mistakes have patterns. MindTrace finds them.”
            </p>
          </div>
          <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
            Diagnostic Classification v2.1
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Donut Chart (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-56 h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900">60%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Raw Score
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs w-full max-w-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="text-slate-600">Conceptual: {mistakeDna.conceptual}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="text-slate-600">Application: {mistakeDna.application}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <span className="text-slate-600">Prerequisite: {mistakeDna.prerequisite}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span className="text-slate-600">Careless: {mistakeDna.careless}%</span>
              </div>
            </div>
          </div>

          {/* Recurring & Strong Patterns (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recurring Traps */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Recurring Patterns
                </div>
                <div className="space-y-2">
                  {mistakeDna.recurringPatterns.map((pat, i) => (
                    <div key={i} className="text-xs text-amber-950 font-medium flex items-center gap-2">
                      <span className="text-amber-600 font-bold">⚠</span>
                      <span>{pat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strong Foundations */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Strong Patterns
                </div>
                <div className="space-y-2">
                  {mistakeDna.strongPatterns.map((pat, i) => (
                    <div key={i} className="text-xs text-emerald-950 font-medium flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{pat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Finding Statement */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">Synthesized Finding: </span>
                “{mistakeDna.coreInsight}”
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
