import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  BookOpen,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RescueModeView: React.FC = () => {
  const {
    rescueDuration,
    setRescueDuration,
    activeRescuePlan,
    isRescueActive,
    rescueActiveStep,
    startRescueSprint,
    nextRescueStep,
    exitRescueSprint,
    setCurrentPage
  } = useApp();

  // Simple countdown timer for sprint runner
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    rescueDuration * 60
  );
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  useEffect(() => {
    setSecondsRemaining(rescueDuration * 60);
  }, [rescueDuration]);

  useEffect(() => {
    let interval: any = null;
    if (isRescueActive && !isTimerPaused && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => Math.max(0, sec - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRescueActive, isTimerPaused, secondsRemaining]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-100 text-amber-800">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rescue Mode
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              High Leverage Sprints
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            “Short on time? Learn what matters most.”
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Algorithm: Impact-Weighted Prerequisite Compression
        </div>
      </div>

      {/* Interactive Time Selector */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Sprint Allocation
          </h2>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            How much time do you have?
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          {([15, 30, 60] as const).map((duration) => {
            const isSelected = rescueDuration === duration;
            return (
              <button
                key={duration}
                onClick={() => setRescueDuration(duration)}
                className={`py-3.5 rounded-2xl font-extrabold text-sm transition-all border flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{duration} MIN</span>
                <span className="text-[10px] font-normal opacity-85">
                  {duration === 15 ? 'Rapid Drill' : duration === 30 ? 'Recommended' : 'Deep Rescue'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Sprint Runner Modal/Banner (if user launched sprint) */}
      {isRescueActive && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/40 relative overflow-hidden animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Live Sprint Active • Step {rescueActiveStep + 1} of {activeRescuePlan.items.length}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeRescuePlan.items[rescueActiveStep].title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-base font-bold text-amber-400">
                {formatTimer(secondsRemaining)}
              </div>
              <button
                onClick={exitRescueSprint}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Exit Sprint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm leading-relaxed text-slate-200">
                <div className="font-semibold text-amber-400 mb-1 text-xs uppercase tracking-wider">
                  Targeted Micro-Summary:
                </div>
                {activeRescuePlan.items[rescueActiveStep].summary}
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                <strong>MindTrace Focus Tip:</strong> Do not trace all 10 recursive levels. Trust that
                the base case stops the loop, and verify the return statement at the single node level.
              </div>
            </div>

            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
              <div className="text-xs text-slate-400 space-y-2">
                <div>
                  Allocated Time:{' '}
                  <strong className="text-white">
                    {activeRescuePlan.items[rescueActiveStep].duration}
                  </strong>
                </div>
                <div>
                  Module Type:{' '}
                  <strong className="text-amber-300">
                    {activeRescuePlan.items[rescueActiveStep].type}
                  </strong>
                </div>
              </div>

              <button
                onClick={nextRescueStep}
                className="mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/30 flex items-center justify-center gap-2"
              >
                <span>
                  {rescueActiveStep === activeRescuePlan.items.length - 1
                    ? 'Complete Sprint'
                    : 'Next Step'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Breakdown & Highest Impact Concepts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Your Rescue Plan Schedule (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Your {rescueDuration}-Minute Rescue Plan
              </h3>
              <p className="text-xs text-slate-500">
                Sequenced dynamically to repair root blockers first
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              5 Micro-Modules
            </span>
          </div>

          <div className="space-y-3">
            {activeRescuePlan.items.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-amber-100 text-slate-700 group-hover:text-amber-900 font-mono text-xs font-bold shrink-0 mt-0.5 transition-colors">
                    {item.duration}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{item.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.summary}</div>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                  {item.type}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={startRescueSprint}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Start Rescue Mode</span>
            </button>
          </div>
        </div>

        {/* Highest Impact Concepts (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Highest Impact Concepts</h3>
              <p className="text-xs text-slate-500">
                Ranked by downstream prerequisite leverage
              </p>
            </div>

            <div className="space-y-3">
              {activeRescuePlan.highestImpactConcepts.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span>{c.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        c.impact === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.impact} Leverage
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7">{c.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="font-bold text-amber-900">Why Rescue Mode Works:</div>
            <p className="leading-relaxed text-amber-800">
              When cramming before a test or interview, students waste 70% of their time practicing concepts they already know or tackling advanced problems without the missing foundation. Rescue Mode surgically repairs the root blocker.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
