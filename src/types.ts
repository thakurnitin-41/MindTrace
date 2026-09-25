export type PageId =
  | 'landing'
  | 'dashboard'
  | 'my-learning'
  | 'my-courses'
  | 'course-detail'
  | 'chapter-learning'
  | 'messages'
  | 'assessment'
  | 'autopsy'
  | 'knowledge-graph'
  | 'tutor'
  | 'practice'
  | 'twin'
  | 'rescue'
  | 'progress'
  | 'study-buddy'
  | 'achievements'
  | 'settings'
  // Admin Portal Pages
  | 'admin-dashboard'
  | 'admin-students'
  | 'admin-analytics'
  | 'admin-audit'
  | 'admin-settings'
  | 'admin-role-view';

export type UserRole = 'student' | 'admin';

export type AdminRole = 'dean' | 'department_head' | 'faculty_lead' | 'academic_advisor' | 'system_admin';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  institution: string;
  department: string;
  role: AdminRole;
  roleTitle: string;
  authKey: string;
  avatar: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  securityPin?: string;
  permissions: string[];
}

export type StudentDataAccessStatus = 'restricted' | 'pending' | 'granted';

export interface DataAccessRequest {
  id: string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  studentInstitution?: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  adminInstitution: string;
  requestedAt: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  updatedAt?: string;
  scope?: string[];
  resolvedBy?: string;
  rejectionReason?: string;
}

export interface FacultyNote {
  id: string;
  adminName: string;
  adminRole: string;
  note: string;
  createdAt: string;
  category?: 'intervention' | 'commendation' | 'advising' | 'general';
}

export interface StudentIntervention {
  id: string;
  title: string;
  type: 'rescue_session' | 'topic_booster' | 'diagnostic_retest' | 'mentor_meeting';
  assignedBy: string;
  assignedAt: string;
  status: 'pending' | 'in_progress' | 'completed';
  targetTopicId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'admin' | 'student' | 'system';
  actorAdminRole?: AdminRole;
  actorEmail?: string;
  action: string;
  target: string;
  details: string;
  type: 'auth' | 'data_access' | 'intervention' | 'profile_update' | 'security' | 'rbac';
  status?: 'success' | 'warning' | 'denied' | 'pending';
  ipAddress?: string;
  hashSignature?: string;
  metadata?: Record<string, any>;
}

export type MasteryStatus = 'needs_attention' | 'developing' | 'proficient' | 'mastered';

export interface Topic {
  id: string;
  name: string;
  category: string;
  mastery: number; // 0-100
  status: MasteryStatus;
  prerequisites: string[]; // Topic IDs
  directDependents?: string[]; // Topics that depend on this
  recentAccuracy: number; // 0-100
  questionsAttempted: number;
  detectedRisk?: string;
  commonMistakes: string[];
  recommendedDifficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionType?: 'conceptual' | 'prerequisite' | 'application' | 'careless';
  misconceptionNote?: string;
}

export interface AssessmentQuestion {
  id: string;
  topicId: string;
  topicName: string;
  prerequisiteTested?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prompt: string;
  codeSnippet?: string;
  options: QuestionOption[];
  explanation: string;
  rootGapIfWrong?: string;
}

export interface QuestionResponse {
  questionId: string;
  selectedOptionId: string | null;
  isUnsure: boolean;
  isCorrect: boolean;
  timeSpentSeconds: number;
  misconceptionType?: 'conceptual' | 'prerequisite' | 'application' | 'careless';
}

export interface StudentProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  institution?: string; // College or Company name
  roleType?: 'student' | 'professional' | 'other';
  graduationYearOrExp?: string; // e.g. "2025" or "2+ Years Exp"
  password?: string;
  avatar: string;
  degree: string;
  targetExam?: string;
  learningGoal?: string;
  registeredAt?: string;
  lastActiveDate?: string;
  activeDays?: string[];
  streakHistory?: { date: string; count: number }[];
  currentStreak: number;
  overallMastery: number;
  masteryScore?: number;
  conceptsMastered: number;
  questionsSolved: number;
  primaryRootGap: string;
  gapConfidence: number;
  problemArchetype: string;
  misconceptionArchetype?: string;
  diagnosisSummary: string;
  // Role-based data privacy and permission controls
  dataAccessStatus?: StudentDataAccessStatus;
  dataAccessRequests?: DataAccessRequest[];
  facultyNotes?: FacultyNote[];
  assignedInterventions?: StudentIntervention[];
  riskLevel?: 'low' | 'moderate' | 'critical';
  // Study Buddy & Cohort Collaboration
  learningFocus?: LearningFocus;
  academicProfile?: {
    currentYear?: string;
    branch?: string;
    graduationYear?: string;
  };
  learningGoals?: string[];
  primaryGoal?: string;
  learningInterests?: string[];
  confidenceLevels?: Record<string, 'beginner' | 'comfortable' | 'advanced' | 'not_sure'>;
  onboardingCompleted?: boolean;
  diagnosticStatus?: 'not_started' | 'skipped' | 'completed';
  currentCourse?: string;
  currentChapter?: string;
  courseProgress?: number;
  // Achievement System
  achievements?: AchievementBadge[];
}

export type AchievementCategory = 'diagnostic' | 'mastery' | 'streak' | 'collaboration' | 'rescue';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress: { current: number; max: number };
  rewardXP: number;
  rarity: BadgeRarity;
  criteria: string;
}

export type CollaborationMode =
  | 'live_coding'
  | 'concept_review'
  | 'mock_interview'
  | 'whiteboard'
  | 'accountability';

export type BuddyAvailability =
  | 'available_now'
  | 'open_to_pairing'
  | 'busy_focus_mode';

export interface LearningFocus {
  topicId: string;
  topicName: string;
  subtopicOrGoal: string;
  notes?: string;
  preferredMode: CollaborationMode;
  availability: BuddyAvailability;
  updatedAt: string;
  targetExamOrGoal?: string;
  codeSnippet?: string;
}

export interface StudyBuddyPairingMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type?: 'text' | 'hint' | 'code' | 'system' | 'high_five';
}

export interface StudyBuddyPairing {
  id: string;
  studentAId: string;
  studentAName: string;
  studentAAvatar: string;
  studentAInstitution?: string;
  studentBId: string;
  studentBName: string;
  studentBAvatar: string;
  studentBInstitution?: string;
  topicId: string;
  topicName: string;
  subtopicOrGoal?: string;
  mode: CollaborationMode;
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined';
  initiatedBy: string; // studentId
  message: string;
  createdAt: string;
  sessionNotes?: string;
  sharedCode?: string;
  sessionGoal?: string;
  timerSecondsLeft?: number;
  isTimerRunning?: boolean;
  chatMessages: StudyBuddyPairingMessage[];
}

export interface MistakeDNA {
  conceptual: number; // percentage
  application: number;
  prerequisite: number;
  careless: number;
  recurringPatterns: string[];
  strongPatterns: string[];
  coreInsight: string;
}

export interface LearningTwinMetrics {
  knowledge: number;
  application: number;
  retention: number;
  consistency: number;
  currentBottleneck: string;
  learningBehaviors: string[];
  recommendedAction: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  tags?: string[];
  callout?: {
    type: 'reasoning' | 'hint' | 'prerequisite_alert' | 'code';
    title: string;
    content: string;
  };
}

export interface RescuePlan {
  durationMinutes: 15 | 30 | 60;
  items: {
    duration: string;
    title: string;
    topic: string;
    type: 'Concept Review' | 'Step-by-Step' | 'Targeted Practice' | 'Reassessment';
    summary: string;
  }[];
  highestImpactConcepts: {
    name: string;
    impact: 'High' | 'Medium';
    reason: string;
  }[];
}

export interface DispatchedNotification {
  id: string;
  studentId: string;
  recipientName: string;
  channel: 'email' | 'sms' | 'whatsapp';
  to: string;
  type: 'registration_welcome' | 'login_alert' | 'security_code' | 'faculty_alert';
  subject?: string;
  title: string;
  content: string;
  htmlContent?: string;
  timestamp: string;
  status: 'delivered' | 'sent';
  securityPin?: string;
  metadata?: {
    institution?: string;
    role?: string;
    ipOrDevice?: string;
    browser?: string;
    timeString?: string;
    provider?: string;
    subject?: string;
    status?: string;
  };
  isRead: boolean;
}
