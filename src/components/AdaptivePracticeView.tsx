import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Brain,
  Sparkles,
  RotateCcw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdaptivePracticeView: React.FC = () => {
  const {
    adaptivePractice,
    submitAdaptivePracticeAnswer,
    resetAdaptivePractice,
    setCurrentPage
  } = useApp();

  const {
    questions,
    currentIndex,
    currentDifficulty,
    difficultyHistory,
    masteryScore,
    lastResult
  } = adaptivePractice;

  const currentQ = questions[currentIndex % questions.length];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    submitAdaptivePracticeAnswer(selectedOptionId);
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    resetAdaptivePractice();
  };

  const getDifficultyColor = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header and Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-100 text-amber-800">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Adaptive Practice
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Real-time Calibration
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            “Every question changes what comes next.”
          </p>
        </div>

        {/* Dynamic Mastery Meter Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 px-5 shadow-2xs flex items-center gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Topic Mastery
            </div>
            <div className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{masteryScore}%</span>
              <span className="text-xs font-semibold text-slate-500">
                (Recursion)
              </span>
            </div>
          </div>
          <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${masteryScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Dynamic Difficulty Progression Tracker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Adaptive Trajectory</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Current Difficulty: <strong className="text-slate-800">{currentDifficulty}</strong>
          </span>
        </div>

        {/* Progression Steps: Easy → Easy → Medium → Medium → Hard */}
        <div className="flex items-center gap-2 flex-wrap">
          {['Easy', 'Easy', 'Medium', 'Medium', 'Hard'].map((step, idx) => {
            const isReached = idx < difficultyHistory.length;
            const isCurrent = idx === difficultyHistory.length - 1;

            return (
              <React.Fragment key={idx}>
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : isReached
                      ? 'bg-slate-100 text-slate-700 border-slate-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                  }`}
                >
                  {step}
                  {isCurrent && <span className="ml-1 text-[9px] uppercase">(Active)</span>}
                </div>
                {idx < 4 && <span className="text-slate-300 text-xs font-bold">→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Adaptive Question Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Topic: <strong className="text-slate-900">{currentQ.topic}</strong>
            </span>
            <span>•</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md font-bold border ${getDifficultyColor(
                currentDifficulty
              )}`}
            >
              Difficulty: {currentDifficulty}
            </span>
          </div>
          <span className="text-xs text-slate-400">Question #{currentIndex + 1}</span>
        </div>

        {/* Question Prompt */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug whitespace-pre-line">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const hasSubmitted = !!lastResult;

            let cardStyle =
              'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800';

            if (isSelected) {
              cardStyle =
                'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-500 font-medium';
            }

            if (hasSubmitted) {
              if (option.isCorrect) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
              } else if (isSelected && !option.isCorrect) {
                cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-medium';
              }
            }

            return (
              <button
                key={option.id}
                disabled={hasSubmitted}
                onClick={() => setSelectedOptionId(option.id)}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${cardStyle}`}
              >
                <span>{option.text}</span>
                {hasSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                )}
                {hasSubmitted && isSelected && !option.isCorrect && (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Section (Shown after answer submission) */}
        {lastResult && (
          <div
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              lastResult.isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles
                  className={`w-4 h-4 ${
                    lastResult.isCorrect ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider">
                  AI Feedback
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  lastResult.isCorrect
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {lastResult.isCorrect ? 'Concept Verified' : 'Prerequisite Gap Detected'}
              </span>
            </div>

            <p className="text-sm leading-relaxed">{lastResult.feedback}</p>

            <div className="p-3 bg-white/80 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Next question difficulty adjusted:
              </span>
              <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                {lastResult.isCorrect ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                )}
                {lastResult.difficultyChange}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('twin')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            View updated Learning Twin metrics
          </button>

          {!lastResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Next Adaptive Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
