import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { SharedMessageRecord, subscribeToMessages } from '../lib/firebase';

export const MessagesView: React.FC = () => {
  const [sharedMessages, setSharedMessages] = useState<SharedMessageRecord[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);
  useEffect(() => subscribeToMessages(setSharedMessages, (error) => setSyncError(error.message)), []);
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Communication</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Faculty guidance and MindTrace learning updates in one place.</p>
      </header>
      {syncError && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">Shared messages are temporarily unavailable. Please retry when your connection is restored.</div>}
      <div className="space-y-3">
        {sharedMessages.map((message) => (
          <article key={message.id} className="bg-white border border-blue-200 rounded-2xl p-5"><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Shared message</p><h2 className="font-bold text-slate-900 mt-1">{message.subject}</h2><p className="text-sm text-slate-600 leading-6 mt-2">{message.body}</p><p className="text-xs text-slate-400 mt-3">{message.senderName}</p></article>
        ))}
        {!syncError && sharedMessages.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><MessageSquare className="w-8 h-8 text-slate-300 mx-auto" /><p className="text-sm font-semibold text-slate-700 mt-3">No shared messages yet</p><p className="text-xs text-slate-500 mt-1">Faculty and MindTrace updates will appear here.</p></div>}
      </div>
    </div>
  );
};
