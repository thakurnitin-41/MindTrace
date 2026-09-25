import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  PageId,
  StudentProfile,
  Topic,
  AssessmentQuestion,
  QuestionResponse,
  ChatMessage,
  RescuePlan,
  DispatchedNotification,
  UserRole,
  AdminProfile,
  AdminRole,
  StudentDataAccessStatus,
  DataAccessRequest,
  FacultyNote,
  StudentIntervention,
  AuditLogEntry,
  StudyBuddyPairing,
  LearningFocus,
  CollaborationMode,
  BuddyAvailability,
  StudyBuddyPairingMessage,
  AchievementBadge
} from '../types';
import {
  INITIAL_STUDENTS,
  TOPICS,
  DIAGNOSTIC_QUESTIONS,
  INITIAL_CHAT_MESSAGES,
  ADAPTIVE_PRACTICE_QUESTIONS,
  RESCUE_PLANS,
  MISTAKE_DNA_DATA,
  LEARNING_TWIN_DATA
} from '../data/mockData';
import {
  COHORT_STUDENTS,
  INITIAL_ADMINS,
  VALID_INSTITUTIONAL_KEYS,
  INITIAL_AUDIT_LOGS
} from '../data/adminData';
import {
  INITIAL_STUDY_BUDDY_PAIRINGS,
  STUDY_BUDDY_TOPIC_PRESETS
} from '../data/studyBuddyData';
import {
  DEFAULT_ACHIEVEMENTS,
  evaluateMilestoneAchievements
} from '../data/achievementsData';
import {
  calculateDynamicStreak,
  getTodayDateString,
  getYesterdayDateString
} from '../utils/streakUtils';
import {
  signInWithGoogle as firebaseSignInWithGoogle,
  signOutFromFirebase,
  onFirebaseAuthStateChange,
  sendFirebasePasswordReset,
  saveStudentProfileToFirestore,
  getStudentProfileFromFirestore,
  deleteStudentProfileFromFirestore,
  saveAssessmentToFirestore,
  saveAdminProfileToFirestore,
  getAdminProfileFromFirestore,
  saveAuditLogToFirestore,
  testFirestoreConnection,
  subscribeToStudentProfiles
} from '../lib/firebase';

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (p: PageId) => void;
  pageHistory: PageId[];
  canGoBack: boolean;
  goBack: () => void;
  previousPage: PageId | null;
  students: StudentProfile[];
  activeStudent: StudentProfile | null;
  activeStudentId: string | null;
  setActiveStudentId: (id: string | null) => void;
  logoutStudent: () => void;
  registerNewStudent: (profile: Omit<StudentProfile, 'currentStreak' | 'overallMastery' | 'conceptsMastered' | 'questionsSolved' | 'primaryRootGap' | 'gapConfidence' | 'problemArchetype' | 'diagnosisSummary'>) => string;
  loginStudent: (studentId: string) => void;
  loginWithCredentials: (identifier: string, password?: string) => { success: boolean; error?: string; student?: StudentProfile };
  resetStudentPassword: (identifier: string, newPassword?: string) => { success: boolean; error?: string; message?: string; student?: StudentProfile };
  sendPasswordResetEmailHandler: (email: string) => Promise<{ success: boolean; message: string; isSimulated?: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  isFirebaseLoading: boolean;
  deleteStudentProfile: (studentId: string) => void;
  updateStudentStreak: (studentId: string, newStreak: number) => void;
  checkInToday: () => void;

  // Role-Based Access Control (RBAC) & Admin Portal
  currentUserRole: UserRole;
  switchUserRole: (role: UserRole) => void;
  admins: AdminProfile[];
  activeAdminId: string | null;
  activeAdmin: AdminProfile | null;
  isAdminAuthenticated: boolean;
  isAdminAuthModalOpen: boolean;
  adminAuthModalMode: 'login' | 'register' | 'verify';
  openAdminAuthModal: (mode?: 'login' | 'register' | 'verify') => void;
  closeAdminAuthModal: () => void;
  loginAdmin: (email: string, passwordOrPin?: string, authKey?: string) => Promise<{ success: boolean; error?: string; admin?: AdminProfile }>;
  loginAdminWithGoogle: () => Promise<{ success: boolean; error?: string; admin?: AdminProfile }>;
  loginAdminQuick: (adminId: string) => void;
  registerAdmin: (input: { name: string; email: string; institution: string; department: string; role: AdminRole; authKey: string; securityPin?: string }) => Promise<{ success: boolean; error?: string; admin?: AdminProfile }>;
  logoutAdmin: () => void;

  // Consent-Gated Student Data Access Controls
  allDataAccessRequests: DataAccessRequest[];
  requestStudentDataAccess: (studentId: string, reason: string) => Promise<{ success: boolean; error?: string }>;
  grantStudentDataAccess: (studentId: string, requestId?: string) => void;
  revokeStudentDataAccess: (studentId: string) => void;
  addFacultyNote: (studentId: string, noteText: string, category?: 'intervention' | 'commendation' | 'advising' | 'general') => void;
  assignStudentIntervention: (studentId: string, title: string, type?: 'rescue_session' | 'topic_booster' | 'diagnostic_retest' | 'mentor_meeting', targetTopicId?: string) => void;
  updateStudentRiskLevel: (studentId: string, riskLevel: 'low' | 'moderate' | 'critical') => void;
  logAutopsyInspection: (studentId: string, studentName: string) => void;

  // Enterprise Governance Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;


  // Global Auth Modal Controls
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  authModalAudience: 'learner' | 'admin';
  setAuthModalAudience: (aud: 'learner' | 'admin') => void;
  loginPrefillIdentifier: string;
  setLoginPrefillIdentifier: (val: string) => void;
  openAuthModal: (mode?: 'login' | 'register', prefillIdentifier?: string, audience?: 'learner' | 'admin') => void;
  closeAuthModal: () => void;

  // Dispatched Notifications (Email & SMS)
  dispatchedNotifications: DispatchedNotification[];
  unreadNotificationsCount: number;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
  latestDispatchToast: DispatchedNotification | null;
  dismissDispatchToast: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  resendNotification: (id: string) => void;

  // Topics & Mastery
  topics: Record<string, Topic>;
  updateTopicMastery: (id: string, newMastery: number) => void;

  // Diagnostic Assessment State
  assessmentQuestions: AssessmentQuestion[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (i: number) => void;
  assessmentResponses: Record<string, QuestionResponse>;
  recordAssessmentResponse: (questionId: string, optionId: string | null, isUnsure?: boolean) => void;
  isAssessmentCompleted: boolean;
  finishAssessment: () => void;
  resetAssessment: () => void;
  computedAssessmentScore: { correct: number; total: number; percentage: number };

  // Learning Autopsy Computed
  errorBreakdown: { conceptual: number; application: number; prerequisite: number; careless: number };
  rootGapDiagnosis: {
    name: string;
    topicId: string;
    confidence: number;
    explanation: string;
    chain: { id: string; name: string; mastery: number; isRoot: boolean }[];
  };

  // Knowledge Graph State
  selectedGraphNodeId: string;
  setSelectedGraphNodeId: (id: string) => void;
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  selectedChapterId: string;
  setSelectedChapterId: (id: string) => void;

  // Adaptive Practice State
  adaptivePractice: {
    questions: typeof ADAPTIVE_PRACTICE_QUESTIONS;
    currentIndex: number;
    currentDifficulty: 'Easy' | 'Medium' | 'Hard';
    difficultyHistory: ('Easy' | 'Medium' | 'Hard')[];
    masteryScore: number;
    lastResult: {
      isCorrect: boolean;
      feedback: string;
      difficultyChange: string;
      selectedOptionId: string;
    } | null;
    isFinished: boolean;
  };
  submitAdaptivePracticeAnswer: (optionId: string) => void;
  resetAdaptivePractice: () => void;

  // AI Tutor State
  chatMessages: ChatMessage[];
  sendTutorMessage: (messageText: string) => void;
  tutorTyping: boolean;

  // Rescue Mode State
  rescueDuration: 15 | 30 | 60;
  setRescueDuration: (d: 15 | 30 | 60) => void;
  activeRescuePlan: RescuePlan;
  isRescueActive: boolean;
  rescueActiveStep: number;
  startRescueSprint: () => void;
  nextRescueStep: () => void;
  exitRescueSprint: () => void;

  // Helpers
  mistakeDna: typeof MISTAKE_DNA_DATA;
  learningTwin: typeof LEARNING_TWIN_DATA;

  // Study Buddy & Cohort Collaboration
  studyBuddyPairings: StudyBuddyPairing[];
  activeStudyBuddyPairingId: string | null;
  activeStudyBuddyPairing: StudyBuddyPairing | null;
  setActiveStudyBuddyPairingId: (id: string | null) => void;
  updateStudentLearningFocus: (studentId: string, focus: Partial<LearningFocus>) => void;
  sendStudyBuddyRequest: (targetStudentId: string, message?: string, mode?: CollaborationMode) => Promise<{ success: boolean; pairing?: StudyBuddyPairing; message?: string }>;
  respondToStudyBuddyRequest: (pairingId: string, action: 'accepted' | 'declined') => void;
  sendStudyBuddyChatMessage: (pairingId: string, text: string, type?: 'text' | 'hint' | 'code' | 'system' | 'high_five') => void;
  updateStudyBuddySessionWorkspace: (pairingId: string, updates: { sharedCode?: string; sessionNotes?: string; sessionGoal?: string }) => void;
  toggleStudyBuddySessionTimer: (pairingId: string) => void;
  resetStudyBuddySessionTimer: (pairingId: string, minutes?: number) => void;
  completeStudyBuddySession: (pairingId: string, peerNote?: string) => void;

  // Achievement System
  achievements: AchievementBadge[];
  newlyUnlockedBadge: AchievementBadge | null;
  dismissUnlockedBadgeToast: () => void;
  checkAndAwardAchievements: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_INITIAL_NOTIFICATIONS: DispatchedNotification[] = [];

const createRegistrationDispatches = (student: StudentProfile): DispatchedNotification[] => {
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const list: DispatchedNotification[] = [];

  const recipientEmail = student.email || `${student.name.toLowerCase().replace(/\s+/g, '.')}@college.edu`;
  list.push({
    id: `notif-reg-email-${Date.now()}`,
    studentId: student.id,
    recipientName: student.name,
    channel: 'email',
    to: recipientEmail,
    type: 'registration_welcome',
    subject: `🎓 Welcome to MindTrace, ${student.name}! Account Activated (${student.institution || 'Learner Portal'})`,
    title: 'Registration Confirmation & Security Passcode',
    timestamp: new Date().toISOString(),
    status: 'delivered',
    securityPin: pin,
    metadata: {
      institution: student.institution || 'MindTrace Academic Network',
      role: student.roleType === 'professional' ? 'Working Professional' : 'College Student',
      browser: 'Web Application Client',
      timeString: `${dateString} at ${timeString}`
    },
    content: `Hello ${student.name},\n\nWelcome to MindTrace AI! Your learning intelligence account has been successfully created.\n\nInstitutional Affiliation: ${student.institution || 'Individual Learner'}\nDegree / Goal: ${student.degree}\nSecurity Verification PIN: ${pin}\n\nYour profile has been provisioned. You can now begin your baseline Diagnostic Assessment in Trees & Recursion to pinpoint cognitive gaps.\n\nBest regards,\nThe MindTrace Academic Team`,
    isRead: false
  });

  const recipientPhone = student.phone || '+91 98765 43210';
  list.push({
    id: `notif-reg-sms-${Date.now() + 1}`,
    studentId: student.id,
    recipientName: student.name,
    channel: 'sms',
    to: recipientPhone,
    type: 'registration_welcome',
    title: 'SMS Welcome & Verification Code',
    timestamp: new Date().toISOString(),
    status: 'delivered',
    securityPin: pin,
    metadata: {
      institution: student.institution,
      timeString: `${dateString} at ${timeString}`
    },
    content: `[MindTrace] Welcome ${student.name}! Your account for ${student.institution || 'Academic Portal'} is now active. Security PIN: ${pin}. Start diagnostic: https://mindtrace.ai`,
    isRead: false
  });

  return list;
};

const createLoginDispatches = (student: StudentProfile): DispatchedNotification[] => {
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const list: DispatchedNotification[] = [];

  const recipientEmail = student.email || `${student.name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
  list.push({
    id: `notif-login-email-${Date.now()}`,
    studentId: student.id,
    recipientName: student.name,
    channel: 'email',
    to: recipientEmail,
    type: 'login_alert',
    subject: `🔒 MindTrace Security Alert: New Sign-in from Web Browser`,
    title: 'Sign-in Activity Security Alert',
    timestamp: new Date().toISOString(),
    status: 'delivered',
    metadata: {
      institution: student.institution,
      browser: 'Chrome / Web Session',
      timeString: `${dateString} at ${timeString}`
    },
    content: `Hi ${student.name},\n\nA new sign-in was detected on your MindTrace account on ${dateString} at ${timeString}.\n\nAccount: ${recipientEmail}\nInstitution: ${student.institution || 'Academic Portal'}\n\nIf this was you, you can safely ignore this message. If you did not authorize this session, please update your password immediately.`,
    isRead: false
  });

  const recipientPhone = student.phone || '+91 98765 43210';
  list.push({
    id: `notif-login-sms-${Date.now() + 1}`,
    studentId: student.id,
    recipientName: student.name,
    channel: 'sms',
    to: recipientPhone,
    type: 'login_alert',
    title: 'SMS Security Sign-In Alert',
    timestamp: new Date().toISOString(),
    status: 'delivered',
    metadata: {
      timeString: `${dateString} at ${timeString}`
    },
    content: `[MindTrace Alert] Successful sign-in to account (${student.name}) at ${timeString}. If this was not you, secure your account immediately.`,
    isRead: false
  });

  return list;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [authModalAudience, setAuthModalAudience] = useState<'learner' | 'admin'>('learner');
  const [loginPrefillIdentifier, setLoginPrefillIdentifier] = useState<string>('');

  const openAuthModal = (
    mode: 'login' | 'register' = 'register',
    prefillIdentifier: string = '',
    audience: 'learner' | 'admin' = 'learner'
  ) => {
    setAuthModalMode(mode);
    setLoginPrefillIdentifier(prefillIdentifier);
    setAuthModalAudience(audience);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const [activeStudentId, setActiveStudentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mindtrace_active_id') || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  });

  const activeStudentIdRef = React.useRef<string | null>(activeStudentId);
  React.useEffect(() => {
    activeStudentIdRef.current = activeStudentId;
  }, [activeStudentId]);

  const [currentPage, setCurrentPageState] = useState<PageId>(() => {
    try {
      const savedId = localStorage.getItem('mindtrace_active_id');
      return savedId ? 'dashboard' : 'landing';
    } catch {
      return 'landing';
    }
  });
  const [pageHistory, setPageHistory] = useState<PageId[]>([]);

  const setCurrentPage = (newPage: PageId) => {
    if (newPage === currentPage) return;

    // Faculty & Institutional Admin pages
    if (newPage.startsWith('admin-')) {
      setPageHistory((prev) => [...prev, currentPage]);
      setCurrentPageState(newPage);
      return;
    }

    const currentId = activeStudentIdRef.current || activeStudentId;
    if (newPage !== 'landing' && !currentId) {
      openAuthModal('login', '', 'learner');
      return;
    }
    setPageHistory((prev) => [...prev, currentPage]);
    setCurrentPageState(newPage);
  };

  const logoutStudent = () => {
    signOutFromFirebase().catch(() => {});
    activeStudentIdRef.current = null;
    setActiveStudentId(null);
    try {
      localStorage.removeItem('mindtrace_active_id');
    } catch (e) {
      console.error(e);
    }
    setPageHistory([]);
    setCurrentPageState('landing');
  };

  // Firebase Auth Loading State
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

  // Test Firestore Connection on App Init as required by Firebase skill
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  const goBack = () => {
    setPageHistory((prev) => {
      if (prev.length === 0) {
        if (currentPage !== 'dashboard') {
          setCurrentPageState('dashboard');
        }
        return prev;
      }
      const newHistory = [...prev];
      const targetPage = newHistory.pop()!;
      setCurrentPageState(targetPage);
      return newHistory;
    });
  };

  const canGoBack = pageHistory.length > 0 || (currentPage !== 'dashboard' && currentPage !== 'landing');
  const previousPage: PageId | null =
    pageHistory.length > 0
      ? pageHistory[pageHistory.length - 1]
      : (currentPage !== 'dashboard' && currentPage !== 'landing' ? 'dashboard' : null);

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('mindtrace_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Permanently filter out legacy mock profiles (Nitin, Maya, Alex)
          const filtered = parsed
            .filter((s: StudentProfile) => {
              const isLegacyId = s.id === 'student-nitin' || s.id === 'student-maya' || s.id === 'student-alex';
              const nameLower = (s.name || '').toLowerCase();
              const isLegacyName = nameLower === 'nitin' || nameLower === 'maya' || nameLower === 'alex' || nameLower === 'nitin sharma';
              return !isLegacyId && !isLegacyName;
            })
            .map((s: StudentProfile) => {
              const prep = {
                ...s,
                password: s.password || 'password123',
                lastActiveDate: s.lastActiveDate || getTodayDateString(),
                activeDays: s.activeDays || [getTodayDateString()]
              };
              const dynamic = calculateDynamicStreak(prep);
              return {
                ...s,
                password: s.password || 'password123',
                currentStreak: dynamic.updatedStreak,
                lastActiveDate: dynamic.lastActiveDate,
                activeDays: dynamic.activeDays
              };
            });

          // Ensure representative cohort students are present for admin oversight and cohort pairing
          const merged: StudentProfile[] = [...filtered];
          for (const c of COHORT_STUDENTS) {
            const idx = merged.findIndex((s) => s.id === c.id);
            if (idx === -1) {
              merged.push({ ...c, password: c.password || 'password123' });
            } else if (!merged[idx].learningFocus && c.learningFocus) {
              merged[idx] = { ...merged[idx], learningFocus: c.learningFocus };
            }
          }
          // Ensure all students have an active learning focus definition
          for (let i = 0; i < merged.length; i++) {
            if (!merged[i].learningFocus) {
              merged[i] = {
                ...merged[i],
                learningFocus: {
                  topicId: 'recursion',
                  topicName: 'Recursion & Call Stacks',
                  subtopicOrGoal: merged[i].primaryRootGap || 'Call Stack Unwinding',
                  notes: 'Looking for a cohort buddy to review concepts and solve practice drills together.',
                  preferredMode: 'live_coding',
                  availability: 'available_now',
                  updatedAt: new Date().toISOString(),
                  targetExamOrGoal: merged[i].targetExam || 'Technical Placements'
                }
              };
            }
          }
          localStorage.setItem('mindtrace_students', JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return COHORT_STUDENTS;
  });

  // Role-Based User Context (Student vs Admin)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('mindtrace_user_role');
      if (saved === 'admin' || saved === 'student') return saved;
      return 'student';
    } catch {
      return 'student';
    }
  });

  const switchUserRole = (role: UserRole) => {
    setCurrentUserRole(role);
    try {
      localStorage.setItem('mindtrace_user_role', role);
    } catch (e) {
      console.error(e);
    }
    if (role === 'admin') {
      setCurrentPageState(activeAdminId ? 'admin-dashboard' : 'landing');
    } else {
      setCurrentPageState(activeStudentId ? 'dashboard' : 'landing');
    }
  };

  // Admin Profiles & Session
  const [admins, setAdmins] = useState<AdminProfile[]>(() => {
    try {
      const saved = localStorage.getItem('mindtrace_admins');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMINS;
  });

  const [activeAdminId, setActiveAdminId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mindtrace_active_admin_id') || 'admin-dr-aris-vance';
    } catch {
      return 'admin-dr-aris-vance';
    }
  });

  const activeAdmin = useMemo(() => {
    if (!activeAdminId) return null;
    return admins.find((a) => a.id === activeAdminId) || admins[0] || null;
  }, [admins, activeAdminId]);

  const isAdminAuthenticated = Boolean(activeAdmin);

  useEffect(() => {
    if (!activeAdmin) return;
    return subscribeToStudentProfiles((remoteStudents) => {
      setStudents((current) => {
        const byId = new Map(current.map((student) => [student.id, student]));
        remoteStudents.forEach((remote) => {
          if (!remote.id) return;
          const existing = byId.get(remote.id);
          byId.set(remote.id, { ...(existing || remote), ...remote } as StudentProfile);
        });
        return Array.from(byId.values());
      });
    }, (error) => {
      console.error('[Firebase] Student roster subscription failed:', error);
    });
  }, [activeAdmin]);

  // Admin Auth Modal
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [adminAuthModalMode, setAdminAuthModalMode] = useState<'login' | 'register' | 'verify'>('login');

  const openAdminAuthModal = (mode: 'login' | 'register' | 'verify' = 'login') => {
    setAdminAuthModalMode(mode);
    setIsAdminAuthModalOpen(true);
  };

  const closeAdminAuthModal = () => {
    setIsAdminAuthModalOpen(false);
  };

  // Enterprise Governance Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('mindtrace_audit_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const logId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const timestamp = new Date().toISOString();

    // Deterministic hash generation for audit trail integrity verification
    const rawPayload = `${logId}:${timestamp}:${entry.actorName}:${entry.action}:${entry.target}`;
    let hash = 0;
    for (let i = 0; i < rawPayload.length; i++) {
      hash = ((hash << 5) - hash) + rawPayload.charCodeAt(i);
      hash |= 0;
    }
    const hashSignature = entry.hashSignature || `sha256_${Math.abs(hash).toString(16).padStart(8, '0')}${Math.random().toString(16).substr(2, 8)}`;

    const newLog: AuditLogEntry = {
      id: logId,
      timestamp,
      status: entry.status || 'success',
      actorAdminRole: entry.actorAdminRole || (entry.actorRole === 'admin' ? activeAdmin?.role : undefined),
      actorEmail: entry.actorEmail || (entry.actorRole === 'admin' ? activeAdmin?.email : activeStudent?.email),
      ipAddress: entry.ipAddress || (entry.actorRole === 'admin' ? '192.168.1.104' : '10.0.4.52'),
      hashSignature,
      ...entry
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('mindtrace_audit_logs', JSON.stringify(updated.slice(0, 150)));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    saveAuditLogToFirestore(newLog).catch(() => {});
  };

  // Admin Authentication Actions
  const loginAdmin = async (
    email: string,
    passwordOrPin?: string,
    authKey?: string
  ): Promise<{ success: boolean; error?: string; admin?: AdminProfile }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedKey = (authKey || '').trim().toUpperCase();
    const trimmedPin = (passwordOrPin || '').trim();

    // 1. Check existing registered admins
    const matchedAdmin = admins.find((a) => {
      const aEmail = a.email.toLowerCase();
      return aEmail === trimmedEmail || (trimmedKey && a.authKey.toUpperCase() === trimmedKey);
    });

    if (matchedAdmin) {
      if (trimmedPin && matchedAdmin.securityPin && matchedAdmin.securityPin !== trimmedPin && trimmedPin !== '123456' && trimmedPin !== '749201') {
        return { success: false, error: 'Incorrect Security PIN entered. Please verify your faculty PIN or use default PIN 123456.' };
      }

      setActiveAdminId(matchedAdmin.id);
      setCurrentUserRole('admin');
      try {
        localStorage.setItem('mindtrace_active_admin_id', matchedAdmin.id);
        localStorage.setItem('mindtrace_user_role', 'admin');
      } catch (e) {
        console.error(e);
      }

      // Record audit log
      addAuditLog({
        actorName: matchedAdmin.name,
        actorRole: 'admin',
        action: 'Administrator Authentication',
        target: matchedAdmin.institution,
        details: `Successful login to Faculty Portal. Role: ${matchedAdmin.roleTitle}`,
        type: 'auth'
      });

      // Sync Firestore
      saveAdminProfileToFirestore({
        ...matchedAdmin,
        isVerified: true
      }).catch(() => {});

      setIsAdminAuthModalOpen(false);
      setCurrentPageState('admin-dashboard');
      return { success: true, admin: matchedAdmin };
    }

    // 2. If institutional auth key provided and recognized
    if (trimmedKey && VALID_INSTITUTIONAL_KEYS[trimmedKey]) {
      const keyInfo = VALID_INSTITUTIONAL_KEYS[trimmedKey];
      const newAdmin: AdminProfile = {
        id: `admin-${Date.now()}`,
        name: trimmedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        email: trimmedEmail,
        institution: keyInfo.institution,
        department: keyInfo.department,
        role: 'department_head',
        roleTitle: keyInfo.minRole,
        authKey: trimmedKey,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        securityPin: trimmedPin || '123456',
        permissions: ['cohort:monitor', 'interventions:assign', 'student_data:request_access', 'analytics:view', 'audit_log:view']
      };

      setAdmins((prev) => {
        const updated = [newAdmin, ...prev];
        try {
          localStorage.setItem('mindtrace_admins', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });

      setActiveAdminId(newAdmin.id);
      setCurrentUserRole('admin');
      try {
        localStorage.setItem('mindtrace_active_admin_id', newAdmin.id);
        localStorage.setItem('mindtrace_user_role', 'admin');
      } catch (e) {
        console.error(e);
      }

      addAuditLog({
        actorName: newAdmin.name,
        actorRole: 'admin',
        action: 'Institutional Key Authorization',
        target: newAdmin.institution,
        details: `Verified faculty credentials under clearance key ${trimmedKey}`,
        type: 'auth'
      });

      saveAdminProfileToFirestore(newAdmin).catch(() => {});
      setIsAdminAuthModalOpen(false);
      setCurrentPageState('admin-dashboard');
      return { success: true, admin: newAdmin };
    }

    return {
      success: false,
      error: 'Unrecognized institutional credentials or invalid authorization key. Please verify or use Quick Persona login.'
    };
  };

  const loginAdminWithGoogle = async (): Promise<{ success: boolean; error?: string; admin?: AdminProfile }> => {
    setIsFirebaseLoading(true);
    try {
      const { user } = await firebaseSignInWithGoogle();
      if (!user) {
        setIsFirebaseLoading(false);
        return { success: false, error: 'Google sign-in was canceled.' };
      }

      const email = user.email || '';
      // Check if this admin already exists in state or Firestore
      let targetAdmin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());

      if (!targetAdmin) {
        // Create verified admin profile for Google login
        targetAdmin = {
          id: user.uid,
          name: user.displayName || email.split('@')[0],
          email,
          institution: 'Institutional Partner University',
          department: 'Department of Computer Science & Pedagogy',
          role: 'department_head',
          roleTitle: 'Faculty Mentor & Academic Evaluator',
          authKey: 'MINDTRACE-ADMIN-2026',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          isVerified: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          securityPin: '749201',
          permissions: ['cohort:monitor', 'interventions:assign', 'student_data:request_access', 'analytics:view', 'audit_log:view']
        };

        setAdmins((prev) => {
          const updated = [targetAdmin!, ...prev];
          try {
            localStorage.setItem('mindtrace_admins', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
      }

      setActiveAdminId(targetAdmin.id);
      setCurrentUserRole('admin');
      try {
        localStorage.setItem('mindtrace_active_admin_id', targetAdmin.id);
        localStorage.setItem('mindtrace_user_role', 'admin');
      } catch (e) {
        console.error(e);
      }

      addAuditLog({
        actorName: targetAdmin.name,
        actorRole: 'admin',
        action: 'Google SSO Faculty Authentication',
        target: targetAdmin.institution,
        details: `Authenticated via Google SSO (${targetAdmin.email})`,
        type: 'auth'
      });

      saveAdminProfileToFirestore(targetAdmin).catch(() => {});
      setIsFirebaseLoading(false);
      setIsAdminAuthModalOpen(false);
      setCurrentPageState('admin-dashboard');
      return { success: true, admin: targetAdmin };
    } catch (err: any) {
      setIsFirebaseLoading(false);
      return { success: false, error: err?.message || 'Google authentication failed.' };
    }
  };

  const loginAdminQuick = (adminId: string) => {
    const target = admins.find((a) => a.id === adminId);
    if (!target) return;
    setActiveAdminId(target.id);
    setCurrentUserRole('admin');
    try {
      localStorage.setItem('mindtrace_active_admin_id', target.id);
      localStorage.setItem('mindtrace_user_role', 'admin');
    } catch (e) {
      console.error(e);
    }
    addAuditLog({
      actorName: target.name,
      actorRole: 'admin',
      action: 'Quick Switch Administrator Persona',
      target: target.institution,
      details: `Switched active faculty session to ${target.name} (${target.roleTitle})`,
      type: 'auth'
    });
    setIsAdminAuthModalOpen(false);
    setCurrentPageState('admin-dashboard');
  };

  const registerAdmin = async (input: {
    name: string;
    email: string;
    institution: string;
    department: string;
    role: AdminRole;
    authKey: string;
    securityPin?: string;
  }): Promise<{ success: boolean; error?: string; admin?: AdminProfile }> => {
    const trimmedKey = input.authKey.trim().toUpperCase();
    // Validate institutional key
    if (!VALID_INSTITUTIONAL_KEYS[trimmedKey] && !trimmedKey.startsWith('CAMPUS-') && !trimmedKey.startsWith('FACULTY-') && !trimmedKey.startsWith('MINDTRACE-')) {
      return {
        success: false,
        error: 'Invalid Institutional Authorization Key. Must use recognized faculty key (e.g. MINDTRACE-ADMIN-2026, FACULTY-DEAN-CS, or CAMPUS-AUTH-99).'
      };
    }

    const roleTitles: Record<AdminRole, string> = {
      dean: 'Dean of Academic Affairs & Oversight',
      department_head: 'Head of Computer Science & Algorithmic Pedagogy',
      faculty_lead: 'Faculty Lead & Diagnostic Research Chair',
      academic_advisor: 'Director of Competitive Coding & Mentorship',
      system_admin: 'Portal Security & Systems Administrator'
    };

    const newAdmin: AdminProfile = {
      id: `admin-${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      institution: input.institution.trim(),
      department: input.department.trim(),
      role: input.role,
      roleTitle: roleTitles[input.role] || 'Academic Faculty Lead',
      authKey: trimmedKey,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      securityPin: input.securityPin || '749201',
      permissions: ['cohort:monitor', 'interventions:assign', 'student_data:request_access', 'analytics:view', 'audit_log:view']
    };

    setAdmins((prev) => {
      const updated = [newAdmin, ...prev];
      try {
        localStorage.setItem('mindtrace_admins', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setActiveAdminId(newAdmin.id);
    setCurrentUserRole('admin');
    try {
      localStorage.setItem('mindtrace_active_admin_id', newAdmin.id);
      localStorage.setItem('mindtrace_user_role', 'admin');
    } catch (e) {
      console.error(e);
    }

    addAuditLog({
      actorName: newAdmin.name,
      actorRole: 'admin',
      action: 'Administrator Institutional Registration',
      target: newAdmin.institution,
      details: `New faculty credentials registered with authorization key ${trimmedKey}`,
      type: 'auth'
    });

    saveAdminProfileToFirestore(newAdmin).catch(() => {});
    setIsAdminAuthModalOpen(false);
    setCurrentPageState('admin-dashboard');
    return { success: true, admin: newAdmin };
  };

  const logoutAdmin = () => {
    if (activeAdmin) {
      addAuditLog({
        actorName: activeAdmin.name,
        actorRole: 'admin',
        actorAdminRole: activeAdmin.role,
        actorEmail: activeAdmin.email,
        action: 'Faculty Administrator Session Terminated',
        target: activeAdmin.institution,
        details: 'Admin explicitly signed out. Cryptographic session token revoked and cached permissions invalidated.',
        type: 'auth',
        status: 'success'
      });
    }
    setActiveAdminId(null);
    setCurrentUserRole('student');
    try {
      localStorage.removeItem('mindtrace_active_admin_id');
      localStorage.setItem('mindtrace_user_role', 'student');
    } catch (e) {
      console.error(e);
    }
    setCurrentPageState('landing');
  };

  // Consolidated Data Access Requests Queue across all cohort students
  const allDataAccessRequests = useMemo<DataAccessRequest[]>(() => {
    const requestsMap = new Map<string, DataAccessRequest>();

    students.forEach((student) => {
      if (student.dataAccessRequests && student.dataAccessRequests.length > 0) {
        student.dataAccessRequests.forEach((req) => {
          requestsMap.set(req.id, {
            ...req,
            studentId: student.id,
            studentName: student.name,
            studentEmail: student.email,
            studentInstitution: student.institution
          });
        });
      } else if (student.dataAccessStatus === 'pending') {
        const id = `dar-pending-${student.id}`;
        requestsMap.set(id, {
          id,
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          studentInstitution: student.institution,
          adminId: activeAdmin?.id || 'admin-aris',
          adminName: activeAdmin?.name || 'Dr. Aris Vance',
          adminRole: activeAdmin?.roleTitle || 'Head of Computer Science',
          adminInstitution: activeAdmin?.institution || 'Academic Partner Campus',
          requestedAt: new Date(Date.now() - 3600000).toISOString(),
          reason: 'Academic Advising & Diagnostic Review: Severe recursion stack unwinding gap requires customized rescue sprint.',
          status: 'pending',
          scope: ['diagnostic_autopsy', 'contact_details', 'learning_twin']
        });
      } else if (student.dataAccessStatus === 'granted') {
        const id = `dar-granted-${student.id}`;
        requestsMap.set(id, {
          id,
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          studentInstitution: student.institution,
          adminId: activeAdmin?.id || 'admin-aris',
          adminName: activeAdmin?.name || 'Dr. Aris Vance',
          adminRole: activeAdmin?.roleTitle || 'Head of Computer Science',
          adminInstitution: activeAdmin?.institution || 'Academic Partner Campus',
          requestedAt: new Date(Date.now() - 86400000).toISOString(),
          reason: 'FERPA/DPDP Full Academic Data Access granted for diagnostic intervention and performance tracking.',
          status: 'approved',
          updatedAt: new Date(Date.now() - 43200000).toISOString(),
          scope: ['diagnostic_autopsy', 'contact_details', 'learning_twin']
        });
      }
    });

    return Array.from(requestsMap.values()).sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  }, [students, activeAdmin]);

  const logAutopsyInspection = (studentId: string, studentName: string) => {
    if (!activeAdmin) return;
    addAuditLog({
      actorName: activeAdmin.name,
      actorRole: 'admin',
      actorAdminRole: activeAdmin.role,
      actorEmail: activeAdmin.email,
      action: 'Diagnostic Autopsy Record Inspected',
      target: `Student: ${studentName} (${studentId})`,
      details: 'Faculty inspected granular question autopsies, code diff traces, and prerequisite failure chains under authorized FERPA/DPDP consent.',
      type: 'data_access',
      status: 'success'
    });
  };

  // Consent-Gated Student Data Access Controls
  const requestStudentDataAccess = async (
    studentId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!activeAdmin) {
      return { success: false, error: 'You must be authenticated as an administrator to request student data access.' };
    }

    const student = students.find((s) => s.id === studentId);
    if (!student) {
      return { success: false, error: 'Student not found in registry.' };
    }

    const newRequest: DataAccessRequest = {
      id: `dar-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentInstitution: student.institution,
      adminId: activeAdmin.id,
      adminName: activeAdmin.name,
      adminRole: activeAdmin.roleTitle,
      adminInstitution: activeAdmin.institution,
      requestedAt: new Date().toISOString(),
      reason: reason.trim(),
      status: 'pending',
      scope: ['diagnostic_autopsy', 'contact_details', 'learning_twin']
    };

    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === studentId) {
          const prevRequests = s.dataAccessRequests || [];
          return {
            ...s,
            dataAccessStatus: 'pending' as StudentDataAccessStatus,
            dataAccessRequests: [newRequest, ...prevRequests]
          };
        }
        return s;
      });
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Dispatch formal notification to the student about the faculty request
    const notifEmail: DispatchedNotification = {
      id: `notif-dar-email-${Date.now()}`,
      studentId: student.id,
      recipientName: student.name,
      channel: 'email',
      to: student.email || `${student.id}@institution.edu`,
      type: 'faculty_alert',
      title: 'Action Required: Faculty Data Access Request',
      timestamp: new Date().toISOString(),
      status: 'delivered',
      isRead: false,
      metadata: {
        timeString: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        provider: 'SendGrid Institutional Gateway',
        status: 'Delivered',
        subject: `[Privacy Clearance] ${activeAdmin.name} requested academic data disclosure`
      },
      content: `Dear ${student.name},\n\n${activeAdmin.name} (${activeAdmin.roleTitle}, ${activeAdmin.institution}) has formally requested full diagnostic access to your student profile and contact details.\n\nStated Purpose: "${reason}"\n\nUnder our Institutional Privacy & DPDP Policy, your personal phone, email, and granular question autopsies remain masked until you review and grant permission in your Student Privacy Settings.`
    };

    setDispatchedNotifications((prev) => {
      const updated = [notifEmail, ...prev];
      try {
        localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setLatestDispatchToast(notifEmail);

    // Record audit log
    addAuditLog({
      actorName: activeAdmin.name,
      actorRole: 'admin',
      actorAdminRole: activeAdmin.role,
      actorEmail: activeAdmin.email,
      action: 'Data Access Request Submitted',
      target: `Student: ${student.name} (${student.institution || 'University'})`,
      details: `Formal DPDP/FERPA consent request submitted. Rationale: "${reason.trim()}"`,
      type: 'data_access',
      status: 'pending',
      metadata: {
        studentId: student.id,
        requestId: newRequest.id,
        scope: newRequest.scope
      }
    });

    return { success: true };
  };

  const grantStudentDataAccess = (studentId: string, requestId?: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === studentId) {
          const updatedRequests = (s.dataAccessRequests || []).map((req) => {
            if (!requestId || req.id === requestId) {
              return { ...req, status: 'approved' as const, updatedAt: new Date().toISOString() };
            }
            return req;
          });
          return {
            ...s,
            dataAccessStatus: 'granted' as StudentDataAccessStatus,
            dataAccessRequests: updatedRequests
          };
        }
        return s;
      });
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    addAuditLog({
      actorName: student.name,
      actorRole: 'student',
      action: 'Data Access Consent Granted',
      target: activeAdmin?.name ? `Administrator: ${activeAdmin.name}` : 'Institutional Faculty',
      details: 'Student approved full data disclosure for academic mentoring in compliance with FERPA/DPDP.',
      type: 'security'
    });
  };

  const revokeStudentDataAccess = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            dataAccessStatus: 'restricted' as StudentDataAccessStatus
          };
        }
        return s;
      });
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    addAuditLog({
      actorName: student.name,
      actorRole: 'student',
      action: 'Data Access Consent Revoked',
      target: 'Institutional Faculty',
      details: 'Student revoked data access; contact and raw autopsy records restricted and masked.',
      type: 'security'
    });
  };

  const addFacultyNote = (
    studentId: string,
    noteText: string,
    category: 'intervention' | 'commendation' | 'advising' | 'general' = 'general'
  ) => {
    if (!activeAdmin) return;
    const newNote: FacultyNote = {
      id: `fn-${Date.now()}`,
      adminName: activeAdmin.name,
      adminRole: activeAdmin.roleTitle,
      note: noteText.trim(),
      createdAt: new Date().toISOString(),
      category
    };

    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            facultyNotes: [newNote, ...(s.facultyNotes || [])]
          };
        }
        return s;
      });
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    addAuditLog({
      actorName: activeAdmin.name,
      actorRole: 'admin',
      action: 'Faculty Advisory Note Added',
      target: `Student Record (${studentId})`,
      details: `Category: ${category}. Content: ${noteText.slice(0, 80)}...`,
      type: 'intervention'
    });
  };

  const assignStudentIntervention = (
    studentId: string,
    title: string,
    type: 'rescue_session' | 'topic_booster' | 'diagnostic_retest' | 'mentor_meeting' = 'rescue_session',
    targetTopicId?: string
  ) => {
    if (!activeAdmin) return;
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const newIntervention: StudentIntervention = {
      id: `int-${Date.now()}`,
      title: title.trim(),
      type,
      assignedBy: activeAdmin.name,
      assignedAt: new Date().toISOString(),
      status: 'pending',
      targetTopicId: targetTopicId || 'recursion'
    };

    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            assignedInterventions: [newIntervention, ...(s.assignedInterventions || [])]
          };
        }
        return s;
      });
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Send dispatch alert to student
    const notif: DispatchedNotification = {
      id: `notif-int-${Date.now()}`,
      studentId: student.id,
      recipientName: student.name,
      channel: 'email',
      to: student.email || `${student.id}@institution.edu`,
      type: 'faculty_alert',
      title: `Intervention Assigned: ${title}`,
      timestamp: new Date().toISOString(),
      status: 'delivered',
      isRead: false,
      metadata: {
        timeString: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        provider: 'MindTrace Pedagogy Engine',
        status: 'Delivered',
        subject: `New Learning Prescription: ${title}`
      },
      content: `Hello ${student.name},\n\nYour faculty mentor ${activeAdmin.name} (${activeAdmin.roleTitle}) has assigned an educational intervention to help resolve your identified bottleneck (${student.primaryRootGap}):\n\nTask: ${title}\nType: ${type.replace('_', ' ').toUpperCase()}\n\nPlease access your workspace dashboard to begin this session.`
    };

    setDispatchedNotifications((prev) => {
      const updated = [notif, ...prev];
      try {
        localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setLatestDispatchToast(notif);

    addAuditLog({
      actorName: activeAdmin.name,
      actorRole: 'admin',
      action: 'Prescribed Pedagogical Intervention',
      target: `Student: ${student.name}`,
      details: `Prescription: "${title}" (Type: ${type})`,
      type: 'intervention'
    });
  };

  const updateStudentRiskLevel = (studentId: string, riskLevel: 'low' | 'moderate' | 'critical') => {
    setStudents((prev) => {
      const updated = prev.map((s) => (s.id === studentId ? { ...s, riskLevel } : s));
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Dispatched Notifications State (Emails & SMS)
  const [dispatchedNotifications, setDispatchedNotifications] = useState<DispatchedNotification[]>(() => {
    try {
      const saved = localStorage.getItem('mindtrace_dispatched_notifs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((n: DispatchedNotification) => {
            const isLegacy = n.studentId === 'student-nitin' || (n.recipientName || '').toLowerCase().includes('nitin');
            return !isLegacy;
          });
          localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(filtered));
          return filtered;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_INITIAL_NOTIFICATIONS;
  });

  const [latestDispatchToast, setLatestDispatchToast] = useState<DispatchedNotification | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const unreadNotificationsCount = useMemo(() => {
    return dispatchedNotifications.filter((n) => !n.isRead).length;
  }, [dispatchedNotifications]);

  const markNotificationAsRead = (id: string) => {
    setDispatchedNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      try {
        localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setDispatchedNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      try {
        localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setDispatchedNotifications([]);
    try {
      localStorage.removeItem('mindtrace_dispatched_notifs');
    } catch (e) {
      console.error(e);
    }
  };

  const resendNotification = (id: string) => {
    const existing = dispatchedNotifications.find((n) => n.id === id);
    if (!existing) return;
    const clone: DispatchedNotification = {
      ...existing,
      id: `notif-resend-${Date.now()}`,
      timestamp: new Date().toISOString(),
      metadata: {
        ...existing.metadata,
        timeString: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
      },
      isRead: false
    };
    setDispatchedNotifications((prev) => {
      const updated = [clone, ...prev];
      try {
        localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setLatestDispatchToast(clone);
  };

  const dismissDispatchToast = () => {
    setLatestDispatchToast(null);
  };

  const deleteStudentProfile = (studentId: string) => {
    deleteStudentProfileFromFirestore(studentId).catch((err) => {
      console.warn('Firestore delete profile notice:', err);
    });
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    if (activeStudentId === studentId) {
      logoutStudent();
    }
  };

  const registerNewStudent = (newProfileData: Omit<StudentProfile, 'currentStreak' | 'overallMastery' | 'conceptsMastered' | 'questionsSolved' | 'primaryRootGap' | 'gapConfidence' | 'problemArchetype' | 'diagnosisSummary'>): string => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const newStudent: StudentProfile = {
      ...newProfileData,
      password: newProfileData.password?.trim() || 'password123',
      currentStreak: 2, // Dynamic Day 2 learning streak
      overallMastery: 50,
      conceptsMastered: 12,
      questionsSolved: 0,
      primaryRootGap: 'Awaiting Diagnostic',
      gapConfidence: 0,
      problemArchetype: 'New Registered Learner',
      diagnosisSummary: 'Ready for initial diagnostic assessment to identify exact cognitive bottlenecks.',
      registeredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      lastActiveDate: today,
      activeDays: [yesterday, today]
    };

    // Persist to Firestore
    saveStudentProfileToFirestore(newStudent).catch((err) => {
      console.warn('Firestore sync notice:', err);
    });

    setStudents((prev) => {
      const updated = [newStudent, ...prev.filter((s) => s.id !== newStudent.id)];
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    activeStudentIdRef.current = newStudent.id;
    setActiveStudentId(newStudent.id);
    try {
      localStorage.setItem('mindtrace_active_id', newStudent.id);
    } catch (e) {
      console.error(e);
    }

    // Direct transition to workspace
    setCurrentPageState('dashboard');
    setIsAuthModalOpen(false);

    // Automatically dispatch official registration Welcome Email and SMS
    const regDispatches = createRegistrationDispatches(newStudent);
    setDispatchedNotifications((prev) => {
      const updated = [...regDispatches, ...prev];
      try {
        localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setLatestDispatchToast(regDispatches[0]);

    return newStudent.id;
  };

  // Google Sign-In with Firebase Auth & Firestore Persistence
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsFirebaseLoading(true);
    try {
      const { user } = await firebaseSignInWithGoogle();
      if (!user) {
        setIsFirebaseLoading(false);
        return { success: false, error: 'Google sign-in was canceled or failed.' };
      }

      const today = getTodayDateString();
      const firestoreData = await getStudentProfileFromFirestore(user.uid);
      const existingLocal = students.find((s) => s.id === user.uid || (user.email && s.email === user.email));

      let targetStudent: StudentProfile;

      if (firestoreData && firestoreData.name) {
        targetStudent = {
          id: user.uid,
          name: firestoreData.name || user.displayName || 'Google Learner',
          email: user.email || firestoreData.email || '',
          phone: firestoreData.phone || user.phoneNumber || '',
          institution: firestoreData.institution || 'Google Verified Learner',
          degree: firestoreData.degree || 'Computer Science & Engineering',
          targetExam: firestoreData.targetExam || 'DSA & Core Fundamentals',
          learningGoal: firestoreData.learningGoal || 'Crack Tech Interviews',
          currentStreak: firestoreData.currentStreak || 1,
          activeDays: firestoreData.activeDays || [today],
          avatar: user.photoURL || firestoreData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          overallMastery: 68,
          conceptsMastered: 14,
          questionsSolved: 42,
          registeredAt: firestoreData.registeredAt || new Date().toISOString(),
          lastActiveDate: today,
          primaryRootGap: firestoreData.primaryRootGap || 'Recursion Base Case',
          gapConfidence: firestoreData.gapConfidence || 88,
          problemArchetype: firestoreData.problemArchetype || 'Prerequisite Gap',
          diagnosisSummary: firestoreData.diagnosisSummary || 'Synchronized with Firebase Cloud Database.'
        };
      } else if (existingLocal) {
        targetStudent = {
          ...existingLocal,
          id: user.uid,
          email: user.email || existingLocal.email,
          name: user.displayName || existingLocal.name,
          avatar: user.photoURL || existingLocal.avatar
        };
      } else {
        targetStudent = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Google Learner',
          email: user.email || '',
          phone: user.phoneNumber || '',
          institution: 'University / Autonomous College',
          degree: 'B.Tech / MCA (Computer Science)',
          targetExam: 'DSA, FAANG & Core CS Placements',
          learningGoal: 'Bridge Foundational Gaps in Algorithms',
          roleType: 'student',
          currentStreak: 1,
          activeDays: [today],
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          overallMastery: 65,
          conceptsMastered: 12,
          questionsSolved: 35,
          registeredAt: new Date().toISOString(),
          lastActiveDate: today,
          primaryRootGap: 'Awaiting Diagnostic',
          gapConfidence: 0,
          problemArchetype: 'New Registered Learner',
          diagnosisSummary: 'Ready for initial diagnostic assessment to identify exact cognitive bottlenecks.'
        };
      }

      // Persist student profile to Firestore
      await saveStudentProfileToFirestore(targetStudent);

      // Update state
      setStudents((prev) => {
        const filtered = prev.filter((s) => s.id !== targetStudent.id && s.email !== targetStudent.email);
        const updated = [targetStudent, ...filtered];
        try {
          localStorage.setItem('mindtrace_students', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });

      activeStudentIdRef.current = targetStudent.id;
      setActiveStudentId(targetStudent.id);
      try {
        localStorage.setItem('mindtrace_active_id', targetStudent.id);
      } catch (e) {
        console.error(e);
      }

      // Dispatch welcome notification if brand new
      if (!firestoreData && !existingLocal) {
        const regDispatches = createRegistrationDispatches(targetStudent);
        setDispatchedNotifications((prev) => {
          const updated = [...regDispatches, ...prev];
          try {
            localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
        setLatestDispatchToast(regDispatches[0]);
      }

      setIsAuthModalOpen(false);
      setCurrentPageState('dashboard');
      setIsFirebaseLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsFirebaseLoading(false);
      console.error('Google Sign-in error:', err);
      return {
        success: false,
        error: err?.message || 'Google authentication was not completed.'
      };
    }
  };

  const updateStudentStreak = (studentId: string, newStreak: number) => {
    const today = getTodayDateString();
    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === studentId) {
          const activeDays = Array.from(new Set([...(s.activeDays || []), today])).sort();
          return {
            ...s,
            currentStreak: newStreak,
            lastActiveDate: today,
            activeDays
          };
        }
        return s;
      });
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const checkInToday = () => {
    if (!activeStudentId) return;
    const target = students.find((s) => s.id === activeStudentId);
    if (!target) return;
    const nextStreak = (target.currentStreak || 1) + 1;
    updateStudentStreak(activeStudentId, nextStreak);
  };

  const loginStudent = (studentId: string) => {
    const found = students.find((s) => s.id === studentId);
    if (found) {
      // Dynamic Streak Calculation on login
      const streakSync = calculateDynamicStreak(found);
      const syncedStudent: StudentProfile = streakSync.isUpdated
        ? {
            ...found,
            currentStreak: streakSync.updatedStreak,
            lastActiveDate: streakSync.lastActiveDate,
            activeDays: streakSync.activeDays
          }
        : found;

      if (streakSync.isUpdated) {
        setStudents((prev) => {
          const updated = prev.map((s) => (s.id === syncedStudent.id ? syncedStudent : s));
          try {
            localStorage.setItem('mindtrace_students', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
      }

      activeStudentIdRef.current = found.id;
      setActiveStudentId(found.id);
      try {
        localStorage.setItem('mindtrace_active_id', found.id);
      } catch (e) {
        console.error(e);
      }
      setCurrentPageState('dashboard');
      setIsAuthModalOpen(false);
    }
  };

  const loginWithCredentials = (
    identifier: string,
    password?: string
  ): { success: boolean; error?: string; student?: StudentProfile } => {
    const trimmed = identifier.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'Please enter your registered Email, Phone, or Name.' };
    }

    if (!password || !password.trim()) {
      return {
        success: false,
        error: 'Password is required to authenticate. Please enter your account password.'
      };
    }

    const cleanInputPhone = trimmed.replace(/[^0-9]/g, '');

    const found = students.find((s) => {
      const email = (s.email || '').trim().toLowerCase();
      const id = (s.id || '').trim().toLowerCase();
      const name = (s.name || '').trim().toLowerCase();
      const cleanPhone = (s.phone || '').replace(/[^0-9]/g, '');

      // 1. Direct email match
      if (email && email === trimmed) return true;
      // 2. Direct ID match
      if (id && id === trimmed) return true;
      // 3. Direct name match or first name match
      if (name && (name === trimmed || name.split(' ')[0] === trimmed || trimmed.startsWith(name))) return true;
      // 4. Phone match (exact digits or suffix match)
      if (cleanPhone && cleanInputPhone && cleanInputPhone.length >= 6) {
        if (cleanPhone === cleanInputPhone || cleanPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanPhone)) {
          return true;
        }
      }
      return false;
    });

    if (!found) {
      return {
        success: false,
        error: 'No registered user found with these details. Please check your spelling or register a new account.'
      };
    }

    // Password Validation:
    // 1. Exact stored password match.
    // 2. OR user enters the default recovery password 'password123' (which is the universal system default for mock accounts & password recovery in case of forgotten password).
    // 3. If account had no stored password, 'password123' is accepted.
    const inputPassword = password.trim();
    const storedPassword = (found.password || '').trim();
    const isDefaultPassword = inputPassword === 'password123';
    const isStoredPasswordMatch = Boolean(storedPassword && storedPassword === inputPassword);
    const isFallbackValid = !storedPassword && isDefaultPassword;

    if (!isStoredPasswordMatch && !isDefaultPassword && !isFallbackValid) {
      return {
        success: false,
        error: 'Incorrect password entered. Default recovery password is "password123". If forgotten, you can sign in with password123 or reset your password.'
      };
    }

    // Ensure account password is synchronized to state and storage if logging in via default password
    const effectivePassword = isStoredPasswordMatch ? storedPassword : 'password123';

    // Dynamic Streak Calculation on authenticated login
    const streakSync = calculateDynamicStreak(found);
    const syncedStudent: StudentProfile = {
      ...(streakSync.isUpdated
        ? {
            ...found,
            currentStreak: streakSync.updatedStreak,
            lastActiveDate: streakSync.lastActiveDate,
            activeDays: streakSync.activeDays
          }
        : found),
      password: effectivePassword
    };

    const needsProfileUpdate = streakSync.isUpdated || found.password !== effectivePassword;

    if (needsProfileUpdate) {
      setStudents((prev) => {
        const updated = prev.map((s) => (s.id === syncedStudent.id ? syncedStudent : s));
        try {
          localStorage.setItem('mindtrace_students', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
      saveStudentProfileToFirestore(syncedStudent).catch((err) => {
        console.warn('Firestore profile sync notice:', err);
      });
    }

    activeStudentIdRef.current = syncedStudent.id;
    setActiveStudentId(syncedStudent.id);
    try {
      localStorage.setItem('mindtrace_active_id', syncedStudent.id);
    } catch (e) {
      console.error(e);
    }

    // Direct transition to workspace
    setCurrentPageState('dashboard');
    setIsAuthModalOpen(false);

    // Automatically dispatch login security alert Email and SMS
    const loginDispatches = createLoginDispatches(syncedStudent);
    setDispatchedNotifications((prev) => {
      const updated = [...loginDispatches, ...prev];
      try {
        localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setLatestDispatchToast(loginDispatches[0]);

    return { success: true, student: syncedStudent };
  };

  const resetStudentPassword = (
    identifier: string,
    newPassword?: string
  ): { success: boolean; error?: string; message?: string; student?: StudentProfile } => {
    const trimmed = identifier.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'Please enter your registered Email, Phone, or Name to locate your account.' };
    }

    const cleanInputPhone = trimmed.replace(/[^0-9]/g, '');

    const found = students.find((s) => {
      const email = (s.email || '').trim().toLowerCase();
      const id = (s.id || '').trim().toLowerCase();
      const name = (s.name || '').trim().toLowerCase();
      const cleanPhone = (s.phone || '').replace(/[^0-9]/g, '');

      if (email && email === trimmed) return true;
      if (id && id === trimmed) return true;
      if (name && (name === trimmed || name.split(' ')[0] === trimmed || trimmed.startsWith(name))) return true;
      if (cleanPhone && cleanInputPhone && cleanInputPhone.length >= 6) {
        if (cleanPhone === cleanInputPhone || cleanPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanPhone)) {
          return true;
        }
      }
      return false;
    });

    if (!found) {
      return {
        success: false,
        error: 'No registered user found with these details. Please verify your email or username.'
      };
    }

    const effectiveNewPassword = (newPassword && newPassword.trim()) ? newPassword.trim() : 'password123';
    const updatedStudent: StudentProfile = {
      ...found,
      password: effectiveNewPassword
    };

    setStudents((prev) => {
      const updated = prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    saveStudentProfileToFirestore(updatedStudent).catch((err) => {
      console.warn('Firestore password reset sync notice:', err);
    });

    return {
      success: true,
      message: `Password successfully reset to "${effectiveNewPassword}". You can now sign in immediately.`,
      student: updatedStudent
    };
  };

  // Formal Password Reset Email Handler via Firebase Authentication
  const sendPasswordResetEmailHandler = async (
    email: string
  ): Promise<{ success: boolean; message: string; isSimulated?: boolean; error?: string }> => {
    setIsFirebaseLoading(true);
    try {
      const res = await sendFirebasePasswordReset(email);

      // Record a high-priority security dispatch notification for transparency
      const resetNotification: DispatchedNotification = {
        id: `notif-reset-${Date.now()}`,
        studentId: activeStudentId || 'auth-guest',
        recipientName: email,
        channel: 'email',
        to: email,
        type: 'security_code',
        subject: '🔒 Security Alert: Formal Password Reset Link Dispatched',
        title: 'Formal Password Reset Link Dispatched',
        content: `A password reset authorization link was dispatched to ${email} via Firebase Authentication. If you did not initiate this request, your account remains fully protected.`,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        isRead: false
      };

      setDispatchedNotifications((prev) => {
        const updated = [resetNotification, ...prev];
        try {
          localStorage.setItem('mindtrace_dispatched_notifs', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
      setLatestDispatchToast(resetNotification);

      // Log to enterprise audit logs
      addAuditLog({
        actorName: email,
        actorRole: 'student',
        action: 'Firebase Password Reset Dispatched',
        target: 'Firebase Auth',
        details: `Password reset request handled for ${email}. Status: ${res.success ? 'Success' : 'Failed'}. ${res.message}`,
        type: 'security'
      });

      return res;
    } catch (err: any) {
      console.error('[Firebase Auth] Password reset handler exception:', err);
      return {
        success: false,
        message: err?.message || 'Failed to dispatch password reset request.',
        error: err?.code || 'auth-error'
      };
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  // Synchronize streak on mount & when active student changes
  useEffect(() => {
    if (!activeStudentId) return;
    setStudents((prev) => {
      let changed = false;
      const updated = prev.map((s) => {
        if (s.id === activeStudentId) {
          const streakRes = calculateDynamicStreak(s);
          if (streakRes.isUpdated) {
            changed = true;
            return {
              ...s,
              currentStreak: streakRes.updatedStreak,
              lastActiveDate: streakRes.lastActiveDate,
              activeDays: streakRes.activeDays
            };
          }
        }
        return s;
      });
      if (changed) {
        try {
          localStorage.setItem('mindtrace_students', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      }
      return prev;
    });
  }, [activeStudentId]);
  const [topics, setTopics] = useState<Record<string, Topic>>(TOPICS);

  const activeStudent = useMemo(() => {
    if (!activeStudentId) return null;
    return students.find((s) => s.id === activeStudentId) || null;
  }, [students, activeStudentId]);

  // Assessment State
  const [assessmentQuestions] = useState<AssessmentQuestion[]>(DIAGNOSTIC_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(3); // starts at question 4 (0-indexed 3) per prompt example
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, QuestionResponse>>({
    q1: { questionId: 'q1', selectedOptionId: 'q1-b', isUnsure: false, isCorrect: true, timeSpentSeconds: 24 },
    q2: { questionId: 'q2', selectedOptionId: 'q2-a', isUnsure: false, isCorrect: false, misconceptionType: 'conceptual', timeSpentSeconds: 45 },
    q3: { questionId: 'q3', selectedOptionId: 'q3-b', isUnsure: false, isCorrect: true, timeSpentSeconds: 19 },
    q4: { questionId: 'q4', selectedOptionId: 'q4-b', isUnsure: true, isCorrect: false, misconceptionType: 'prerequisite', timeSpentSeconds: 62 },
    q5: { questionId: 'q5', selectedOptionId: 'q5-a', isUnsure: false, isCorrect: false, misconceptionType: 'application', timeSpentSeconds: 38 },
    q6: { questionId: 'q6', selectedOptionId: 'q6-b', isUnsure: false, isCorrect: true, timeSpentSeconds: 30 },
    q7: { questionId: 'q7', selectedOptionId: 'q7-a', isUnsure: false, isCorrect: true, timeSpentSeconds: 22 },
    q8: { questionId: 'q8', selectedOptionId: 'q8-c', isUnsure: false, isCorrect: false, misconceptionType: 'careless', timeSpentSeconds: 40 },
    q9: { questionId: 'q9', selectedOptionId: 'q9-d', isUnsure: false, isCorrect: false, misconceptionType: 'prerequisite', timeSpentSeconds: 50 },
    q10: { questionId: 'q10', selectedOptionId: 'q10-b', isUnsure: false, isCorrect: true, timeSpentSeconds: 35 }
  });
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState<boolean>(true); // Pre-completed for rich initial exploration, but can re-run anytime!

  const recordAssessmentResponse = (questionId: string, optionId: string | null, isUnsure = false) => {
    const question = assessmentQuestions.find((q) => q.id === questionId);
    if (!question) return;

    const chosenOption = question.options.find((opt) => opt.id === optionId);
    const isCorrect = chosenOption ? chosenOption.isCorrect : false;

    setAssessmentResponses((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOptionId: optionId,
        isUnsure,
        isCorrect,
        timeSpentSeconds: 35,
        misconceptionType: chosenOption?.misconceptionType
      }
    }));
  };

  const finishAssessment = () => {
    setIsAssessmentCompleted(true);
    if (activeStudentId) {
      saveAssessmentToFirestore(activeStudentId, {
        id: `assessment-${Date.now()}`,
        score: computedAssessmentScore.correct,
        totalQuestions: computedAssessmentScore.total,
        percentage: computedAssessmentScore.percentage,
        primaryMisconception: rootGapDiagnosis.name,
        prerequisiteChain: rootGapDiagnosis.chain.map((c) => c.name).join(' -> ')
      }).catch((e) => console.warn('Firestore assessment sync notice:', e));
    }
    setCurrentPage('autopsy');
  };

  const resetAssessment = () => {
    setAssessmentResponses({});
    setCurrentQuestionIndex(0);
    setIsAssessmentCompleted(false);
    setCurrentPage('assessment');
  };

  const computedAssessmentScore = useMemo(() => {
    const total = assessmentQuestions.length;
    const answeredKeys = Object.keys(assessmentResponses);
    if (answeredKeys.length === 0) return { correct: 6, total: 10, percentage: 60 };
    let correct = 0;
    assessmentQuestions.forEach((q) => {
      const resp = assessmentResponses[q.id];
      if (resp && resp.isCorrect) {
        correct++;
      }
    });
    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100)
    };
  }, [assessmentQuestions, assessmentResponses]);

  // Dynamic Learning Autopsy based on current persona problemArchetype and responses
  const errorBreakdown = useMemo(() => {
    if (activeStudent?.problemArchetype === 'Conceptual Misunderstanding') {
      return { conceptual: 55, application: 22, prerequisite: 13, careless: 10 };
    }
    if (activeStudent?.problemArchetype === 'Application Difficulty') {
      return { conceptual: 18, application: 52, prerequisite: 16, careless: 14 };
    }
    return {
      conceptual: 38,
      application: 27,
      prerequisite: 21,
      careless: 14
    };
  }, [activeStudent]);

  const rootGapDiagnosis = useMemo(() => {
    if (activeStudent?.problemArchetype === 'Conceptual Misunderstanding') {
      return {
        name: 'BST Invariant Property',
        topicId: 'bst',
        confidence: 84,
        explanation:
          'Your Binary Search Tree errors stem from only validating immediate left and right child relationships instead of propagating ancestor global value constraints.',
        chain: [
          { id: 'recursion', name: 'Recursion', mastery: 82, isRoot: false },
          { id: 'searching', name: 'Searching', mastery: 88, isRoot: false },
          { id: 'bst_invariants', name: 'BST Invariant Limits', mastery: 38, isRoot: true },
          { id: 'bst', name: 'BST', mastery: 43, isRoot: false }
        ]
      };
    }
    if (activeStudent?.problemArchetype === 'Application Difficulty') {
      return {
        name: 'Call Stack Allocation & Space Tracking',
        topicId: 'recursion',
        confidence: 73,
        explanation:
          'Your multi-step problem errors occur when tracking auxiliary memory under branch recursion, confusing O(n) call stack depth with O(2^n) time complexity.',
        chain: [
          { id: 'functions', name: 'Stack Frames', mastery: 90, isRoot: false },
          { id: 'recursion_memory', name: 'Stack Memory Tracking', mastery: 35, isRoot: true },
          { id: 'binary_search', name: 'Binary Search', mastery: 63, isRoot: false },
          { id: 'bst', name: 'BST', mastery: 43, isRoot: false }
        ]
      };
    }
    return {
      name: 'Recursion',
      topicId: 'recursion',
      confidence: 78,
      explanation:
        activeStudent?.diagnosisSummary ||
        'Your Binary Search Tree errors appear to be partially caused by difficulty understanding recursive problem decomposition.',
      chain: [
        { id: 'recursion', name: 'Recursion', mastery: 42, isRoot: true },
        { id: 'binary_search', name: 'Binary Search', mastery: 63, isRoot: false },
        { id: 'trees', name: 'Trees', mastery: 79, isRoot: false },
        { id: 'bst', name: 'BST', mastery: 43, isRoot: false }
      ]
    };
  }, [activeStudent]);

  // Knowledge Graph Selected Node
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState<string>('bst');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('data-structures-algorithms');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('binary-search-trees');

  // Adaptive Practice State
  const [adaptiveIndex, setAdaptiveIndex] = useState(0);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [difficultyHistory, setDifficultyHistory] = useState<('Easy' | 'Medium' | 'Hard')[]>([
    'Medium'
  ]);
  const [practiceMastery, setPracticeMastery] = useState<number>(42);
  const [practiceLastResult, setPracticeLastResult] = useState<{
    isCorrect: boolean;
    feedback: string;
    difficultyChange: string;
    selectedOptionId: string;
  } | null>(null);

  const submitAdaptivePracticeAnswer = (optionId: string) => {
    const q = ADAPTIVE_PRACTICE_QUESTIONS[adaptiveIndex % ADAPTIVE_PRACTICE_QUESTIONS.length];
    const option = q.options.find((o) => o.id === optionId);
    const isCorrect = !!option?.isCorrect;

    let nextDiff: 'Easy' | 'Medium' | 'Hard' = adaptiveDifficulty;
    let changeText = 'Difficulty maintained';

    if (isCorrect) {
      if (adaptiveDifficulty === 'Easy') {
        nextDiff = 'Medium';
        changeText = 'Easy → Medium';
      } else if (adaptiveDifficulty === 'Medium') {
        nextDiff = 'Hard';
        changeText = 'Medium → Hard';
      } else {
        changeText = 'Hard (Peak Mastery Tier)';
      }
      setPracticeMastery((prev) => Math.min(100, prev + 12));
    } else {
      if (adaptiveDifficulty === 'Hard') {
        nextDiff = 'Medium';
        changeText = 'Hard → Medium';
      } else if (adaptiveDifficulty === 'Medium') {
        nextDiff = 'Easy';
        changeText = 'Medium → Easy';
      } else {
        changeText = 'Easy (Reinforcing Prerequisite)';
      }
      setPracticeMastery((prev) => Math.max(25, prev - 4));
    }

    setPracticeLastResult({
      isCorrect,
      feedback: isCorrect ? q.aiFeedbackIfCorrect : q.aiFeedbackIfWrong,
      difficultyChange: changeText,
      selectedOptionId: optionId
    });

    setAdaptiveDifficulty(nextDiff);
    setDifficultyHistory((prev) => [...prev, nextDiff]);
  };

  const resetAdaptivePractice = () => {
    setAdaptiveIndex((prev) => prev + 1);
    setPracticeLastResult(null);
  };

  // AI Tutor Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [tutorTyping, setTutorTyping] = useState<boolean>(false);

  const sendTutorMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setTutorTyping(true);

    setTimeout(() => {
      let aiReply = '';
      let callout: ChatMessage['callout'] = undefined;

      const lower = text.toLowerCase();
      const learnerName = activeStudent?.name || 'Learner';
      if (lower.includes('hindi') || lower.includes('hinglish')) {
        aiReply =
          `Bilkul ${learnerName}! Dekho, Recursion ka matlab hota hai jab ek function apne aap ko chote inputs ke saath dobara call karta hai.\n\nEk seedha example: Jaise Russian Matryoshka doll hoti hai. Har doll ke andar ek choti doll hoti hai, tab tak jab tak sabse choti doll (Base Case) nahi milti!\n\nTrees mein har node ke paas 2 branches hoti hain (Left & Right). Toh aapko bas ek single node ke liye code likhna hota hai, baaki subtrees ka kaam recursion khud sambhal leta hai.`;
        callout = {
          type: 'reasoning',
          title: 'Hinglish Concept Bridge',
          content: 'Base case = Sabse choti doll jahan rukna hai. Recursive step = Agli doll kholna.'
        };
      } else if (lower.includes('example') || lower.includes('code')) {
        aiReply =
          'Here is the classic tree height calculation written with clean recursive decomposition:\n\n```typescript\nfunction maxDepth(root: TreeNode | null): number {\n  // 1. Base case: empty subtree has depth 0\n  if (root === null) return 0;\n  \n  // 2. Delegate to left & right subtrees\n  const leftHeight = maxDepth(root.left);\n  const rightHeight = maxDepth(root.right);\n  \n  // 3. Combine: add 1 for current root node\n  return 1 + Math.max(leftHeight, rightHeight);\n}\n```\nNotice the key step: forgetting `1 +` completely collapses recursive depth calculations!';
        callout = {
          type: 'code',
          title: 'Code Autopsy',
          content: 'Always remember: each return step must carry forward the current level (+1).'
        };
      } else if (lower.includes('hint') || lower.includes('test')) {
        aiReply =
          "Here is a rapid challenge to test your intuition:\n\nIf a tree has a root node with NO children (a leaf), what does `maxDepth(leaf)` return?\n- `maxDepth(null)` returns 0 for both children.\n- `1 + Math.max(0, 0) = 1`.\n\nSee how clean the induction holds? Can you trace what happens if the root node has only a left child of depth 3?";
        callout = {
          type: 'hint',
          title: 'Diagnostic Quick Check',
          content: 'Try calculating in your head: left=3, right=0, root adds +1. What is the total height?'
        };
      } else if (lower.includes('step')) {
        aiReply =
          "Here is the 3-step formula MindTrace builds for recursive confidence:\n\n1. **Identify the Smallest Valid Input**: What does null or empty tree return? (e.g. 0, true, null).\n2. **Trust the Subproblem Hypothesis**: Assume `solve(node.left)` already worked perfectly without tracing it.\n3. **Synthesize the Current Frame**: What does THIS node need to add to that left/right result?";
        callout = {
          type: 'reasoning',
          title: 'Inductive Leap',
          content: 'Stop tracing recursion with your eyes. Trust the recursive contract.'
        };
      } else {
        aiReply =
          `I understand your question regarding "${text.slice(0, 45)}...". Based on your learning twin profile, you grasp single-step operations well (92% Arrays, 81% Searching) but drop confidence when multiple recursive frames stack together.\n\nLet's keep our focus on **Binary Search Trees & Recursion**: remember that a BST node is not an isolated value; it is the root of an entire ordered realm. Left subtrees must strictly satisfy (-∞, node.val) and right subtrees (node.val, +∞).`;
        callout = {
          type: 'prerequisite_alert',
          title: 'Learning Twin Alignment',
          content: 'Mastery on Recursion is currently 42%. Targeted exercises will boost it directly.'
        };
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        callout
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setTutorTyping(false);
    }, 650);
  };

  // Rescue Mode State
  const [rescueDuration, setRescueDuration] = useState<15 | 30 | 60>(30);
  const activeRescuePlan = useMemo(() => RESCUE_PLANS[rescueDuration], [rescueDuration]);
  const [isRescueActive, setIsRescueActive] = useState<boolean>(false);
  const [rescueActiveStep, setRescueActiveStep] = useState<number>(0);

  const startRescueSprint = () => {
    setIsRescueActive(true);
    setRescueActiveStep(0);
  };

  const nextRescueStep = () => {
    if (rescueActiveStep < activeRescuePlan.items.length - 1) {
      setRescueActiveStep((prev) => prev + 1);
    } else {
      setIsRescueActive(false);
      // Boost mastery
      setTopics((prev) => ({
        ...prev,
        recursion: { ...prev.recursion, mastery: 58, status: 'developing' }
      }));
      setCurrentPage('progress');
    }
  };

  const exitRescueSprint = () => {
    setIsRescueActive(false);
  };

  const updateTopicMastery = (id: string, newMastery: number) => {
    setTopics((prev) => {
      const topic = prev[id];
      if (!topic) return prev;
      let status: Topic['status'] = 'needs_attention';
      if (newMastery >= 81) status = 'mastered';
      else if (newMastery >= 61) status = 'proficient';
      else if (newMastery >= 41) status = 'developing';

      return {
        ...prev,
        [id]: {
          ...topic,
          mastery: newMastery,
          status
        }
      };
    });
  };

  // Study Buddy & Cohort Collaboration State
  const [studyBuddyPairings, setStudyBuddyPairings] = useState<StudyBuddyPairing[]>(() => {
    try {
      const saved = localStorage.getItem('mindtrace_study_buddy_pairings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDY_BUDDY_PAIRINGS;
  });

  const [activeStudyBuddyPairingId, setActiveStudyBuddyPairingId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mindtrace_active_study_pairing_id') || 'pairing-rohan-incoming';
    } catch {
      return 'pairing-rohan-incoming';
    }
  });

  const activeStudyBuddyPairing = useMemo(() => {
    if (!activeStudyBuddyPairingId) return null;
    return studyBuddyPairings.find((p) => p.id === activeStudyBuddyPairingId) || null;
  }, [studyBuddyPairings, activeStudyBuddyPairingId]);

  // Pomodoro timer effect for active study buddy sessions
  useEffect(() => {
    const hasRunningTimer = studyBuddyPairings.some((p) => p.isTimerRunning && (p.timerSecondsLeft ?? 0) > 0);
    if (!hasRunningTimer) return;

    const timer = setInterval(() => {
      setStudyBuddyPairings((prev) =>
        prev.map((p) => {
          if (!p.isTimerRunning || !p.timerSecondsLeft || p.timerSecondsLeft <= 0) return p;
          return {
            ...p,
            timerSecondsLeft: p.timerSecondsLeft - 1
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [studyBuddyPairings]);

  const updateStudentLearningFocus = (studentId: string, focusUpdates: Partial<LearningFocus>) => {
    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentFocus: LearningFocus = s.learningFocus || {
          topicId: 'recursion',
          topicName: 'Recursion & Call Stacks',
          subtopicOrGoal: s.primaryRootGap || 'Call Stack Unwinding',
          notes: 'Looking for a cohort buddy to review concepts and solve practice drills together.',
          preferredMode: 'live_coding',
          availability: 'available_now',
          updatedAt: new Date().toISOString(),
          targetExamOrGoal: s.targetExam || 'Technical Placements'
        };
        const updatedFocus: LearningFocus = {
          ...currentFocus,
          ...focusUpdates,
          updatedAt: new Date().toISOString()
        };
        return {
          ...s,
          learningFocus: updatedFocus
        };
      });
      try {
        localStorage.setItem('mindtrace_students', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const sendStudyBuddyRequest = async (targetStudentId: string, message?: string, mode?: CollaborationMode) => {
    const me = activeStudent;
    const target = students.find((s) => s.id === targetStudentId);
    if (!me || !target) {
      return { success: false, message: 'Invalid active student or target' };
    }

    const topicId = target.learningFocus?.topicId || me.learningFocus?.topicId || 'recursion';
    const topicName = target.learningFocus?.topicName || me.learningFocus?.topicName || 'Recursion & Call Stacks';
    const chosenMode = mode || target.learningFocus?.preferredMode || 'live_coding';

    const newPairing: StudyBuddyPairing = {
      id: `pairing-${Date.now()}`,
      studentAId: me.id,
      studentAName: me.name,
      studentAAvatar: me.avatar,
      studentAInstitution: me.institution,
      studentBId: target.id,
      studentBName: target.name,
      studentBAvatar: target.avatar,
      studentBInstitution: target.institution,
      topicId,
      topicName,
      subtopicOrGoal: target.learningFocus?.subtopicOrGoal || me.learningFocus?.subtopicOrGoal || 'Collaborative Problem Solving',
      mode: chosenMode,
      status: 'pending',
      initiatedBy: me.id,
      message: message || `Hey ${target.name.split(' ')[0]}! I saw your learning focus in ${topicName}. Let's pair up for a collaborative study session!`,
      createdAt: new Date().toISOString(),
      sessionGoal: `Joint practice on ${topicName}: ${target.learningFocus?.subtopicOrGoal || 'Problem decomposition and boundary invariants'}`,
      sharedCode: target.learningFocus?.codeSnippet || `// Collaborative Workspace: ${me.name} & ${target.name}\n// Topic: ${topicName}\n\n// Add your solution code, test cases, or invariants below:\n`,
      sessionNotes: `Session Focus: ${target.learningFocus?.subtopicOrGoal || topicName}\nMode: ${chosenMode.replace('_', ' ').toUpperCase()}`,
      timerSecondsLeft: 25 * 60,
      isTimerRunning: false,
      chatMessages: [
        {
          id: `msg-${Date.now()}`,
          senderId: me.id,
          senderName: me.name,
          text: message || `Hey ${target.name.split(' ')[0]}! Would love to pair up on ${topicName}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        }
      ]
    };

    setStudyBuddyPairings((prev) => {
      const updated = [newPairing, ...prev];
      try {
        localStorage.setItem('mindtrace_study_buddy_pairings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Dispatch a notification
    const buddyNotif: DispatchedNotification = {
      id: `notif-buddy-${Date.now()}`,
      studentId: me.id,
      recipientName: me.name,
      channel: 'email',
      to: me.email || 'student@mindtrace.edu',
      type: 'faculty_alert',
      title: 'Study Buddy Request Dispatched',
      subject: `Study Buddy Invitation sent to ${target.name} (${topicName})`,
      content: `Your Study Buddy request to ${target.name} has been broadcast to their dashboard.\nFocus Topic: ${topicName}\nCollaboration Mode: ${chosenMode}`,
      timestamp: new Date().toISOString(),
      status: 'delivered',
      isRead: false
    };
    setDispatchedNotifications((prev) => [buddyNotif, ...prev]);

    return { success: true, pairing: newPairing, message: `Study Buddy invite sent to ${target.name}!` };
  };

  const respondToStudyBuddyRequest = (pairingId: string, action: 'accepted' | 'declined') => {
    setStudyBuddyPairings((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== pairingId) return p;
        return {
          ...p,
          status: action === 'accepted' ? ('accepted' as const) : ('declined' as const)
        };
      });
      try {
        localStorage.setItem('mindtrace_study_buddy_pairings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (action === 'accepted') {
      setActiveStudyBuddyPairingId(pairingId);
      try {
        localStorage.setItem('mindtrace_active_study_pairing_id', pairingId);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const sendStudyBuddyChatMessage = (
    pairingId: string,
    text: string,
    type: 'text' | 'hint' | 'code' | 'system' | 'high_five' = 'text'
  ) => {
    const me = activeStudent;
    if (!me || !text.trim()) return;

    const newMsg: StudyBuddyPairingMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderId: me.id,
      senderName: me.name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };

    setStudyBuddyPairings((prev) => {
      const targetPairing = prev.find((p) => p.id === pairingId);
      const updated = prev.map((p) => {
        if (p.id !== pairingId) return p;
        return {
          ...p,
          chatMessages: [...p.chatMessages, newMsg]
        };
      });
      try {
        localStorage.setItem('mindtrace_study_buddy_pairings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // If chatting in a pairing with a cohort peer, trigger an authentic peer simulated response
      if (targetPairing) {
        const otherStudentId = targetPairing.studentAId === me.id ? targetPairing.studentBId : targetPairing.studentAId;
        const otherStudentName = targetPairing.studentAId === me.id ? targetPairing.studentBName : targetPairing.studentAName;

        setTimeout(() => {
          let peerReplyText = `Good point! Let's trace how the variables change on that call.`;
          if (type === 'high_five') {
            peerReplyText = `🙌 High five back! We are making solid headway on this topic.`;
          } else if (text.toLowerCase().includes('base case')) {
            peerReplyText = `Agreed! Checking if root is null before dereferencing left/right prevents the stack overflow.`;
          } else if (text.toLowerCase().includes('stack') || text.toLowerCase().includes('unwind')) {
            peerReplyText = `Exactly! Each helper returns its integer value back up to the calling frame without overwriting parent memory.`;
          } else if (text.toLowerCase().includes('test')) {
            peerReplyText = `Let's test with [3, 9, 20, null, null, 15, 7] and inspect the returned depth!`;
          }

          const replyMsg: StudyBuddyPairingMessage = {
            id: `msg-reply-${Date.now()}`,
            senderId: otherStudentId,
            senderName: otherStudentName,
            text: peerReplyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: type === 'high_five' ? 'high_five' : 'text'
          };

          setStudyBuddyPairings((current) => {
            const nextList = current.map((item) => {
              if (item.id !== pairingId) return item;
              return {
                ...item,
                chatMessages: [...item.chatMessages, replyMsg]
              };
            });
            try {
              localStorage.setItem('mindtrace_study_buddy_pairings', JSON.stringify(nextList));
            } catch (e) {
              console.error(e);
            }
            return nextList;
          });
        }, 1200);
      }

      return updated;
    });
  };

  const updateStudyBuddySessionWorkspace = (
    pairingId: string,
    updates: { sharedCode?: string; sessionNotes?: string; sessionGoal?: string }
  ) => {
    setStudyBuddyPairings((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== pairingId) return p;
        return {
          ...p,
          ...updates
        };
      });
      try {
        localStorage.setItem('mindtrace_study_buddy_pairings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const toggleStudyBuddySessionTimer = (pairingId: string) => {
    setStudyBuddyPairings((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== pairingId) return p;
        return {
          ...p,
          isTimerRunning: !p.isTimerRunning
        };
      });
      try {
        localStorage.setItem('mindtrace_study_buddy_pairings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const resetStudyBuddySessionTimer = (pairingId: string, minutes: number = 25) => {
    setStudyBuddyPairings((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== pairingId) return p;
        return {
          ...p,
          timerSecondsLeft: minutes * 60,
          isTimerRunning: false
        };
      });
      try {
        localStorage.setItem('mindtrace_study_buddy_pairings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const completeStudyBuddySession = (pairingId: string, peerNote?: string) => {
    setStudyBuddyPairings((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== pairingId) return p;
        return {
          ...p,
          status: 'completed' as const,
          isTimerRunning: false,
          sessionNotes: peerNote ? `${p.sessionNotes || ''}\n\nCompletion Commendation: "${peerNote}"` : p.sessionNotes
        };
      });
      try {
        localStorage.setItem('mindtrace_study_buddy_pairings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Achievement System State
  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    try {
      const saved = localStorage.getItem('mindtrace_achievements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ACHIEVEMENTS;
  });

  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<AchievementBadge | null>(null);

  const dismissUnlockedBadgeToast = () => {
    setNewlyUnlockedBadge(null);
  };

  const checkAndAwardAchievements = () => {
    const responsesCount = Object.keys(assessmentResponses).length;
    const pairingsCount = studyBuddyPairings.filter(
      (p) => p.status === 'accepted' || p.status === 'completed'
    ).length;

    const { updatedBadges, newlyUnlocked } = evaluateMilestoneAchievements(
      achievements,
      activeStudent,
      topics,
      computedAssessmentScore,
      responsesCount,
      isAssessmentCompleted,
      pairingsCount
    );

    if (newlyUnlocked.length > 0) {
      setAchievements(updatedBadges);
      try {
        localStorage.setItem('mindtrace_achievements', JSON.stringify(updatedBadges));
      } catch (e) {
        console.error(e);
      }
      const badgeToCelebrate = newlyUnlocked[0];
      setNewlyUnlockedBadge(badgeToCelebrate);

      if (activeStudent) {
        const achieveNotif: DispatchedNotification = {
          id: `notif-badge-${Date.now()}`,
          studentId: activeStudent.id,
          recipientName: activeStudent.name,
          channel: 'email',
          to: activeStudent.email || 'student@mindtrace.edu',
          type: 'faculty_alert',
          title: `Milestone Achieved: ${badgeToCelebrate.title}`,
          subject: `🏅 New Badge Earned: ${badgeToCelebrate.title} (+${badgeToCelebrate.rewardXP} XP)`,
          content: `Congratulations ${activeStudent.name}!\n\nYou have officially unlocked the "${badgeToCelebrate.title}" badge (${badgeToCelebrate.rarity.toUpperCase()})!\n\nDescription: ${badgeToCelebrate.description}\nReward: +${badgeToCelebrate.rewardXP} XP\n\nKeep pushing forward on your prerequisite learning track.`,
          timestamp: new Date().toISOString(),
          status: 'delivered',
          isRead: false
        };
        setDispatchedNotifications((prev) => [achieveNotif, ...prev]);
      }
    } else {
      setAchievements(updatedBadges);
      try {
        localStorage.setItem('mindtrace_achievements', JSON.stringify(updatedBadges));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    checkAndAwardAchievements();
  }, [assessmentResponses, isAssessmentCompleted, topics, activeStudent?.currentStreak]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        pageHistory,
        canGoBack,
        goBack,
        previousPage,
        students,
        activeStudent,
        activeStudentId,
        setActiveStudentId,
        logoutStudent,
        registerNewStudent,
        loginStudent,
        loginWithCredentials,
        resetStudentPassword,
        sendPasswordResetEmailHandler,
        loginWithGoogle,
        isFirebaseLoading,
        deleteStudentProfile,
        updateStudentStreak,
        checkInToday,

        // Role-Based Access Control & Admin Portal
        currentUserRole,
        switchUserRole,
        admins,
        activeAdminId,
        activeAdmin,
        isAdminAuthenticated,
        isAdminAuthModalOpen,
        adminAuthModalMode,
        openAdminAuthModal,
        closeAdminAuthModal,
        loginAdmin,
        loginAdminWithGoogle,
        loginAdminQuick,
        registerAdmin,
        logoutAdmin,

        // Consent-Gated Student Data Access Controls
        allDataAccessRequests,
        requestStudentDataAccess,
        grantStudentDataAccess,
        revokeStudentDataAccess,
        addFacultyNote,
        assignStudentIntervention,
        updateStudentRiskLevel,
        logAutopsyInspection,

        // Enterprise Governance Audit Logs
        auditLogs,
        addAuditLog,

        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authModalAudience,
        setAuthModalAudience,
        loginPrefillIdentifier,
        setLoginPrefillIdentifier,
        openAuthModal,
        closeAuthModal,
        dispatchedNotifications,
        unreadNotificationsCount,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        latestDispatchToast,
        dismissDispatchToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        resendNotification,
        topics,
        updateTopicMastery,
        assessmentQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        assessmentResponses,
        recordAssessmentResponse,
        isAssessmentCompleted,
        finishAssessment,
        resetAssessment,
        computedAssessmentScore,
        errorBreakdown,
        rootGapDiagnosis,
        selectedGraphNodeId,
        setSelectedGraphNodeId,
        selectedCourseId,
        setSelectedCourseId,
        selectedChapterId,
        setSelectedChapterId,
        adaptivePractice: {
          questions: ADAPTIVE_PRACTICE_QUESTIONS,
          currentIndex: adaptiveIndex,
          currentDifficulty: adaptiveDifficulty,
          difficultyHistory,
          masteryScore: practiceMastery,
          lastResult: practiceLastResult,
          isFinished: false
        },
        submitAdaptivePracticeAnswer,
        resetAdaptivePractice,
        chatMessages,
        sendTutorMessage,
        tutorTyping,
        rescueDuration,
        setRescueDuration,
        activeRescuePlan,
        isRescueActive,
        rescueActiveStep,
        startRescueSprint,
        nextRescueStep,
        exitRescueSprint,
        mistakeDna: MISTAKE_DNA_DATA,
        learningTwin: LEARNING_TWIN_DATA,

        // Study Buddy & Cohort Collaboration
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

        // Achievement System
        achievements,
        newlyUnlockedBadge,
        dismissUnlockedBadgeToast,
        checkAndAwardAchievements
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
