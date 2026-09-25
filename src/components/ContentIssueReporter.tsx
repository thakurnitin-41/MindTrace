import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Flag } from 'lucide-react';

export type ContentIssueType = 'Incorrect information' | 'Incorrect answer' | 'Typographical error' | 'Broken resource' | 'Question unclear' | 'Other';

interface ContentIssueReporterProps {
  contentId: string;
  contentTitle: string;
}

export const ContentIssueReporter: React.FC<ContentIssueReporterProps> = ({ contentId, contentTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [issueType, setIssueType] = useState<ContentIssueType>('Incorrect information');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitReport = (event: React.FormEvent) => {
    event.preventDefault();
    const report = { id: `issue-${Date.now()}`, contentId, contentTitle, issueType, details: details.trim(), status: 'pending', createdAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('mindtrace_content_reports') || '[]');
    localStorage.setItem('mindtrace_content_reports', JSON.stringify([report, ...existing]));
    setSubmitted(true);
    setDetails('');
  };

  if (!isOpen) {
    return <button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-700"><Flag className="w-3.5 h-3.5" /> Report an issue</button>;
  }

  return (
    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="text-sm font-bold text-slate-900">Report an issue</h3><p className="text-xs text-slate-600 mt-1">Help faculty review and improve “{contentTitle}”.</p></div>
        <button type="button" onClick={() => setIsOpen(false)} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Close</button>
      </div>
      {submitted ? (
        <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-emerald-700"><CheckCircle2 className="w-4 h-4" /> Report submitted for faculty review.</div>
      ) : (
        <form onSubmit={submitReport} className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-700">Issue type<select value={issueType} onChange={(event) => setIssueType(event.target.value as ContentIssueType)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-normal"><option>Incorrect information</option><option>Incorrect answer</option><option>Typographical error</option><option>Broken resource</option><option>Question unclear</option><option>Other</option></select></label>
          <label className="block text-xs font-semibold text-slate-700">Details (optional)<textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-normal" placeholder="Tell us what should be reviewed." /></label>
          <div className="flex items-center gap-2 text-[11px] text-slate-500"><AlertCircle className="w-3.5 h-3.5" /> Faculty can accept, reject, edit, and notify you about reports.</div>
          <button type="submit" className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold">Submit report</button>
        </form>
      )}
    </div>
  );
};
