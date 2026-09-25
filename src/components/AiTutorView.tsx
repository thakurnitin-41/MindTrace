import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Languages,
  Code2,
  ArrowRight,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiTutorView: React.FC = () => {
  const {
    activeStudent,
    chatMessages,
    sendTutorMessage,
    tutorTyping,
    setCurrentPage
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, tutorTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendTutorMessage(inputVal.trim());
    setInputVal('');
  };

  const handleQuickAction = (text: string) => {
    sendTutorMessage(text);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header and Context Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-100 text-purple-700">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              MindTrace AI Tutor
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              Reasoning Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            “Learn through reasoning, not just answers.”
          </p>
        </div>

        {/* Small Context Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 px-4 shadow-2xs flex items-center gap-4">
          <div className="border-r border-slate-100 pr-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current Topic
            </div>
            <div className="text-xs font-bold text-slate-900">Recursion</div>
          </div>
          <div className="border-r border-slate-100 pr-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Mastery
            </div>
            <div className="text-xs font-bold text-rose-600">42% (Needs Attention)</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Rec. Difficulty
            </div>
            <div className="text-xs font-bold text-blue-700">Beginner</div>
          </div>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col h-[600px] overflow-hidden">
        {/* Tutor Top Banner */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>
              {activeStudent ? (
                <>
                  Personalized for <strong>{activeStudent.name}</strong> • Root Bottleneck:{' '}
                  <strong className="text-purple-700">Recursion Call Stacks</strong>
                </>
              ) : (
                <>
                  <strong>MindTrace Reasoning Engine</strong> • Diagnostic mode
                </>
              )}
            </span>
          </div>
          <button
            onClick={() => setCurrentPage('practice')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Jump to Adaptive Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {chatMessages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isAi
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2 max-w-2xl">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-50 border border-slate-200 text-slate-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Rich Callout Card if attached */}
                    {msg.callout && (
                      <div className="mt-3 p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/80 text-xs text-purple-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-purple-900">
                          <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                          {msg.callout.title}
                        </div>
                        <p className="leading-relaxed text-purple-800">{msg.callout.content}</p>
                      </div>
                    )}
                  </div>

                  <div
                    className={`text-[10px] text-slate-400 px-1 ${
                      isAi ? 'text-left' : 'text-right'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {tutorTyping && (
            <div className="flex gap-3 items-center text-slate-400 text-xs animate-pulse">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Bot className="w-4 h-4" />
              </div>
              <span className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600">
                MindTrace AI is reasoning from your error taxonomy...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Action Chips Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Actions:
          </span>
          <button
            onClick={() => handleQuickAction('Explain recursion simply.')}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200 shrink-0 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            Explain Simply
          </button>
          <button
            onClick={() => handleQuickAction('Give me a clear code example of tree recursion.')}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200 shrink-0 transition-colors flex items-center gap-1"
          >
            <Code2 className="w-3 h-3 text-blue-600" />
            Give Example
          </button>
          <button
            onClick={() => handleQuickAction('Give me a hint for tree height calculation.')}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200 shrink-0 transition-colors flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3 text-amber-600" />
            Give Hint
          </button>
          <button
            onClick={() => handleQuickAction('Show step-by-step how to write a base case.')}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200 shrink-0 transition-colors flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Show Step-by-Step
          </button>
          <button
            onClick={() => handleQuickAction('Test my understanding with a quick question.')}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200 shrink-0 transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3 text-indigo-600" />
            Test Me
          </button>
          <button
            onClick={() => handleQuickAction('Explain recursion in Hindi / Hinglish simply.')}
            className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200 shrink-0 transition-colors flex items-center gap-1"
          >
            <Languages className="w-3 h-3 text-purple-600" />
            Explain in Hindi
          </button>
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask anything about recursion, BST boundaries, or your assessment mistakes..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || tutorTyping}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-xs"
          >
            <span>Ask Tutor</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
