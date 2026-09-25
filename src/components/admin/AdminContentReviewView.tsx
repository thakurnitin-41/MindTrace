import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, FileWarning, XCircle } from 'lucide-react';
import { ContentReportRecord, subscribeToContentReports, updateContentReport } from '../../lib/firebase';
import { useApp } from '../../context/AppContext';

export const AdminContentReviewView: React.FC = () => {
  const { activeAdmin } = useApp();
  const [reports, setReports] = useState<ContentReportRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => subscribeToContentReports(setReports, (syncError) => setError(syncError.message)), []);

  const review = async (report: ContentReportRecord, status: ContentReportRecord['status']) => {
    if (!report.id || !activeAdmin) return;
    setBusyId(report.id);
    try {
      await updateContentReport(report.id, { status, reviewedAt: new Date().toISOString(), reviewedBy: activeAdmin.id, resolutionNote: status === 'accepted' ? 'Accepted for content correction.' : 'Reviewed and rejected.' });
    } catch (reviewError) {
      console.error('[ContentReview] Failed to update report:', reviewError);
      setError('Could not update this report. Please retry.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Faculty & Admin Operations</p><h1 className="text-2xl font-bold text-slate-900 mt-1">Content Review</h1><p className="text-sm text-slate-500 mt-1">Review student reports before changing official learning content.</p></header>
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
      {reports.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><FileWarning className="w-8 h-8 text-slate-300 mx-auto" /><p className="text-sm font-semibold text-slate-700 mt-3">No content reports yet</p><p className="text-xs text-slate-500 mt-1">Student reports will appear here in real time.</p></div> : <div className="space-y-3">{reports.map((report) => <article key={report.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-col md:flex-row md:items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h2 className="font-bold text-slate-900">{report.contentTitle}</h2><span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{report.status}</span></div><p className="text-xs text-slate-500 mt-1">{report.issueType} · {new Date(report.createdAt).toLocaleString()}</p><p className="text-sm text-slate-600 mt-3">{report.details || 'No additional details provided.'}</p></div><div className="flex items-center gap-2 shrink-0">{report.status === 'pending' ? <><button disabled={busyId === report.id} onClick={() => review(report, 'accepted')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold disabled:opacity-50"><CheckCircle2 className="w-3.5 h-3.5" />Accept</button><button disabled={busyId === report.id} onClick={() => review(report, 'rejected')} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-50"><XCircle className="w-3.5 h-3.5" />Reject</button></> : <span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="w-3.5 h-3.5" />Reviewed</span>}</div></div></article>)}</div>}
    </div>
  );
};
