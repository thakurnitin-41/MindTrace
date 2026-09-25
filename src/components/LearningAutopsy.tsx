import React, { useState } from 'react';
import {
  Activity,
  GitFork,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Brain,
  HelpCircle,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LearningAutopsy: React.FC = () => {
  const {
    activeStudent,
    errorBreakdown,
    rootGapDiagnosis,
    setCurrentPage,
    setSelectedGraphNodeId,
    computedAssessmentScore,
    assessmentQuestions,
    assessmentResponses
  } = useApp();

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('q4');

  const errorCategories = [
    {
      name: 'Conceptual Understanding',
      percentage: errorBreakdown.conceptual,
      description: 'Misunderstanding the core definition or invariant conditions.',
      color: 'bg-indigo-600',
      textColor: 'text-indigo-700',
      badgeBg: 'bg-indigo-50 border-indigo-200'
    },
    {
      name: 'Application Errors',
      percentage: errorBreakdown.application,
      description: 'Understanding theory but failing during multi-step execution or memory tracking.',
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      badgeBg: 'bg-blue-50 border-blue-200'
    },
    {
      name: 'Prerequisite Gap',
      percentage: errorBreakdown.prerequisite,
      description: 'Failure caused by unreinforced foundational knowledge in prior modules.',
      color: 'bg-purple-600',
      textColor: 'text-purple-700',
      badgeBg: 'bg-purple-50 border-purple-200'
    },
    {
      name: 'Careless Errors',
      percentage: errorBreakdown.careless,
      description: 'Off-by-one indices, sign swaps, or hurried option misreads.',
      color: 'bg-slate-500',
      textColor: 'text-slate-700',
      badgeBg: 'bg-slate-100 border-slate-200'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 text-purple-700">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Learning Autopsy
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              Signature Diagnostic
            </span>
          </div>
          <p className="text-base text-slate-600 mt-1 font-medium">
            “We looked beyond your score.”
          </p>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-xl shadow-2xs">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Diagnostic Performance</div>
            <div className="text-lg font-bold text-slate-900">
              Score: {computedAssessmentScore.correct}/10 ({computedAssessmentScore.percentage}%)
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
            {computedAssessmentScore.percentage}%
          </div>
        </div>
      </div>

      {/* Error Breakdown Metric Bar / Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Error Taxonomy Breakdown</h3>
            <p className="text-xs text-slate-500">
              Classification of incorrect choices and hesitation states
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Model: Cognitive Error Classifier v2.4</span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5">
          <div
            style={{ width: `${errorBreakdown.conceptual}%` }}
            className="bg-indigo-600 rounded-l-full h-full transition-all"
            title={`Conceptual: ${errorBreakdown.conceptual}%`}
          ></div>
          <div
            style={{ width: `${errorBreakdown.application}%` }}
            className="bg-blue-500 h-full transition-all"
            title={`Application: ${errorBreakdown.application}%`}
          ></div>
          <div
            style={{ width: `${errorBreakdown.prerequisite}%` }}
            className="bg-purple-600 h-full transition-all"
            title={`Prerequisite Gap: ${errorBreakdown.prerequisite}%`}
          ></div>
          <div
            style={{ width: `${errorBreakdown.careless}%` }}
            className="bg-slate-400 rounded-r-full h-full transition-all"
            title={`Careless: ${errorBreakdown.careless}%`}
          ></div>
        </div>

        {/* Breakdown 4 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {errorCategories.map((cat) => (
            <div
              key={cat.name}
              className={`p-3.5 rounded-xl border ${cat.badgeBg} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
                  <span className={`text-base font-extrabold ${cat.textColor}`}>
                    {cat.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prominent AI Diagnosis Card: ROOT LEARNING GAP */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950 text-white rounded-3xl p-6 sm:p-9 shadow-lg border border-purple-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Root Learning Gap
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Confidence:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                {rootGapDiagnosis.confidence}% Probabilistic Match
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {rootGapDiagnosis.name}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              “{rootGapDiagnosis.explanation}”
            </p>
          </div>

          {/* Dependency Chain Visualization */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" />
              <span>Prerequisite Dependency Chain</span>
            </div>

            <div className="bg-slate-900/90 border border-purple-900/50 p-4 rounded-2xl flex flex-wrap items-center gap-2 sm:gap-4">
              {rootGapDiagnosis.chain.map((node, i) => {
                const isLast = i === rootGapDiagnosis.chain.length - 1;
                return (
                  <React.Fragment key={node.id}>
                    <div
                      onClick={() => {
                        setSelectedGraphNodeId(node.id);
                        setCurrentPage('knowledge-graph');
                      }}
                      className={`px-4 py-3 rounded-xl border text-center transition-all cursor-pointer ${
                        node.isRoot
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm ring-2 ring-purple-500/40'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5 justify-center">
                        {node.isRoot && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {node.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Mastery: {node.mastery}%
                      </div>
                      {node.isRoot && (
                        <div className="mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 inline-block">
                          Primary Root Gap
                        </div>
                      )}
                    </div>

                    {!isLast && (
                      <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 hidden sm:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* AI Recommendation Box & Action */}
          <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                AI Recommendation
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                “Strengthen recursion fundamentals before attempting advanced BST problems.”
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCurrentPage('practice')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-purple-600/40 flex items-center gap-2 hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4" />
                <span>Fix This Gap</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question-by-Question Deep Autopsy */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Question-by-Question Evidence</h3>
            <p className="text-xs text-slate-500">
              Click any question to view the exact error trigger and prerequisite trace
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {assessmentQuestions.map((q, idx) => {
            const resp = assessmentResponses[q.id];
            const isCorrect = resp?.isCorrect ?? false;
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-all ${
                  isCorrect
                    ? 'border-slate-200 bg-white'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{q.prompt.slice(0, 80)}...</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Topic: {q.topicName} • Prerequisite: {q.prerequisiteTested || 'Direct'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isCorrect ? 'Correct' : 'Mistake Detected'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-100 bg-white rounded-b-xl space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                      <strong>Full Prompt:</strong> {q.prompt}
                    </div>

                    <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg text-purple-900">
                      <strong>Autopsy Explanation:</strong> {q.explanation}
                    </div>

                    {q.rootGapIfWrong && (
                      <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span>
                          Prerequisite flagged by MindTrace:{' '}
                          <strong className="text-purple-700 uppercase">{q.rootGapIfWrong}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedGraphNodeId(q.rootGapIfWrong || 'recursion');
                            setCurrentPage('knowledge-graph');
                          }}
                          className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Trace on Graph</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
