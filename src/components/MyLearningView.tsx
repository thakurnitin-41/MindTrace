import React from 'react';
import { ArrowRight, BookOpen, CalendarCheck, CheckCircle2, Clock3, Target, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyLearningView: React.FC = () => {
  const { activeStudent, topics, setCurrentPage, setSelectedGraphNodeId } = useApp();
  const currentCourse = activeStudent?.currentCourse || 'Data Structures & Algorithms';
  const currentChapter = activeStudent?.currentChapter || 'Binary Search Trees';
  const progress = activeStudent?.courseProgress ?? 63;
  const primaryGoal = activeStudent?.primaryGoal || activeStudent?.learningGoal || activeStudent?.targetExam || 'Software Developer';
  const interests = activeStudent?.learningInterests?.slice(0, 5) || ['Data Structures & Algorithms', 'Programming Fundamentals'];
  const weakTopic = Object.values(topics).sort((a, b) => a.mastery - b.mastery)[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Learning workspace</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">My Learning</h1>
        <p className="text-sm text-slate-500 mt-1">A focused path from your current goal to your next measurable milestone.</p>
      </header>

      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="rounded-2xl bg-slate-900 text-white p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-300">Current goal</p>
              <h2 className="text-2xl font-bold mt-2">{primaryGoal}</h2>
              <p className="text-sm text-slate-300 mt-1">Your learning path is tuned to this outcome.</p>
            </div>
            <Target className="w-6 h-6 text-blue-300" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {interests.map((interest) => <span key={interest} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-slate-200">{interest}</span>)}
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Goal progress</h2>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-5 flex items-end gap-2"><span className="text-4xl font-bold text-slate-900">{activeStudent?.overallMastery ?? 0}%</span><span className="text-xs text-slate-500 mb-1">overall mastery</span></div>
          <div className="h-2 rounded-full bg-slate-100 mt-3 overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeStudent?.overallMastery ?? 0}%` }} /></div>
          <p className="text-xs text-slate-500 mt-2">Keep building consistency through the next practice block.</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Continue learning</p><h2 className="text-lg font-bold text-slate-900 mt-1">{currentCourse}</h2></div>
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1"><p className="text-sm text-slate-600">Current chapter: <strong className="text-slate-900">{currentChapter}</strong></p><div className="h-2 rounded-full bg-slate-100 mt-3"><div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} /></div><p className="text-xs text-slate-500 mt-2">{progress}% complete</p></div>
          <button onClick={() => { setSelectedGraphNodeId('binary_search'); setCurrentPage('knowledge-graph'); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">Continue learning <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center gap-2"><CalendarCheck className="w-5 h-5 text-blue-600" /><h2 className="font-bold text-slate-900">Today's learning plan</h2></div>
          <div className="mt-4 space-y-3">
            {['Recursion Recovery', 'BST Concepts', 'Practice', 'Quick Check'].map((item, index) => <div key={item} className="flex items-center gap-3 text-sm"><span className="text-xs font-mono text-slate-400 w-10">{[8, 12, 7, 3][index]} min</span><span className="flex-1 text-slate-700">{item}</span>{index === 0 ? <span className="text-xs text-blue-700 font-semibold">Next</span> : <CheckCircle2 className="w-4 h-4 text-slate-300" />}</div>)}
          </div>
          <button onClick={() => setCurrentPage('practice')} className="mt-5 w-full px-3 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50">Start plan</button>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-5">
          <div className="flex items-center gap-2"><Clock3 className="w-5 h-5 text-amber-600" /><h2 className="font-bold text-slate-900">MindTrace insight</h2></div>
          <p className="text-sm text-slate-600 mt-4 leading-6">Your next best action is to strengthen <strong className="text-slate-900">{weakTopic?.name || 'recursion'}</strong> before taking another multi-step assessment.</p>
          <button onClick={() => setCurrentPage('rescue')} className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-100 text-amber-900 text-sm font-semibold hover:bg-amber-200">Fix this gap <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
    </div>
  );
};
