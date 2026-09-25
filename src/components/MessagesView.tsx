import React from 'react';
import { Bell, CheckCircle2, MessageSquare, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MessagesView: React.FC = () => {
  const { activeStudent } = useApp();
  const messages = [
    {
      id: 'faculty-dsa',
      sender: 'Dr. Sharma',
      role: 'Faculty',
      text: 'Your DSA assignment has been reviewed. Please revisit Question 4 and retry the recursion exercise.',
      time: 'Today, 10:20 AM',
      icon: UserRound
    },
    {
      id: 'mindtrace-progress',
      sender: 'MindTrace',
      role: 'Learning intelligence',
      text: `${activeStudent?.primaryRootGap || 'Your recursion'} is the best next focus area. Your next practice block is ready.`,
      time: 'Yesterday, 6:40 PM',
      icon: Bell
    },
    {
      id: 'faculty-welcome',
      sender: 'Course Faculty',
      role: 'Class announcement',
      text: 'The Binary Search Trees module is now available. Complete the guided practice before the chapter check.',
      time: '2 days ago',
      icon: MessageSquare
    }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Communication</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Faculty guidance and MindTrace learning updates in one place.</p>
      </header>
      <div className="space-y-3">
        {messages.map((message) => {
          const Icon = message.icon;
          return (
            <article key={message.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div><h2 className="font-bold text-slate-900">{message.sender}</h2><p className="text-xs text-slate-500">{message.role}</p></div>
                  <span className="text-xs text-slate-400">{message.time}</span>
                </div>
                <p className="text-sm text-slate-600 leading-6 mt-3">{message.text}</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-700 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Actionable update</div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
