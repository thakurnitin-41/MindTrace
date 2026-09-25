import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Sparkles,
  Zap,
  Code,
  MessageSquare,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Flame,
  Award,
  Filter,
  Send,
  HelpCircle,
  Radio,
  BookOpen,
  Share2,
  ThumbsUp,
  Brain,
  Layers,
  ArrowRight,
  Check,
  Edit3,
  RefreshCw,
  Terminal,
  FileCode,
  PenTool,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  StudentProfile,
  StudyBuddyPairing,
  LearningFocus,
  CollaborationMode,
  BuddyAvailability
} from '../types';
import {
  STUDY_BUDDY_TOPIC_PRESETS,
  calculateBuddyMatch
} from '../data/studyBuddyData';

export const StudyBuddyView: React.FC = () => {
  const {
    students,
    activeStudent,
    studyBuddyPairings,
    activeStudyBuddyPairingId,
    activeStudyBuddyPairing,
    setActiveStudyBuddyPairingId,
    updateStudentLearningFocus,
    sendStudyBuddyRequest,
    respondToStudyBuddyRequest,
    sendStudyBuddyChatMessage,
    updateStudyBuddySessionWorkspace,
    toggleStudyBuddySessionTimer,
    resetStudyBuddySessionTimer,
    completeStudyBuddySession,
    setCurrentPage
  } = useApp();

  // Navigation tabs inside Study Buddy
  const [activeTab, setActiveTab] = useState<'finder' | 'live_room' | 'requests'>('finder');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCandidate, setInviteCandidate] = useState<StudentProfile | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteMode, setInviteMode] = useState<CollaborationMode>('live_coding');
  const [inviteSuccessToast, setInviteSuccessToast] = useState('');

  // Edit focus broadcast modal state
  const [isEditFocusModalOpen, setIsEditFocusModalOpen] = useState(false);
  const [focusTopicId, setFocusTopicId] = useState(activeStudent?.learningFocus?.topicId || 'recursion');
  const [focusTopicName, setFocusTopicName] = useState(activeStudent?.learningFocus?.topicName || 'Recursion & Call Stacks');
  const [focusGoal, setFocusGoal] = useState(activeStudent?.learningFocus?.subtopicOrGoal || 'Stack frame unwinding & multi-branch tree recursion');
  const [focusNotes, setFocusNotes] = useState(activeStudent?.learningFocus?.notes || 'Tracing recursion trees. Looking for a partner to whiteboard call stack frames!');
  const [focusMode, setFocusMode] = useState<CollaborationMode>(activeStudent?.learningFocus?.preferredMode || 'live_coding');
  const [focusAvailability, setFocusAvailability] = useState<BuddyAvailability>(activeStudent?.learningFocus?.availability || 'available_now');
  const [focusCodeSnippet, setFocusCodeSnippet] = useState(activeStudent?.learningFocus?.codeSnippet || '');

  // Live Room state
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'code' | 'whiteboard' | 'prompt'>('code');
  const [chatInputText, setChatInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'python' | 'cpp'>('typescript');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Completion modal state
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completionNote, setCompletionNote] = useState('Great pairing session! We clarified base case boundaries and resolved recursive stack frame overwriting.');

  // Current active pairing fallback
  const currentPairing = activeStudyBuddyPairing || studyBuddyPairings[0];

  // Candidates for pairing (cohort excluding self)
  const candidateStudents = useMemo(() => {
    return students.filter((s) => s.id !== activeStudent?.id);
  }, [students, activeStudent]);

  // Filtered candidate students
  const filteredCandidates = useMemo(() => {
    return candidateStudents.filter((student) => {
      // Query filter
      const matchesQuery =
        !searchQuery ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.learningFocus?.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.learningFocus?.subtopicOrGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.targetExam?.toLowerCase().includes(searchQuery.toLowerCase());

      // Topic filter
      const matchesTopic =
        selectedTopicFilter === 'all' ||
        student.learningFocus?.topicId === selectedTopicFilter;

      // Available filter
      const matchesAvailable =
        !availableOnly ||
        student.learningFocus?.availability === 'available_now';

      return matchesQuery && matchesTopic && matchesAvailable;
    });
  }, [candidateStudents, searchQuery, selectedTopicFilter, availableOnly]);

  // Incoming and Sent pairings
  const incomingPairings = useMemo(() => {
    if (!activeStudent) return [];
    return studyBuddyPairings.filter(
      (p) => p.studentBId === activeStudent.id && p.status === 'pending'
    );
  }, [studyBuddyPairings, activeStudent]);

  const activeOrAcceptedPairings = useMemo(() => {
    if (!activeStudent) return [];
    return studyBuddyPairings.filter(
      (p) =>
        (p.studentAId === activeStudent.id || p.studentBId === activeStudent.id) &&
        (p.status === 'accepted' || p.status === 'active' || p.id === activeStudyBuddyPairingId)
    );
  }, [studyBuddyPairings, activeStudent, activeStudyBuddyPairingId]);

  // Format timer
  const formatTimer = (seconds?: number) => {
    if (seconds === undefined) return '25:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Open invite modal
  const handleOpenInvite = (student: StudentProfile) => {
    setInviteCandidate(student);
    const match = activeStudent ? calculateBuddyMatch(activeStudent, student) : null;
    const defaultTopic = student.learningFocus?.topicName || 'Recursion';
    setInviteMode(student.learningFocus?.preferredMode || 'live_coding');
    setInviteMessage(
      `Hey ${student.name.split(' ')[0]}! Saw your focus on ${defaultTopic}. Let's pair up for a collaborative study sprint!`
    );
    setIsInviteModalOpen(true);
  };

  // Dispatch invite
  const handleSendInvite = async () => {
    if (!inviteCandidate) return;
    const res = await sendStudyBuddyRequest(inviteCandidate.id, inviteMessage, inviteMode);
    setIsInviteModalOpen(false);
    if (res.success) {
      setInviteSuccessToast(`Study Buddy invite sent to ${inviteCandidate.name}!`);
      setTimeout(() => setInviteSuccessToast(''), 4000);
    }
  };

  // Quick accept & jump into live room
  const handleAcceptInvite = (pairingId: string) => {
    respondToStudyBuddyRequest(pairingId, 'accepted');
    setActiveTab('live_room');
  };

  // Save learning focus broadcast
  const handleSaveFocusBroadcast = () => {
    if (!activeStudent) return;
    updateStudentLearningFocus(activeStudent.id, {
      topicId: focusTopicId,
      topicName: focusTopicName,
      subtopicOrGoal: focusGoal,
      notes: focusNotes,
      preferredMode: focusMode,
      availability: focusAvailability,
      codeSnippet: focusCodeSnippet
    });
    setIsEditFocusModalOpen(false);
    setInviteSuccessToast('Your Learning Focus Broadcast has been updated across the cohort!');
    setTimeout(() => setInviteSuccessToast(''), 3500);
  };

  // Select preset topic for broadcast
  const handleSelectPreset = (preset: typeof STUDY_BUDDY_TOPIC_PRESETS[0]) => {
    setFocusTopicId(preset.id);
    setFocusTopicName(preset.name);
    setFocusGoal(preset.defaultSubtopics[0]);
    setFocusNotes(preset.sampleNotes);
    setFocusCodeSnippet(preset.starterCodeSnippet);
  };

  // Send chat message in active session
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim() || !currentPairing) return;
    sendStudyBuddyChatMessage(currentPairing.id, chatInputText.trim(), 'text');
    setChatInputText('');
  };

  // Send quick reaction
  const handleSendQuickReaction = (text: string, type: 'text' | 'hint' | 'high_five' = 'text') => {
    if (!currentPairing) return;
    sendStudyBuddyChatMessage(currentPairing.id, text, type);
  };

  // Run code simulation
  const handleRunCode = () => {
    setIsRunningCode(true);
    setIsConsoleOpen(true);
    setConsoleOutput('Executing test harness against simulated call stack...');
    setTimeout(() => {
      setIsRunningCode(false);
      setConsoleOutput(
        `[Console Output - MindTrace Runtime v2026.9]\n----------------------------------------\nTest Case 1: maxDepth({ val: 3, left: { val: 9 }, right: { val: 20 } })\n=> Result: 2 [PASSED]\n\nTest Case 2: Skewed Tree Depth Test [1 -> 2 -> 3 -> 4]\n=> Result: 4 [PASSED]\n\nStack Frame Trace: 4 frames allocated, 0 memory leaks.\nAll 2 test assertions passed cleanly! 🎉`
      );
    }, 1200);
  };

  // Complete session
  const handleCompleteSession = () => {
    if (!currentPairing) return;
    completeStudyBuddySession(currentPairing.id, completionNote);
    setIsCompleteModalOpen(false);
    setInviteSuccessToast('Collaborative study session completed! Streak & commendation recorded.');
    setTimeout(() => setInviteSuccessToast(''), 4000);
  };

  // Identify partner in current session
  const sessionPartner = useMemo(() => {
    if (!currentPairing || !activeStudent) return null;
    const isStudentA = currentPairing.studentAId === activeStudent.id;
    return {
      id: isStudentA ? currentPairing.studentBId : currentPairing.studentAId,
      name: isStudentA ? currentPairing.studentBName : currentPairing.studentAName,
      avatar: isStudentA ? currentPairing.studentBAvatar : currentPairing.studentAAvatar,
      institution: isStudentA ? currentPairing.studentBInstitution : currentPairing.studentAInstitution
    };
  }, [currentPairing, activeStudent]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification Banner */}
      {inviteSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{inviteSuccessToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Peer Collaborative Learning</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              Study Buddy Cohort Pairing
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Broadcast your current learning bottleneck to your cohort, match with students possessing complementary mastery or shared root gaps, and solve algorithmic challenges in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="text-emerald-300 font-semibold">{candidateStudents.length + 1}</span> Cohort Members Active
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-blue-300">
                <Brain className="w-3.5 h-3.5 text-blue-400" />
                Cognitive Gap Complementary Matching
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-purple-300">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                Shared Interactive Code Sandbox
              </span>
            </div>
          </div>

          {/* Quick Stats & Broadcast Edit CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsEditFocusModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Your Learning Focus</span>
            </button>

            {incomingPairings.length > 0 && (
              <button
                onClick={() => setActiveTab('requests')}
                className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer animate-pulse"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{incomingPairings.length} Incoming Request Waiting!</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Student's Current Focus Broadcast Widget */}
      {activeStudent && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={activeStudent.avatar}
                alt={activeStudent.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 ring-2 ring-indigo-500/20"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  activeStudent.learningFocus?.availability === 'available_now'
                    ? 'bg-emerald-500'
                    : activeStudent.learningFocus?.availability === 'open_to_pairing'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
                title={`Status: ${activeStudent.learningFocus?.availability || 'available_now'}`}
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Your Cohort Broadcast
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    activeStudent.learningFocus?.availability === 'available_now'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : activeStudent.learningFocus?.availability === 'open_to_pairing'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {activeStudent.learningFocus?.availability === 'available_now'
                    ? '🟢 Available Now'
                    : activeStudent.learningFocus?.availability === 'open_to_pairing'
                    ? '🟡 Open to Invites'
                    : '🔴 Solo Focus Mode'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Mode: {activeStudent.learningFocus?.preferredMode.replace('_', ' ').toUpperCase() || 'LIVE CODING'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">
                  {activeStudent.learningFocus?.topicName || 'Recursion & Call Stacks'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-sm font-medium text-slate-700">
                  {activeStudent.learningFocus?.subtopicOrGoal || activeStudent.primaryRootGap}
                </span>
              </div>

              <p className="text-xs text-slate-500 italic max-w-2xl line-clamp-1">
                "{activeStudent.learningFocus?.notes || 'Working through tricky edge cases and looking for a peer to whiteboard logic with.'}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditFocusModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => setActiveTab('finder')}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Matching Peer</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('finder')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'finder'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find a Buddy & Cohort Focus</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {candidateStudents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('live_room')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'live_room'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Live Study Room</span>
            {activeOrAcceptedPairings.length > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold animate-pulse">
                Active
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'requests'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Pairing Requests & History</span>
            {incomingPairings.length > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                {incomingPairings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: FIND A BUDDY & COHORT FOCUS */}
      {activeTab === 'finder' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search buddies by name, college (IIT, BITS, DTU), focus topic, or goal..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Availability Filter Toggle */}
              <button
                type="button"
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  availableOnly
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    availableOnly ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>Available Now Only</span>
              </button>
            </div>

            {/* Topic Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Topic:
              </span>
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'recursion', label: 'Recursion' },
                { id: 'trees', label: 'Trees & BST' },
                { id: 'binary_search', label: 'Binary Search' },
                { id: 'searching', label: 'Graphs & BFS' },
                { id: 'arrays', label: 'DP & Arrays' }
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedTopicFilter(chip.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    selectedTopicFilter === chip.id
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCandidates.map((candidate) => {
              const match = activeStudent
                ? calculateBuddyMatch(activeStudent, candidate)
                : { score: 85, synergyType: 'general' as const, reasons: [] };

              const focus = candidate.learningFocus;

              return (
                <div
                  key={candidate.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Top card section: Profile & Compatibility score */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              focus?.availability === 'available_now'
                                ? 'bg-emerald-500'
                                : focus?.availability === 'open_to_pairing'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                            title={focus?.availability || 'Available'}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                            {candidate.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                            {candidate.institution || 'Engineering College'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {candidate.degree}
                          </div>
                        </div>
                      </div>

                      {/* Match Compatibility Badge */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>{match.score}% Match</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {match.synergyType === 'complementary'
                            ? '🎯 Mastery Synergy'
                            : match.synergyType === 'peer_gap'
                            ? '🤝 Peer Co-Learner'
                            : '💼 Placement Goal'}
                        </div>
                      </div>
                    </div>

                    {/* Current Learning Focus Banner */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-blue-500" />
                          Current Learning Focus
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800">
                          {focus?.topicName || 'General DSA'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        {focus?.subtopicOrGoal || candidate.learningGoal}
                      </div>

                      {focus?.notes && (
                        <p className="text-[11px] text-slate-600 italic line-clamp-2">
                          "{focus.notes}"
                        </p>
                      )}
                    </div>

                    {/* Strengths & Root Gap Alignment */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Overall Mastery:</span>
                        <span className="font-bold text-slate-800">{candidate.overallMastery}%</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Streak:</span>
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500" /> {candidate.currentStreak} Days
                        </span>
                      </div>

                      {match.reasons.length > 0 && (
                        <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 leading-snug">
                          <span className="font-bold text-emerald-950">Why Pair: </span>
                          {match.reasons[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium capitalize">
                      Prefers: {focus?.preferredMode.replace('_', ' ') || 'Live coding'}
                    </span>

                    <button
                      onClick={() => handleOpenInvite(candidate)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Pair Up</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No Matching Cohort Buddies</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No students match your filter criteria. Try clearing the search query or changing the focus topic.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTopicFilter('all');
                  setAvailableOnly(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE COLLABORATIVE STUDY ROOM */}
      {activeTab === 'live_room' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {currentPairing ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Live Session Top Control Bar */}
              <div className="bg-slate-900 text-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
                {/* Paired Buddies info */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 shrink-0">
                    <img
                      src={activeStudent?.avatar}
                      alt={activeStudent?.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-slate-900"
                    />
                    <img
                      src={sessionPartner?.avatar}
                      alt={sessionPartner?.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-slate-900 ring-2 ring-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {sessionPartner?.name || 'Cohort Peer'} & You
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Live Session
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Topic: <strong className="text-white">{currentPairing.topicName}</strong> • {currentPairing.subtopicOrGoal || 'Problem Solving'}
                    </p>
                  </div>
                </div>

                {/* Pomodoro Timer and Session Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Co-Study Timer */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="font-mono text-sm font-bold">
                      {formatTimer(currentPairing.timerSecondsLeft)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStudyBuddySessionTimer(currentPairing.id)}
                      title={currentPairing.isTimerRunning ? 'Pause Timer' : 'Start Co-Study Timer'}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {currentPairing.isTimerRunning ? (
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => resetStudyBuddySessionTimer(currentPairing.id, 25)}
                      title="Reset to 25 mins"
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>

                  {/* End & Commend button */}
                  <button
                    onClick={() => setIsCompleteModalOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete & Commend</span>
                  </button>
                </div>
              </div>

              {/* Main Two-Column Collaborative Area */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                {/* LEFT: Collaborative Workspace (7 cols) */}
                <div className="lg:col-span-7 border-r border-slate-200 flex flex-col bg-slate-50">
                  {/* Workspace Nav Header */}
                  <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveWorkspaceTab('code')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          activeWorkspaceTab === 'code'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Shared Code Sandbox</span>
                      </button>

                      <button
                        onClick={() => setActiveWorkspaceTab('whiteboard')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          activeWorkspaceTab === 'whiteboard'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Concept Scratchpad & Invariants</span>
                      </button>

                      <button
                        onClick={() => setActiveWorkspaceTab('prompt')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          activeWorkspaceTab === 'prompt'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Problem Statement</span>
                      </button>
                    </div>

                    {/* Language & Actions */}
                    {activeWorkspaceTab === 'code' && (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value as any)}
                          className="text-xs bg-slate-100 border border-slate-300 rounded px-2 py-1 font-medium text-slate-700"
                        >
                          <option value="typescript">TypeScript</option>
                          <option value="python">Python 3</option>
                          <option value="cpp">C++ 20</option>
                        </select>

                        <button
                          onClick={handleRunCode}
                          disabled={isRunningCode}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isRunningCode ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3 fill-current" />
                          )}
                          <span>Run Code</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tab Body */}
                  <div className="flex-1 flex flex-col min-h-0 relative">
                    {/* CODE EDITOR TAB */}
                    {activeWorkspaceTab === 'code' && (
                      <div className="flex-1 flex flex-col bg-slate-950 font-mono text-xs text-slate-200 relative overflow-hidden">
                        <textarea
                          value={currentPairing.sharedCode || ''}
                          onChange={(e) =>
                            updateStudyBuddySessionWorkspace(currentPairing.id, {
                              sharedCode: e.target.value
                            })
                          }
                          className="w-full flex-1 p-4 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed resize-none focus:outline-hidden selection:bg-blue-600/40"
                          placeholder="// Type or paste shared solution code here..."
                          spellCheck={false}
                        />

                        {/* Interactive Console Drawer */}
                        {isConsoleOpen && (
                          <div className="border-t border-slate-800 bg-slate-900 p-3 max-h-48 overflow-y-auto">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                              <span className="flex items-center gap-1.5 text-blue-400">
                                <Terminal className="w-3.5 h-3.5" /> Live Test Console
                              </span>
                              <button
                                onClick={() => setIsConsoleOpen(false)}
                                className="text-slate-500 hover:text-slate-300 text-xs"
                              >
                                Minimize
                              </button>
                            </div>
                            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
                              {consoleOutput}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* WHITEBOARD & SCRATCHPAD TAB */}
                    {activeWorkspaceTab === 'whiteboard' && (
                      <div className="p-4 flex-1 flex flex-col bg-white">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                          <span className="text-xs font-semibold text-slate-500">Quick Insert:</span>
                          <button
                            type="button"
                            onClick={() => {
                              const noteTemplate =
                                (currentPairing.sessionNotes || '') +
                                `\n\n### Call Stack Trace Table:\n| Depth | Function Call | Arguments | Return Value |\n|---|---|---|---|\n| 1 | maxDepth(root) | node(3) | 3 |\n| 2 | maxDepth(left) | node(9) | 1 |\n| 2 | maxDepth(right) | node(20) | 2 |`;
                              updateStudyBuddySessionWorkspace(currentPairing.id, {
                                sessionNotes: noteTemplate
                              });
                            }}
                            className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
                          >
                            + Stack Frame Table
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const noteTemplate =
                                (currentPairing.sessionNotes || '') +
                                `\n\n### Invariant Checklist:\n- [ ] Base Condition handled: root == null\n- [ ] Subtree bounds propagated: min < val < max\n- [ ] No Integer Overflow in mid = low + (high - low) / 2`;
                              updateStudyBuddySessionWorkspace(currentPairing.id, {
                                sessionNotes: noteTemplate
                              });
                            }}
                            className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium"
                          >
                            + Invariant Checklist
                          </button>
                        </div>

                        <textarea
                          value={currentPairing.sessionNotes || ''}
                          onChange={(e) =>
                            updateStudyBuddySessionWorkspace(currentPairing.id, {
                              sessionNotes: e.target.value
                            })
                          }
                          className="w-full flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans leading-relaxed resize-none focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Jot down shared insights, dry runs, invariant checklists, or edge case ideas here..."
                        />
                      </div>
                    )}

                    {/* PROBLEM STATEMENT TAB */}
                    {activeWorkspaceTab === 'prompt' && (
                      <div className="p-5 flex-1 bg-white space-y-4 overflow-y-auto">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            Focus Challenge
                          </span>
                          <h3 className="text-lg font-bold text-slate-900">
                            {currentPairing.subtopicOrGoal || currentPairing.topicName}
                          </h3>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                          <p className="font-semibold text-slate-900">Problem Objective:</p>
                          <p>
                            Work together to decompose the recursive structure of the tree. When unwinding the call stack, ensure your helper function returns an accurate count without prematurely overwriting or discarding subtree depths.
                          </p>
                          <p className="font-semibold text-slate-900 pt-2">Recommended Pair Strategy:</p>
                          <ul className="list-disc pl-4 space-y-1 text-slate-600">
                            <li>Partner 1: Formulate the base case condition (null pointer defense).</li>
                            <li>Partner 2: Dry-run recursive traversal on left vs right children.</li>
                            <li>Both: Verify combined return formula Math.max(left, right) + 1.</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Co-Pilot Facilitator Strip */}
                  <div className="p-3 bg-indigo-50/70 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-medium">
                        <strong>Co-Study Facilitator: </strong>
                        Ask your partner: <em>"What is the exact return value of maxDepth when a leaf node reaches root.left == null?"</em>
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Live Peer Chat & Activity Stream (5 cols) */}
                <div className="lg:col-span-5 flex flex-col bg-white">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Study Buddy Chat Stream
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Syncing in real-time
                    </span>
                  </div>

                  {/* Chat message bubbles */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[360px] max-h-[460px]">
                    {currentPairing.chatMessages.map((msg) => {
                      const isMe = msg.senderId === activeStudent?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                            <span className="font-semibold text-slate-600">
                              {isMe ? 'You' : msg.senderName}
                            </span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>

                          <div
                            className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                              msg.type === 'high_five'
                                ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                                : isMe
                                ? 'bg-blue-600 text-white rounded-tr-xs shadow-2xs'
                                : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Reaction Chips */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSendQuickReaction('💡 Checked base condition: root === null returns 0!')}
                      className="text-[10px] px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                    >
                      💡 Check Base Case
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendQuickReaction('🔍 Traced stack frame: left depth = 1, right depth = 2')}
                      className="text-[10px] px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                    >
                      🔍 Trace Stack
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendQuickReaction('🙌 High Five! Great progress on this solution!', 'high_five')}
                      className="text-[10px] px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold transition-colors"
                    >
                      🙌 High Five!
                    </button>
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      placeholder={`Message ${sessionPartner?.name || 'partner'}...`}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="submit"
                      disabled={!chatInputText.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
              <Users className="w-12 h-12 text-blue-500 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No Active Study Session</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't paired up with a peer yet. Accept an incoming invite or select a cohort member to start your first session.
              </p>
              <button
                onClick={() => setActiveTab('finder')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Browse Cohort Buddies
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAIRING REQUESTS & HISTORY */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Incoming Requests Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Incoming Pairing Invitations
                </h3>
                <p className="text-xs text-slate-500">
                  Cohort peers wanting to collaborate on your broadcasted learning focus
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {incomingPairings.length} Pending
              </span>
            </div>

            {incomingPairings.length > 0 ? (
              <div className="space-y-3">
                {incomingPairings.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={p.studentAAvatar}
                        alt={p.studentAName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{p.studentAName}</span>
                          <span className="text-[11px] text-slate-500">• {p.studentAInstitution}</span>
                        </div>
                        <div className="text-xs text-slate-700 font-medium">
                          Focus: <span className="text-blue-600 font-semibold">{p.topicName}</span> ({p.mode.replace('_', ' ')})
                        </div>
                        <p className="text-xs text-slate-600 italic">"{p.message}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAcceptInvite(p.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Launch Room</span>
                      </button>
                      <button
                        onClick={() => respondToStudyBuddyRequest(p.id, 'declined')}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                No pending incoming invites right now. You can broadcast your focus or send an invite to any peer!
              </p>
            )}
          </div>

          {/* All Session History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Pairing Session Archive</h3>
                <p className="text-xs text-slate-500">Record of collaborative learning sessions and peer feedback</p>
              </div>
            </div>

            <div className="space-y-3">
              {studyBuddyPairings.map((pairing) => {
                const partnerName =
                  pairing.studentAId === activeStudent?.id
                    ? pairing.studentBName
                    : pairing.studentAName;
                const partnerAvatar =
                  pairing.studentAId === activeStudent?.id
                    ? pairing.studentBAvatar
                    : pairing.studentAAvatar;

                return (
                  <div
                    key={pairing.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={partnerAvatar}
                        alt={partnerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {partnerName} • <span className="text-blue-600">{pairing.topicName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Mode: {pairing.mode.replace('_', ' ')} • {new Date(pairing.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          pairing.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pairing.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : pairing.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {pairing.status}
                      </span>

                      {(pairing.status === 'accepted' || pairing.status === 'active') && (
                        <button
                          onClick={() => {
                            setActiveStudyBuddyPairingId(pairing.id);
                            setActiveTab('live_room');
                          }}
                          className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-semibold cursor-pointer"
                        >
                          Open Room
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: SEND STUDY BUDDY INVITATION */}
      {isInviteModalOpen && inviteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Send Study Buddy Invitation
                </h3>
                <p className="text-xs text-slate-500">
                  Invite {inviteCandidate.name} to pair up on {inviteCandidate.learningFocus?.topicName || 'DSA'}
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Candidate Summary Card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={inviteCandidate.avatar}
                alt={inviteCandidate.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{inviteCandidate.name}</div>
                <div className="text-slate-500">{inviteCandidate.institution}</div>
                <div className="text-blue-600 font-medium">
                  Current Focus: {inviteCandidate.learningFocus?.subtopicOrGoal}
                </div>
              </div>
            </div>

            {/* Collaboration Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Preferred Collaboration Mode</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'live_coding', label: 'Live Code Sandbox' },
                  { id: 'whiteboard', label: 'Concept Whiteboard' },
                  { id: 'mock_interview', label: 'Mock Peer Interview' },
                  { id: 'accountability', label: 'Pomodoro Co-Study' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setInviteMode(mode.id as any)}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                      inviteMode === mode.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Invitation Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Custom Invitation Message</label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="Write a quick note on what you would like to work on together..."
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT LEARNING FOCUS BROADCAST */}
      {isEditFocusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Learning Focus Broadcast
                </h3>
                <p className="text-xs text-slate-500">
                  Let peers know what you are currently mastering so the algorithm can match you effectively
                </p>
              </div>
              <button
                onClick={() => setIsEditFocusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                1-Click Topic Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STUDY_BUDDY_TOPIC_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                      focusTopicId === preset.id
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Focus Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Subtopic or Specific Learning Target</label>
              <input
                type="text"
                value={focusGoal}
                onChange={(e) => setFocusGoal(e.target.value)}
                placeholder="e.g. Call Stack Unwinding & Multi-Branch Tree Recursion"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Personal Notes / Questions for Peers */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Notes for Prospective Buddies</label>
              <textarea
                value={focusNotes}
                onChange={(e) => setFocusNotes(e.target.value)}
                rows={2}
                placeholder="What are you stuck on? What do you want to whiteboard together?"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Availability Radio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Cohort Availability Status</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'available_now', label: '🟢 Available Now', desc: 'Ready to pair right away' },
                  { id: 'open_to_pairing', label: '🟡 Open to Invites', desc: 'Accepting requests' },
                  { id: 'busy_focus_mode', label: '🔴 Solo Focus', desc: 'Do not disturb' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFocusAvailability(item.id as any)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      focusAvailability === item.id
                        ? 'border-blue-600 bg-blue-50 font-bold text-blue-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditFocusModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFocusBroadcast}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Broadcast to Cohort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: COMPLETE SESSION & COMMEND BUDDY */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-1">
              <Award className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                Complete Session & Commend Partner
              </h3>
              <p className="text-xs text-slate-500">
                Acknowledge your collaborative learning progress with {sessionPartner?.name || 'partner'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Commendation Note (Saved to Cohort History)</label>
              <textarea
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsCompleteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteSession}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Submit Commendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
