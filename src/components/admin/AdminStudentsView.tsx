import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Flame,
  Clock,
  Brain,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Send,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  Mail,
  Phone,
  Sparkles,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, StudentDataAccessStatus } from '../../types';

export const AdminStudentsView: React.FC = () => {
  const {
    students,
    activeAdmin,
    requestStudentDataAccess,
    grantStudentDataAccess,
    revokeStudentDataAccess,
    addFacultyNote,
    assignStudentIntervention,
    updateStudentRiskLevel,
    logAutopsyInspection
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'moderate' | 'low'>('all');
  const [accessFilter, setAccessFilter] = useState<'all' | 'restricted' | 'pending' | 'granted'>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleInspectStudent = (student: StudentProfile) => {
    setSelectedStudentId(student.id);
    if (student.dataAccessStatus === 'granted') {
      logAutopsyInspection(student.id, student.name);
    }
  };

  // Request Access Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [requestTargetStudent, setRequestTargetStudent] = useState<StudentProfile | null>(null);
  const [requestReason, setRequestReason] = useState<string>(
    'Academic Advising & Diagnostic Review: Student identified with severe recursion stack unwinding gap requiring customized rescue sprint and code trace guidance.'
  );
  const [requestSubmittedSuccess, setRequestSubmittedSuccess] = useState<boolean>(false);

  // Intervention Modal
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState<boolean>(false);
  const [interventionTitle, setInterventionTitle] = useState<string>('Targeted Rescue Sprint: Call Stack Unwinding Visualizer');
  const [interventionType, setInterventionType] = useState<'rescue_session' | 'topic_booster' | 'diagnostic_retest' | 'mentor_meeting'>('rescue_session');

  // Faculty Note Input
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteCategory, setNewNoteCategory] = useState<'intervention' | 'commendation' | 'advising' | 'general'>('advising');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.institution && s.institution.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.targetExam && s.targetExam.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.primaryRootGap.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
      const matchAccess = accessFilter === 'all' || s.dataAccessStatus === accessFilter;

      return matchSearch && matchRisk && matchAccess;
    });
  }, [students, searchTerm, riskFilter, accessFilter]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const handleOpenRequestModal = (student: StudentProfile) => {
    setRequestTargetStudent(student);
    setRequestSubmittedSuccess(false);
    setIsRequestModalOpen(true);
  };

  const handleSendAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTargetStudent) return;
    const res = await requestStudentDataAccess(requestTargetStudent.id, requestReason);
    if (res.success) {
      setRequestSubmittedSuccess(true);
      setTimeout(() => {
        setIsRequestModalOpen(false);
        setRequestSubmittedSuccess(false);
      }, 1500);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newNoteText.trim()) return;
    addFacultyNote(selectedStudent.id, newNoteText, newNoteCategory);
    setNewNoteText('');
  };

  const handleAssignIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !interventionTitle.trim()) return;
    assignStudentIntervention(selectedStudent.id, interventionTitle, interventionType);
    setIsInterventionModalOpen(false);
  };

  const exportStudentDossier = (student: StudentProfile) => {
    const isGranted = student.dataAccessStatus === 'granted';
    const dossierData = {
      institution: activeAdmin?.institution || 'MindTrace Academic Network',
      exportedBy: activeAdmin?.name || 'Administrator',
      exportTimestamp: new Date().toISOString(),
      student: {
        id: student.id,
        name: student.name,
        email: isGranted ? student.email : '[MASKED - PRIVACY CLEARANCE REQUIRED]',
        phone: isGranted ? student.phone : '[MASKED - PRIVACY CLEARANCE REQUIRED]',
        institution: student.institution,
        degree: student.degree,
        targetExam: student.targetExam,
        masteryScore: student.masteryScore,
        currentStreak: student.currentStreak,
        primaryRootGap: student.primaryRootGap,
        misconceptionArchetype: student.misconceptionArchetype,
        riskLevel: student.riskLevel,
        privacyClearance: student.dataAccessStatus,
        facultyNotes: student.facultyNotes || [],
        assignedInterventions: student.assignedInterventions || []
      }
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-dossier-${student.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="admin-students-view" className="space-y-6">
      {/* Header & Description */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Cohort Progress & Academic Records
              </span>
              <span className="text-xs text-gray-500">
                Role-Gated Student Data Access
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              Student Cohort Directory
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Monitor academic progress, diagnose prerequisite bottlenecks, and request student consent for full diagnostic autopsies.
            </p>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, college, target exam, or bottleneck..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="all">All Academic Risk Levels</option>
              <option value="critical">Critical Urgency (Needs Rescue)</option>
              <option value="moderate">Moderate Attention</option>
              <option value="low">Low Risk / On Track</option>
            </select>
          </div>

          {/* Privacy Access Filter */}
          <div>
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="all">All Privacy Statuses</option>
              <option value="restricted">Masked (Privacy Safeguard)</option>
              <option value="pending">Consent Request Pending</option>
              <option value="granted">Full Disclosure Granted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cohort Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => {
          const isCritical = student.riskLevel === 'critical';
          const isModerate = student.riskLevel === 'moderate';
          const isGranted = student.dataAccessStatus === 'granted';
          const isPending = student.dataAccessStatus === 'pending';

          return (
            <div
              key={student.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                isCritical
                  ? 'border-rose-200'
                  : isModerate
                  ? 'border-amber-200'
                  : 'border-gray-200'
              }`}
            >
              <div>
                {/* Card Header: Avatar & Risk Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-full border border-gray-200 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{student.name}</h3>
                      <p className="text-xs text-gray-500 truncate max-w-[170px]">
                        {student.institution}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800'
                        : isModerate
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isCritical ? 'Critical' : isModerate ? 'Moderate' : 'On Track'}
                  </span>
                </div>

                {/* Academic Context */}
                <div className="flex items-center gap-2 mb-3 text-[11px] text-gray-600">
                  <span className="px-2 py-0.5 rounded bg-gray-100 font-medium">
                    {student.degree}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                    {student.targetExam}
                  </span>
                </div>

                {/* Progress Indicators */}
                <div className="p-3 bg-gray-50 rounded-xl mb-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Mastery Score</span>
                    <span className="font-bold text-gray-900">{student.masteryScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        isCritical
                          ? 'bg-rose-500'
                          : isModerate
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${student.masteryScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-gray-500">
                    <span className="flex items-center gap-1 font-medium text-amber-600">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {student.currentStreak} Day Streak
                    </span>
                    <span>{student.questionsSolved} questions solved</span>
                  </div>
                </div>

                {/* Diagnosed Bottleneck */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                    Identified Cognitive Bottleneck
                  </span>
                  <p className="text-xs font-semibold text-gray-800 leading-snug">
                    {student.primaryRootGap}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Archetype: {student.misconceptionArchetype}
                  </p>
                </div>
              </div>

              {/* Card Footer: Data Access Clearance & Action */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {/* Privacy Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    {isGranted ? (
                      <Unlock className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Lock className="w-3 h-3 text-gray-400" />
                    )}
                    Privacy:
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isGranted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isPending
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isGranted
                      ? 'Consent Verified'
                      : isPending
                      ? 'Consent Pending'
                      : 'Masked (Privacy)'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleInspectStudent(student)}
                    className="py-2 px-3 rounded-xl border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 text-xs font-medium transition-colors text-center cursor-pointer"
                  >
                    Inspect Dossier
                  </button>

                  {!isGranted ? (
                    <button
                      onClick={() => handleOpenRequestModal(student)}
                      disabled={isPending}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors text-center flex items-center justify-center gap-1 ${
                        isPending
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>{isPending ? 'Pending...' : 'Request Access'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => exportStudentDossier(student)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors text-center flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export Record</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STUDENT DOSSIER INSPECTION MODAL */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedStudentId(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-14 h-14 rounded-2xl border-2 border-indigo-400 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedStudent.riskLevel === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {selectedStudent.riskLevel === 'critical' ? 'Critical Alert' : 'On Track'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {selectedStudent.degree} • {selectedStudent.institution}
                    </p>
                    <p className="text-[11px] text-indigo-300 font-mono mt-0.5">
                      Target Goal: {selectedStudent.targetExam}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportStudentDossier(selectedStudent)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body - Tabbed / Scrollable Sections */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* SECTION 1: ALWAYS ACCESSIBLE NECESSARY DATA */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  Academic Mastery & Progress Metrics (Authorized Role Data)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-[11px] text-gray-500 block">Overall Mastery</span>
                    <span className="text-lg font-bold text-gray-900">
                      {selectedStudent.masteryScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-[11px] text-gray-500 block">Active Learning Streak</span>
                    <span className="text-lg font-bold text-amber-600 flex items-center gap-1">
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                      {selectedStudent.currentStreak} Days
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-[11px] text-gray-500 block">Questions Solved</span>
                    <span className="text-lg font-bold text-gray-900">
                      {selectedStudent.questionsSolved}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-[11px] text-gray-500 block">Identified Gap</span>
                    <span className="text-xs font-semibold text-rose-700 block truncate">
                      {selectedStudent.primaryRootGap}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONSENT-GATED CONFIDENTIAL STUDENT DATA */}
              <div className="border border-indigo-100 rounded-2xl p-5 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {selectedStudent.dataAccessStatus === 'granted' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-amber-600" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Confidential Student Dossier & Raw Autopsy
                      </h4>
                      <p className="text-xs text-gray-500">
                        FERPA & DPDP Safeguard: Personal contact and question autopsies are restricted.
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      selectedStudent.dataAccessStatus === 'granted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedStudent.dataAccessStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {selectedStudent.dataAccessStatus === 'granted'
                      ? 'Student Consent Granted'
                      : selectedStudent.dataAccessStatus === 'pending'
                      ? 'Consent Request Pending'
                      : 'Data Masked & Protected'}
                  </span>
                </div>

                {/* When Access is Restricted or Pending */}
                {selectedStudent.dataAccessStatus !== 'granted' ? (
                  <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs text-gray-700 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-500">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>Email: </span>
                        <span className="font-mono text-gray-800 font-semibold">
                          {selectedStudent.email?.slice(0, 2)}••••••@
                          {selectedStudent.institution ? 'institution.edu' : 'gmail.com'}
                        </span>
                        <span className="ml-auto text-[10px] text-amber-600 font-semibold uppercase">
                          [Masked]
                        </span>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>Phone: </span>
                        <span className="font-mono text-gray-800 font-semibold">
                          +91 (•••) •••-{selectedStudent.phone ? selectedStudent.phone.slice(-4) : '4821'}
                        </span>
                        <span className="ml-auto text-[10px] text-amber-600 font-semibold uppercase">
                          [Masked]
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 space-y-2">
                      <p className="font-semibold text-xs flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        Why is full student data restricted?
                      </p>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Under our Role-Based Data Protection protocol, detailed cognitive test choices, question response times, and student contact info cannot be unmasked without an educational rationale and explicit student permission.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {selectedStudent.dataAccessStatus === 'pending' ? (
                        <div className="flex items-center gap-2 text-xs text-amber-700">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span>Request awaiting student confirmation in their Student Settings.</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenRequestModal(selectedStudent)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shadow-sm flex items-center gap-2"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Submit Formal Student Data Access Request</span>
                        </button>
                      )}

                      {/* Demo Helper to Simulate Student Consent */}
                      <button
                        onClick={() => grantStudentDataAccess(selectedStudent.id)}
                        className="px-3 py-1.5 rounded-xl border border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-medium text-xs transition-colors flex items-center gap-1.5"
                        title="Simulate student agreeing to access in their settings"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Simulate Student Approving Consent</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* When Access IS Granted - Full Unmasked Data */
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-4 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">
                          Student Consent Clearance Active & Verified
                        </span>
                      </div>
                      <button
                        onClick={() => revokeStudentDataAccess(selectedStudent.id)}
                        className="text-xs text-rose-600 hover:underline font-medium"
                      >
                        Revoke Clearance
                      </button>
                    </div>

                    {/* Unmasked Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center gap-2 text-gray-800">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        <span className="text-gray-500">Email:</span>
                        <span className="font-semibold">{selectedStudent.email || 'student@institution.edu'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center gap-2 text-gray-800">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-semibold">{selectedStudent.phone || '+91 98765 43210'}</span>
                      </div>
                    </div>

                    {/* Raw Diagnostic Autopsy Question Matrix */}
                    <div className="space-y-2 pt-2">
                      <h5 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-indigo-600" />
                        Raw Diagnostic Question Autopsy (Full Submission Record)
                      </h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-rose-900">Q4: Tree Recursion Return Propagation</span>
                            <span className="text-rose-700 font-semibold">Incorrect (62s spent)</span>
                          </div>
                          <p className="text-[11px] text-gray-600">
                            Student selected option B (global mutation) instead of passing values along call stack return paths.
                          </p>
                          <div className="text-[10px] text-rose-800 font-medium">
                            Cognitive Trap: Base Case Return Loss • Unsure Flag: Yes
                          </div>
                        </div>

                        <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-rose-900">Q5: Dynamic Programming State Transitions</span>
                            <span className="text-rose-700 font-semibold">Incorrect (38s spent)</span>
                          </div>
                          <p className="text-[11px] text-gray-600">
                            Student conflated subproblem memo key with accumulator argument.
                          </p>
                          <div className="text-[10px] text-rose-800 font-medium">
                            Cognitive Trap: State Space Explosion
                          </div>
                        </div>

                        <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-emerald-900">Q1: Hash Map Collision Resolution</span>
                            <span className="text-emerald-700 font-semibold">Correct (24s spent)</span>
                          </div>
                          <p className="text-[11px] text-gray-600">
                            Accurately computed bucket index under open addressing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: FACULTY INTERVENTION & ADVISING CONTROLS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Faculty Pedagogical Interventions & Prescriptions
                  </h4>
                  <button
                    onClick={() => setIsInterventionModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign Intervention</span>
                  </button>
                </div>

                {/* Assigned Interventions List */}
                <div className="space-y-2">
                  {selectedStudent.assignedInterventions &&
                  selectedStudent.assignedInterventions.length > 0 ? (
                    selectedStudent.assignedInterventions.map((int) => (
                      <div
                        key={int.id}
                        className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{int.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                              {int.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Assigned by {int.assignedBy} on {new Date(int.assignedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                          {int.status.toUpperCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No interventions assigned yet.</p>
                  )}
                </div>

                {/* Faculty Advisory Notes Section */}
                <div className="pt-3 border-t border-gray-100">
                  <h5 className="font-bold text-gray-900 text-xs mb-2">Faculty Advisory Notes</h5>

                  <form onSubmit={handleAddNote} className="space-y-2 mb-3">
                    <textarea
                      rows={2}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add an advisory note, observation, or student progress update..."
                      className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={newNoteCategory}
                        onChange={(e) => setNewNoteCategory(e.target.value as any)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="advising">Advising</option>
                        <option value="intervention">Intervention</option>
                        <option value="commendation">Commendation</option>
                        <option value="general">General Note</option>
                      </select>

                      <button
                        type="submit"
                        disabled={!newNoteText.trim()}
                        className="px-3 py-1 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium disabled:opacity-40 transition-colors"
                      >
                        Record Faculty Note
                      </button>
                    </div>
                  </form>

                  {/* Notes Feed */}
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {selectedStudent.facultyNotes && selectedStudent.facultyNotes.length > 0 ? (
                      selectedStudent.facultyNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-800">{note.adminName}</span>
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700">{note.note}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No notes recorded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>MindTrace Academic Compliance Framework • ID: {selectedStudent.id}</span>
              <button
                onClick={() => setSelectedStudentId(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST DATA ACCESS MODAL */}
      {isRequestModalOpen && requestTargetStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-indigo-950 text-white p-6 relative">
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase font-semibold text-indigo-300">
                    Consent-Gated Clearance
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Request Full Student Data Disclosure
                  </h3>
                </div>
              </div>
              <p className="text-xs text-indigo-200 mt-2">
                Target: {requestTargetStudent.name} ({requestTargetStudent.institution})
              </p>
            </div>

            <form onSubmit={handleSendAccessRequest} className="p-6 space-y-4">
              {requestSubmittedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Request successfully dispatched to {requestTargetStudent.name}!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Legitimate Educational Purpose / Rationale
                </label>
                <textarea
                  required
                  rows={4}
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="State the pedagogical reason why you need access to the student's personal contact details and granular question autopsies..."
                  className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  This purpose will be presented to {requestTargetStudent.name} in their Student Privacy notification center.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">Clearance Notice:</p>
                <p>
                  As administrator ({activeAdmin?.name}), your identity, role, and stated purpose will be recorded in the permanent institutional audit trail upon submission.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Access Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN INTERVENTION MODAL */}
      {isInterventionModalOpen && selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setIsInterventionModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-white">Prescribe Pedagogical Intervention</h3>
              <p className="text-xs text-slate-300 mt-1">
                Assign a targeted learning sprint to {selectedStudent.name}
              </p>
            </div>

            <form onSubmit={handleAssignIntervention} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Intervention Title / Task Description
                </label>
                <input
                  type="text"
                  required
                  value={interventionTitle}
                  onChange={(e) => setInterventionTitle(e.target.value)}
                  placeholder="e.g. Targeted Rescue Sprint: Call Stack Visualizer"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Intervention Format
                </label>
                <select
                  value={interventionType}
                  onChange={(e) => setInterventionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="rescue_session">15-30 Min Rescue Sprint</option>
                  <option value="topic_booster">Prerequisite Concept Booster</option>
                  <option value="diagnostic_retest">Targeted Retest</option>
                  <option value="mentor_meeting">1-on-1 Faculty Mentorship Call</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInterventionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign & Notify Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
