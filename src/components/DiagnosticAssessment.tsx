import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Activity,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  Brain,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DiagnosticAssessment: React.FC = () => {
  const {
    assessmentQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    assessmentResponses,
    recordAssessmentResponse,
    isAssessmentCompleted,
    finishAssessment,
    resetAssessment,
    computedAssessmentScore,
    activeStudent,
    setCurrentPage
  } = useApp();

  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState<boolean>(false);
  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const currentResponse = assessmentResponses[currentQuestion.id];
  const [selectedOpt, setSelectedOpt] = useState<string | null>(
    currentResponse?.selectedOptionId ?? null
  );

  const handleSelectOption = (optId: string) => {
    setSelectedOpt(optId);
  };

  const handleSubmitCurrent = (isUnsure = false) => {
    if (!selectedOpt && !isUnsure) return;
    recordAssessmentResponse(currentQuestion.id, selectedOpt, isUnsure);
    setHasSubmittedCurrent(true);
  };

  const handleNext = () => {
    setHasSubmittedCurrent(false);
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      const nextResp = assessmentResponses[assessmentQuestions[nextIdx].id];
      setSelectedOpt(nextResp?.selectedOptionId ?? null);
    } else {
      finishAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      const prevResp = assessmentResponses[assessmentQuestions[prevIdx].id];
      setSelectedOpt(prevResp?.selectedOptionId ?? null);
      setHasSubmittedCurrent(true);
    }
  };

  const handleJumpTo = (index: number) => {
    setCurrentQuestionIndex(index);
    const resp = assessmentResponses[assessmentQuestions[index].id];
    setSelectedOpt(resp?.selectedOptionId ?? null);
    setHasSubmittedCurrent(!!resp);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Assessment Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Diagnostic Assessment
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-700">
                Subject: Data Structures
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Topic: Trees & Recursion
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Active Student Chip */}
            {activeStudent ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-300"
                />
                <div className="text-left text-xs">
                  <div className="font-bold text-slate-800 leading-none">{activeStudent.name}</div>
                  <div className="text-[10px] text-slate-500 leading-none mt-0.5">{activeStudent.degree.split(' ')[0]}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">Guest Learner</span>
              </div>
            )}

            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Q{currentQuestionIndex + 1}/{assessmentQuestions.length}
            </span>
            <button
              onClick={resetAssessment}
              className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 border border-slate-200/60"
              title="Reset Assessment"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Question Step Indicator */}
        <div className="pt-4 space-y-3">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%`
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {assessmentQuestions.map((q, idx) => {
              const resp = assessmentResponses[q.id];
              const isCurrent = idx === currentQuestionIndex;
              let dotClass = 'border-slate-200 bg-slate-100 text-slate-500';
              if (resp) {
                dotClass = resp.isCorrect
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 font-bold'
                  : 'border-rose-300 bg-rose-50 text-rose-700 font-bold';
              }
              if (isCurrent) {
                dotClass = 'border-blue-600 bg-blue-600 text-white font-bold ring-2 ring-blue-100';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => handleJumpTo(idx)}
                  className={`w-7 h-7 shrink-0 rounded-lg text-xs border flex items-center justify-center transition-all ${dotClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Banner if finished */}
      {isAssessmentCompleted && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold">Assessment Complete</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold border border-blue-400/30">
                Score: {computedAssessmentScore.correct}/10
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              MindTrace has analyzed your response pattern, misconception signatures, and hesitation metrics.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('autopsy')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 shrink-0 animate-pulse hover:animate-none"
          >
            <Activity className="w-4 h-4 text-purple-200" />
            <span>Run Learning Autopsy</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interactive MCQ Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Question Header Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              Topic: {currentQuestion.topicName}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              Difficulty: {currentQuestion.difficulty}
            </span>
          </div>
          {currentQuestion.prerequisiteTested && (
            <span className="text-slate-400 hidden sm:inline">
              Testing prerequisite: <strong className="text-slate-700">{currentQuestion.prerequisiteTested}</strong>
            </span>
          )}
        </div>

        {/* Prompt Text */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug whitespace-pre-line">
            {currentQuestion.prompt}
          </h3>

          {/* Optional Code Snippet */}
          {currentQuestion.codeSnippet && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
              <pre>{currentQuestion.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOpt === option.id;
            const resp = currentResponse;
            const isSubmitted = !!resp || hasSubmittedCurrent;

            let optionStyle =
              'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800';

            if (isSelected) {
              optionStyle = 'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-500 font-medium';
            }

            if (isSubmitted) {
              if (option.isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
              } else if (isSelected && !option.isCorrect) {
                optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-medium';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3 ${optionStyle}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center text-xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white font-bold'
                      : 'border-slate-300 bg-white text-slate-500'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </div>
                <div className="flex-1">
                  <div>{option.text}</div>
                  {/* Real-time Misconception Note revealed if answer submitted */}
                  {isSubmitted && !option.isCorrect && option.misconceptionNote && isSelected && (
                    <div className="mt-2 text-xs text-rose-700 bg-rose-100/70 p-2 rounded-lg border border-rose-200/60 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        <strong>Diagnostic Flag:</strong> {option.misconceptionNote}
                      </span>
                    </div>
                  )}
                  {isSubmitted && option.isCorrect && isSelected && (
                    <div className="mt-2 text-xs text-emerald-700 bg-emerald-100/70 p-2 rounded-lg border border-emerald-200/60 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Correct reasoning identified!</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Submit / I'm Not Sure / Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <button
              onClick={() => handleSubmitCurrent(true)}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              title="Flag question as low confidence"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>I'm Not Sure</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSubmitCurrent(false)}
              disabled={!selectedOpt}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Confirm Choice
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>
                {currentQuestionIndex === assessmentQuestions.length - 1
                  ? 'Complete Assessment'
                  : 'Next Question'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
