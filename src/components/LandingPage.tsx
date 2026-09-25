import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  ChevronRight,
  CheckCircle2,
  Zap,
  Target,
  BarChart3,
  GitFork,
  Activity,
  Flame,
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  Search,
  BookOpen,
  UserCheck,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FloatingAssistant } from './FloatingAssistant';
import { TAGLINES } from '../data/faqData';

export const LandingPage: React.FC = () => {
  const {
    setCurrentPage,
    resetAssessment,
    activeStudent,
    logoutStudent,
    openAuthModal,
    openAdminAuthModal,
    switchUserRole,
    activeAdmin
  } = useApp();
  const [activeTabStudent, setActiveTabStudent] = useState<'A' | 'B' | 'C'>('B');

  // Tagline Rotator
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const studentDetails = {
    A: {
      name: 'Learner A',
      score: '6/10',
      tag: 'Conceptual Misunderstanding',
      color: 'border-amber-300 bg-amber-50/60 text-amber-900',
      badge: 'bg-amber-100 text-amber-800',
      rootIssue: 'Misinterprets Binary Search Tree global invariant.',
      analysis:
        'Validates only immediate parent-child pairs without checking whether a node in the right branch exceeds the ancestor root. Needs mental model recalibration on tree properties, not arithmetic.',
      remedy: '3-min Visual Invariant Proof → Single-concept validation drill'
    },
    B: {
      name: 'Learner B',
      score: '6/10',
      tag: 'Prerequisite Gap',
      color: 'border-blue-300 bg-blue-50/60 text-blue-900',
      badge: 'bg-blue-100 text-blue-800',
      rootIssue: 'Weakness in Recursion Call Stack Decomposition.',
      analysis:
        'Every missed BST problem required carrying recursive bounds (min, max). The student knows what a BST is, but recursive call stack unwinding collapses. Practicing more BST questions without fixing Recursion will fail.',
      remedy: '8-min Recursion Recovery Path → Stack unwinding mental model'
    },
    C: {
      name: 'Learner C',
      score: '6/10',
      tag: 'Application Difficulty',
      color: 'border-purple-300 bg-purple-50/60 text-purple-900',
      badge: 'bg-purple-100 text-purple-800',
      rootIssue: 'Auxiliary memory tracking under multi-step branch recursion.',
      analysis:
        'Can define recursion, can define BSTs. But struggles under multi-step cognitive load when estimating recursion stack frame memory vs branching factor. Fails on space complexity combinations.',
      remedy: 'Step-by-step Call Tree Tracing → Multi-step application drills'
    }
  };

  const openAuthAndProceed = (mode: 'register' | 'login' = 'register') => {
    openAuthModal(mode);
  };

  const handleSelectStudentDemo = (persona: 'A' | 'B' | 'C') => {
    setActiveTabStudent(persona);
    // User requested: "abhi koi bhi profile active mat rakho"
    // Tab switching only changes the comparison preview without activating any profile
  };

  const loadStudentPersonaAndInspect = (_persona: 'A' | 'B' | 'C') => {
    if (activeStudent) {
      setCurrentPage('autopsy');
    } else {
      openAuthAndProceed('register');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative">
      {/* 
        CLEAN TOP BAR:
        Per user instruction: 
        1. Front page se back option hataya (front page is the entry point).
        2. Upar ke saare distracting nav options hta ke clean tagline rakhi hai.
        3. Login / Register CTA aur active profile indicator.
      */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">MindTrace</span>
            <span className="hidden sm:inline-block text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              AI Learning Intelligence
            </span>
          </div>

          {/* Center: Dynamic Animated Tagline Bar */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-xl mx-auto px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-2 shrink-0 animate-pulse" />
            <span className="text-slate-800 font-semibold truncate transition-all duration-500 key={currentTaglineIndex}">
              “{TAGLINES[currentTaglineIndex]}”
            </span>
          </div>

          {/* Right Action: Clean Login, Admin Portal & Start Diagnostic CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Institutional Faculty / Admin Portal CTA */}
            <button
              onClick={() => openAuthModal('login', '', 'admin')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/90 rounded-lg text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              title="Access Faculty, Dean & Institutional Admin Section"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Faculty / Admin</span>
              <span className="hidden md:inline-block text-[10px] px-1.5 py-0.2 bg-indigo-200/60 text-indigo-800 rounded-sm font-bold uppercase">
                Portal
              </span>
            </button>

            {activeStudent ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="w-5 h-5 rounded-full object-cover border border-slate-300"
                />
                <span className="font-semibold text-slate-800">{activeStudent.name}</span>
                <button
                  onClick={() => logoutStudent()}
                  className="text-[11px] text-rose-500 hover:text-rose-700 ml-1 font-medium underline cursor-pointer"
                  title="Sign out of current profile"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthAndProceed('login')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Log In</span>
              </button>
            )}

            <button
              onClick={() => openAuthAndProceed('register')}
              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Start Diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 sm:pt-18 pb-16 sm:pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Same Score Does Not Mean Same Learning Problem</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          MindTrace
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900">
            Find the Gap Behind the Gap.
          </span>
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          AI that doesn't just grade right or wrong. It traces{' '}
          <strong className="text-slate-900 font-semibold">prerequisite bottlenecks</strong> — and builds your shortest path to mastery.
        </p>

        {/* Dual Gateway: Learners & Students vs. Faculty & Institutional Admins */}
        <div className="mt-9 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Learner Card */}
          <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Learners / Students
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Diagnostic & Learning Twin
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Take the cognitive assessment to discover exact prerequisite gaps, inspect your mistake DNA, and launch 15-min rescue sprints.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => openAuthAndProceed('register')}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register as Learner</span>
              </button>
              <button
                onClick={() => openAuthAndProceed('login')}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Log In</span>
              </button>
            </div>
          </div>

          {/* Institutional Faculty Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Institutional Admin
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Faculty & Institutional Portal
              </h3>
              <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                Analyze batch prerequisite bottleneck heatmaps, prescribe targeted interventions, and oversee DPDP/FERPA consent compliance.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-indigo-100">
              <button
                onClick={() => openAuthModal('register', '', 'admin')}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Faculty Registration</span>
              </button>
              <button
                onClick={() => openAuthModal('login', '', 'admin')}
                className="py-2 px-3 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Admin Sign-In</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Prototype Exploration CTA */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              if (activeStudent) {
                setCurrentPage('dashboard');
              } else {
                openAuthModal('login');
              }
            }}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium underline flex items-center gap-1 cursor-pointer"
          >
            <span>Or explore learner workspace directly</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={() => {
              if (activeAdmin) {
                switchUserRole('admin');
                setCurrentPage('admin-dashboard');
              } else {
                openAdminAuthModal('login');
              }
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Open Faculty Admin Section</span>
          </button>
        </div>

        {/* Active Profile Pill or Notice */}
        {activeStudent ? (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Current active profile:</span>
            <strong className="text-slate-800 font-semibold">{activeStudent.name}</strong>
            <span className="text-slate-400">({activeStudent.degree})</span>
            <button
              onClick={() => logoutStudent()}
              className="ml-2 text-rose-500 hover:text-rose-700 underline text-[11px] cursor-pointer"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span>No active profile. Register or login to begin.</span>
          </div>
        )}

        {/* Hero Visual: The 5-Step MindTrace Flow */}
        <div className="mt-14 max-w-5xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs text-left">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                The MindTrace Architecture
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Cognitive Misconception Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-blue-300 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Step 01
              </div>
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Assessment
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Captures choices, hesitation time, and error distractor options.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-purple-300 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Step 02
              </div>
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-600" />
                AI Diagnosis
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Separates slips from deep misconceptions & prerequisite gaps.
              </p>
            </div>

            {/* Step 3 (Highlighted) */}
            <div className="bg-blue-50/70 border-2 border-blue-500 rounded-xl p-4 shadow-xs relative">
              <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                Core Secret
              </span>
              <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                Step 03
              </div>
              <div className="font-semibold text-sm text-blue-950 flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-blue-600" />
                Root Gap
              </div>
              <p className="text-xs text-blue-800 mt-2 leading-relaxed">
                Recursively traces prerequisite links backward to the origin.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-amber-300 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Step 04
              </div>
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                Targeted Fix
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Micro-intervention on the bottleneck, not the symptom.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-emerald-300 transition-colors">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Step 05
              </div>
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Mastery
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Reassesses and permanently updates the Learning Twin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Persona Showcase: "Same Score, Different Problem" */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Beyond Superficial Scoring
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-950">
              Why Traditional EdTech Leaves Students Stuck
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Three students score 6/10 on the exact same Binary Search Trees test. Traditional platforms tell them all: "Practice 20 more BST problems." Look what MindTrace finds:
            </p>
          </div>

          {/* Interactive Persona Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(['A', 'B', 'C'] as const).map((persona) => {
              const info = studentDetails[persona];
              const isSelected = activeTabStudent === persona;
              return (
                <button
                  key={persona}
                  onClick={() => handleSelectStudentDemo(persona)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-white border-blue-600 text-blue-700 shadow-sm ring-2 ring-blue-600/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                  }`}
                >
                  Student {persona}: {info.name} ({info.score})
                </button>
              );
            })}
          </div>

          {/* Persona Card Detail */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900">
                    Student {activeTabStudent}: {studentDetails[activeTabStudent].name}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Score: {studentDetails[activeTabStudent].score}
                  </span>
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${studentDetails[activeTabStudent].badge}`}
                  >
                    Identified Archetype: {studentDetails[activeTabStudent].tag}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  loadStudentPersonaAndInspect(activeTabStudent);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>View Forensic Autopsy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  The Root Misconception / Gap
                </h4>
                <p className="text-sm font-semibold text-slate-900">
                  {studentDetails[activeTabStudent].rootIssue}
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {studentDetails[activeTabStudent].analysis}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Prescribed Shortest Path to Mastery
                </h4>
                <p className="text-xs font-medium text-slate-800 mt-2">
                  {studentDetails[activeTabStudent].remedy}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Diagnostic confidence</span>
                  <span className="font-bold text-slate-900">84% Root Gap match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Integrated Learning System
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-950">
            Tools That Bridge Diagnosis to Retention
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setCurrentPage('autopsy')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Learning Autopsy & Mistake DNA
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Post-assessment forensic breakdown that categorizes errors into Conceptual, Prerequisite, Application, and Careless slips.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
              <span>Explore autopsy report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => setCurrentPage('knowledge-graph')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <GitFork className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Prerequisite Knowledge Graph
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Interactive concept dependency map. Reveals how foundational mastery in Recursion unlocks Binary Trees and Graph Traversals.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600">
              <span>Inspect knowledge graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => setCurrentPage('rescue')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Rescue Mode (15 / 30 / 60 Min)
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Short on time before an exam? High-impact compression algorithm identifies the top 3 highest-leverage concepts to salvage your performance.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-rose-700">
              <span>Explore rescue sprint</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 sm:py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-slate-800">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to find the gap behind your gap?
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Stop blindly solving hundreds of problems. Register now, take the diagnostic assessment, and let MindTrace build your direct route to mastery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthAndProceed('register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register & Start Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors"
            >
              Enter Student Workspace
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500">
        <p>MindTrace — AI-powered Learning Intelligence System.</p>
        <p className="mt-1 font-medium text-slate-600">“Same score does not mean same learning problem.”</p>
      </footer>

      {/* Floating AI Assistant Chatbot with FAQs & Universal Q&A */}
      <FloatingAssistant onOpenAuth={openAuthAndProceed} />
    </div>
  );
};
