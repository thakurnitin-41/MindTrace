import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Plus, Send, Users } from 'lucide-react';
import { createAcademicRecord, createSharedMessage, subscribeToAcademicRecords } from '../../lib/firebase';
import { useApp } from '../../context/AppContext';

export const AdminOperationsView: React.FC = () => {
  const { activeAdmin, students } = useApp();
  const [records, setRecords] = useState<Array<{ id: string; type: string; name: string }>>([]);
  const [recordType, setRecordType] = useState<'institution' | 'department' | 'program' | 'course' | 'enrollment' | 'role'>('course');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => subscribeToAcademicRecords(setRecords, (syncError) => setError(syncError.message)), []);

  const addRecord = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !activeAdmin) return;
    try {
      await createAcademicRecord({ type: recordType, name: name.trim(), institution: activeAdmin.institution, ownerId: activeAdmin.id });
      setName('');
      setStatus('Academic record saved and shared with authorized users.');
    } catch (saveError) {
      console.error('[AdminOperations] Failed to save academic record:', saveError);
      setError('Could not save this record. Check Firebase access and retry.');
    }
  };

  const sendMessage = async () => {
    if (!activeAdmin || !message.trim()) return;
    try {
      await createSharedMessage({ senderId: activeAdmin.id, senderName: activeAdmin.name, subject: 'Faculty update', body: message.trim(), type: 'faculty_class', createdAt: new Date().toISOString(), readBy: [] });
      setMessage('');
      setStatus('Message sent to the shared communication stream.');
    } catch (sendError) {
      console.error('[AdminOperations] Failed to send message:', sendError);
      setError('Could not send the message. Check Firebase access and retry.');
    }
  };

  return (
    <div className="space-y-6">
      <header><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Institutional operations</p><h1 className="text-2xl font-bold text-slate-900 mt-1">Academic Structure & Faculty Operations</h1><p className="text-sm text-slate-500 mt-1">Shared records for institutions, programs, courses, enrollments, roles, and faculty communication.</p></header>
      {status && <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700"><CheckCircle2 className="w-4 h-4" />{status}</div>}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
      <div className="grid lg:grid-cols-2 gap-5">
        <form onSubmit={addRecord} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-600" /><h2 className="font-bold text-slate-900">Add academic record</h2></div>
          <select value={recordType} onChange={(event) => setRecordType(event.target.value as typeof recordType)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="institution">Institution</option><option value="department">Department</option><option value="program">Program</option><option value="course">Course</option><option value="enrollment">Student-course enrollment</option><option value="role">Role / permission</option></select>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name or mapping identifier" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"><Plus className="w-4 h-4" />Save shared record</button>
        </form>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2"><Send className="w-5 h-5 text-blue-600" /><h2 className="font-bold text-slate-900">Send class message</h2></div>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} placeholder="Share an update with enrolled students..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={sendMessage} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Send className="w-4 h-4" />Send message</button>
          <p className="text-xs text-slate-500"><Users className="inline w-3.5 h-3.5 mr-1" />{students.length} student records currently visible in this portal.</p>
        </div>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-900">Shared academic records</h2><div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{records.map((record) => <div key={record.id} className="rounded-xl border border-slate-200 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{record.type}</p><p className="text-sm font-semibold text-slate-800 mt-1">{record.name}</p></div>)}</div>{records.length === 0 && <p className="text-sm text-slate-500 mt-3">No shared records yet.</p>}</section>
    </div>
  );
};
