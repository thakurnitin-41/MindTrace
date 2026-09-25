import { AdminProfile, StudentProfile, AuditLogEntry } from '../types';

export const VALID_INSTITUTIONAL_KEYS: Record<string, { institution: string; department: string; minRole: string }> = {
  'MINDTRACE-ADMIN-2026': {
    institution: 'MindTrace University & Autonomous AI Research Lab',
    department: 'Department of Computer Science & Pedagogy',
    minRole: 'Department Head / Faculty Lead'
  },
  'FACULTY-DEAN-CS': {
    institution: 'School of Advanced Computing & Engineering',
    department: 'Division of Academic Excellence & Accreditation',
    minRole: 'Dean of Academics'
  },
  'CAMPUS-AUTH-99': {
    institution: 'National Tech Placements Consortium',
    department: 'Career & Industry Placement Cell',
    minRole: 'Academic Advisor / Placement Director'
  },
  'ACAD-ADMIN-2026': {
    institution: 'Autonomous Engineering College',
    department: 'Computer Science & Engineering',
    minRole: 'Faculty Mentor'
  },
  'STANFORD-CS-PEDAGOGY': {
    institution: 'Stanford University (Cognitive Systems Lab)',
    department: 'School of Engineering',
    minRole: 'Principal Investigator'
  }
};

export const INITIAL_ADMINS: AdminProfile[] = [
  {
    id: 'admin-dr-aris-vance',
    name: 'Dr. Aris Vance',
    email: 'aris.vance@mindtrace.edu',
    phone: '+1 (555) 492-8810',
    institution: 'MindTrace Institute & Stanford AI Pedagogy Lab',
    department: 'Department of Computer Science & Cognitive Systems',
    role: 'department_head',
    roleTitle: 'Head of Algorithmic Pedagogy & Cognitive Diagnostics',
    authKey: 'MINDTRACE-ADMIN-2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    createdAt: '2026-01-10T09:30:00.000Z',
    lastLoginAt: '2026-09-22T08:15:00.000Z',
    securityPin: '749201',
    permissions: [
      'cohort:monitor',
      'interventions:assign',
      'student_data:request_access',
      'analytics:view',
      'audit_log:view',
      'faculty_notes:manage'
    ]
  },
  {
    id: 'admin-prof-elena',
    name: 'Prof. Elena Rostova',
    email: 'elena.rostova@university.edu',
    phone: '+1 (555) 318-7244',
    institution: 'School of Advanced Computing & Engineering',
    department: 'Division of Academic Oversight & Accreditation',
    role: 'dean',
    roleTitle: 'Dean of Academic Affairs & Accreditation',
    authKey: 'FACULTY-DEAN-CS',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    createdAt: '2026-02-01T10:00:00.000Z',
    lastLoginAt: '2026-09-21T14:20:00.000Z',
    securityPin: '821940',
    permissions: [
      'cohort:monitor',
      'interventions:assign',
      'student_data:request_access',
      'analytics:view',
      'audit_log:view',
      'compliance:manage'
    ]
  },
  {
    id: 'admin-marcus-chen',
    name: 'Marcus Chen',
    email: 'marcus.chen@tech-placement.org',
    phone: '+1 (555) 604-9218',
    institution: 'National Tech Placements Consortium',
    department: 'Career & Industry Placement Cell',
    role: 'academic_advisor',
    roleTitle: 'Director of Competitive Coding & Mentorship',
    authKey: 'CAMPUS-AUTH-99',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    createdAt: '2026-02-18T11:45:00.000Z',
    lastLoginAt: '2026-09-22T06:50:00.000Z',
    securityPin: '392817',
    permissions: [
      'cohort:monitor',
      'interventions:assign',
      'student_data:request_access',
      'analytics:view',
      'student_nudge:dispatch'
    ]
  },
  {
    id: 'admin-prof-vikas',
    name: 'Prof. Vikas Roy',
    email: 'vikas.roy@mindtrace.edu',
    phone: '+1 (555) 789-2140',
    institution: 'MindTrace University & Autonomous AI Research Lab',
    department: 'Department of Computer Science & Pedagogy',
    role: 'faculty_lead',
    roleTitle: 'Lead Faculty Mentor & Algorithms Instructor',
    authKey: 'ACAD-ADMIN-2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    createdAt: '2026-03-01T09:00:00.000Z',
    lastLoginAt: '2026-09-23T11:00:00.000Z',
    securityPin: '582914',
    permissions: [
      'cohort:monitor',
      'interventions:assign',
      'student_data:request_access',
      'faculty_notes:manage'
    ]
  },
  {
    id: 'admin-sarah-sys',
    name: 'Sarah Jenkins, CISSP',
    email: 'sarah.jenkins@mindtrace.gov',
    phone: '+1 (555) 891-4432',
    institution: 'National Academic Cloud & Security Consortium',
    department: 'Division of Information Security & Privacy Governance',
    role: 'system_admin',
    roleTitle: 'Chief Information Security Officer & System Admin',
    authKey: 'MINDTRACE-ADMIN-2026',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    isVerified: true,
    createdAt: '2026-01-05T08:00:00.000Z',
    lastLoginAt: '2026-09-24T08:00:00.000Z',
    securityPin: '918273',
    permissions: [
      'audit_log:view',
      'compliance:manage',
      'student_data:request_access',
      'analytics:view'
    ]
  }
];

export const COHORT_STUDENTS: StudentProfile[] = [
  {
    id: 'student-aarav-sharma',
    name: 'Aarav Sharma',
    email: 'aarav.sharma2026@iitb.ac.in',
    phone: '+91 98201 44829',
    password: 'password123',
    institution: 'Indian Institute of Technology (IIT) Bombay',
    degree: 'B.Tech - Computer Science & Engineering',
    targetExam: 'Google / Uber L4 Systems & DSA Placements',
    learningGoal: 'Master Advanced Graph Algorithms & Tree Invariants',
    roleType: 'student',
    graduationYearOrExp: '2026',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    currentStreak: 9,
    activeDays: ['2026-09-22', '2026-09-21', '2026-09-20', '2026-09-19', '2026-09-18', '2026-09-17'],
    overallMastery: 74,
    conceptsMastered: 18,
    questionsSolved: 56,
    primaryRootGap: 'Recursion Call Stack Unwinding',
    gapConfidence: 91,
    problemArchetype: 'Prerequisite Misconception',
    diagnosisSummary: 'Consistently misinterprets memory state after recursive helper return, assuming local values overwrite parent stack frames.',
    registeredAt: '2026-08-10T10:14:00.000Z',
    lastActiveDate: '2026-09-22',
    riskLevel: 'low',
    // Permission restricted by default per user requirement
    dataAccessStatus: 'restricted',
    dataAccessRequests: [],
    facultyNotes: [
      {
        id: 'fn-1',
        adminName: 'Dr. Aris Vance',
        adminRole: 'Department Head',
        note: 'Excellent algorithmic intuition in linear structures. Needs focused stack-frame tracing before moving to dynamic programming.',
        createdAt: '2026-09-15T14:30:00.000Z',
        category: 'advising'
      }
    ],
    assignedInterventions: [
      {
        id: 'int-1',
        title: '15-min Recursion Stack Frame Tracing Sandbox',
        type: 'rescue_session',
        assignedBy: 'Dr. Aris Vance',
        assignedAt: '2026-09-18T11:00:00.000Z',
        status: 'in_progress',
        targetTopicId: 'recursion'
      }
    ],
    learningFocus: {
      topicId: 'recursion',
      topicName: 'Recursion & Call Stacks',
      subtopicOrGoal: 'Stack frame unwinding & multi-branch tree recursion',
      notes: 'Traced through LeetCode #104 & #226. Looking for someone to whiteboard call stack frames and base returns together!',
      preferredMode: 'whiteboard',
      availability: 'available_now',
      updatedAt: '2026-09-24T09:30:00.000Z',
      targetExamOrGoal: 'Google / Uber L4 Systems & DSA Placements',
      codeSnippet: `function maxDepth(root) {\n  if (!root) return 0;\n  const left = maxDepth(root.left);\n  const right = maxDepth(root.right);\n  return Math.max(left, right) + 1;\n}`
    }
  },
  {
    id: 'student-priya-patel',
    name: 'Priya Patel',
    email: 'priya.patel@pilani.bits-pilani.ac.in',
    phone: '+91 97412 88390',
    password: 'password123',
    institution: 'BITS Pilani',
    degree: 'B.E. (Hons) - Computer Science',
    targetExam: 'FAANG & High-Frequency Trading Core SDE',
    learningGoal: 'Eliminate Subtle Off-By-One Errors & Edge Case Flaws',
    roleType: 'student',
    graduationYearOrExp: '2025',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    currentStreak: 14,
    activeDays: ['2026-09-22', '2026-09-21', '2026-09-20', '2026-09-19', '2026-09-18'],
    overallMastery: 84,
    conceptsMastered: 24,
    questionsSolved: 88,
    primaryRootGap: 'BST Subtree Invariant Validation',
    gapConfidence: 86,
    problemArchetype: 'Boundary Blindspot',
    diagnosisSummary: 'Verifies BST properties on immediate children only, failing to propagate global upper and lower bounds down subtrees.',
    registeredAt: '2026-07-20T08:00:00.000Z',
    lastActiveDate: '2026-09-22',
    riskLevel: 'low',
    // Permission granted by student
    dataAccessStatus: 'granted',
    dataAccessRequests: [
      {
        id: 'dar-1',
        adminId: 'admin-dr-aris-vance',
        adminName: 'Dr. Aris Vance',
        adminRole: 'Department Head',
        adminInstitution: 'MindTrace Institute',
        requestedAt: '2026-09-14T09:00:00.000Z',
        reason: 'Comprehensive diagnostic review for Tier-1 algorithmic internship nomination.',
        status: 'approved',
        updatedAt: '2026-09-14T10:15:00.000Z'
      }
    ],
    facultyNotes: [
      {
        id: 'fn-2',
        adminName: 'Dr. Aris Vance',
        adminRole: 'Department Head',
        note: 'Student granted verified consent. High aptitude in tree traversals. Ready for advanced self-balancing AVL rotation exercises.',
        createdAt: '2026-09-14T11:00:00.000Z',
        category: 'commendation'
      }
    ],
    assignedInterventions: [
      {
        id: 'int-2',
        title: 'BST Min-Max Range Propagation Booster',
        type: 'topic_booster',
        assignedBy: 'Dr. Aris Vance',
        assignedAt: '2026-09-16T15:00:00.000Z',
        status: 'completed',
        targetTopicId: 'bst'
      }
    ],
    learningFocus: {
      topicId: 'trees',
      topicName: 'Binary Search Trees',
      subtopicOrGoal: 'BST min-max subtree invariant propagation',
      notes: 'Eliminating subtle boundary conditions in isValidBST. Doing mock technical interviews for FAANG prep!',
      preferredMode: 'mock_interview',
      availability: 'available_now',
      updatedAt: '2026-09-24T08:45:00.000Z',
      targetExamOrGoal: 'FAANG & High-Frequency Trading Core SDE',
      codeSnippet: `function isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}`
    }
  },
  {
    id: 'student-rohan-mehta',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@dtu.ac.in',
    phone: '+91 91234 56780',
    password: 'password123',
    institution: 'Delhi Technological University (DTU)',
    degree: 'B.Tech - Information Technology',
    targetExam: 'Amazon & Atlassian SDE Placements',
    learningGoal: 'Overcome Base Case Omission and Stack Overflow Traps',
    roleType: 'student',
    graduationYearOrExp: '2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    currentStreak: 2,
    activeDays: ['2026-09-22', '2026-09-20'],
    overallMastery: 46,
    conceptsMastered: 9,
    questionsSolved: 28,
    primaryRootGap: 'Recursive Base Case Termination',
    gapConfidence: 94,
    problemArchetype: 'Critical Prerequisite Gap',
    diagnosisSummary: 'Functions trigger stack overflow due to omission of base condition checks, crippling tree and graph traversals.',
    registeredAt: '2026-09-01T12:00:00.000Z',
    lastActiveDate: '2026-09-22',
    riskLevel: 'critical',
    dataAccessStatus: 'pending',
    dataAccessRequests: [
      {
        id: 'dar-rohan-1',
        adminId: 'admin-dr-aris-vance',
        adminName: 'Dr. Aris Vance',
        adminRole: 'Department Head',
        adminInstitution: 'MindTrace Institute',
        requestedAt: '2026-09-22T08:30:00.000Z',
        reason: 'Pedagogical intervention: Urgent 1-on-1 remediation on recursion call stack before midterm placements.',
        status: 'pending'
      }
    ],
    facultyNotes: [
      {
        id: 'fn-3',
        adminName: 'Marcus Chen',
        adminRole: 'Academic Advisor',
        note: 'Flagged as high-risk. Low diagnostic completion rate in tree modules due to recursion blockage.',
        createdAt: '2026-09-21T16:45:00.000Z',
        category: 'intervention'
      }
    ],
    assignedInterventions: [
      {
        id: 'int-3',
        title: 'Emergency 15-Minute Base Case Diagnostic Retest',
        type: 'diagnostic_retest',
        assignedBy: 'Marcus Chen',
        assignedAt: '2026-09-22T09:00:00.000Z',
        status: 'pending',
        targetTopicId: 'recursion'
      }
    ],
    learningFocus: {
      topicId: 'recursion',
      topicName: 'Recursion Base Conditions',
      subtopicOrGoal: 'Base case omission prevention & stack overflow defense',
      notes: 'Struggling with recursive terminations causing RangeError: Maximum call stack size exceeded. Looking for a pair debugging partner.',
      preferredMode: 'live_coding',
      availability: 'open_to_pairing',
      updatedAt: '2026-09-24T07:15:00.000Z',
      targetExamOrGoal: 'Amazon & Atlassian SDE Placements'
    }
  },
  {
    id: 'student-ananya-iyer',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@nitt.edu',
    phone: '+91 99876 54321',
    password: 'password123',
    institution: 'National Institute of Technology (NIT) Trichy',
    degree: 'B.Tech - Computer Science',
    targetExam: 'Microsoft IDC & Adobe Engineering',
    learningGoal: 'Master Graph Traversal Patterns and Visited Sets',
    roleType: 'student',
    graduationYearOrExp: '2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    currentStreak: 7,
    activeDays: ['2026-09-22', '2026-09-21', '2026-09-20', '2026-09-19'],
    overallMastery: 69,
    conceptsMastered: 16,
    questionsSolved: 47,
    primaryRootGap: 'Graph Cycle Tracking vs Visited Sets',
    gapConfidence: 88,
    problemArchetype: 'Conceptual Misunderstanding',
    diagnosisSummary: 'Fails to mark nodes as visited before expanding neighbors in BFS, causing exponential duplicate queue processing.',
    registeredAt: '2026-08-15T14:20:00.000Z',
    lastActiveDate: '2026-09-22',
    riskLevel: 'moderate',
    dataAccessStatus: 'restricted',
    dataAccessRequests: [],
    facultyNotes: [],
    assignedInterventions: [],
    learningFocus: {
      topicId: 'searching',
      topicName: 'Graph & BFS Traversal',
      subtopicOrGoal: 'Visited sets vs cycle tracking in graphs',
      notes: 'Working on bidirectional BFS and avoiding redundant queue states. Let’s do a concept review session.',
      preferredMode: 'concept_review',
      availability: 'open_to_pairing',
      updatedAt: '2026-09-23T18:00:00.000Z',
      targetExamOrGoal: 'Microsoft IDC & Adobe Engineering'
    }
  },
  {
    id: 'student-kavya-reddy',
    name: 'Kavya Reddy',
    email: 'kavya.reddy@iiit.ac.in',
    phone: '+91 94401 23456',
    password: 'password123',
    institution: 'International Institute of Information Technology (IIIT) Hyderabad',
    degree: 'B.Tech - Computer Science & Engineering',
    targetExam: 'Tower Research / Jane Street / Goldman Sachs Quant',
    learningGoal: 'Perfect Dynamic Programming State Transitions',
    roleType: 'student',
    graduationYearOrExp: '2025',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    currentStreak: 21,
    activeDays: ['2026-09-22', '2026-09-21', '2026-09-20', '2026-09-19', '2026-09-18'],
    overallMastery: 91,
    conceptsMastered: 29,
    questionsSolved: 112,
    primaryRootGap: 'DP Memoization Space Optimization',
    gapConfidence: 78,
    problemArchetype: 'Optimization Refinement',
    diagnosisSummary: 'Solves recursive DP with memoization effortlessly, but requires guidance in rolling array rolling buffer space optimization.',
    registeredAt: '2026-06-10T11:00:00.000Z',
    lastActiveDate: '2026-09-22',
    riskLevel: 'low',
    dataAccessStatus: 'granted',
    dataAccessRequests: [
      {
        id: 'dar-kavya-1',
        adminId: 'admin-prof-elena',
        adminName: 'Prof. Elena Rostova',
        adminRole: 'Dean of Academics',
        adminInstitution: 'School of Advanced Computing',
        requestedAt: '2026-09-10T11:00:00.000Z',
        reason: 'Honors fellowship and advanced competitive programming faculty coaching.',
        status: 'approved',
        updatedAt: '2026-09-10T13:20:00.000Z'
      }
    ],
    facultyNotes: [
      {
        id: 'fn-4',
        adminName: 'Prof. Elena Rostova',
        adminRole: 'Dean of Academics',
        note: 'Exceptional student. Top 2% in algorithmic complexity analysis and runtime optimizations.',
        createdAt: '2026-09-10T15:00:00.000Z',
        category: 'commendation'
      }
    ],
    assignedInterventions: [],
    learningFocus: {
      topicId: 'arrays',
      topicName: 'Dynamic Programming & Memory',
      subtopicOrGoal: 'Rolling array buffer space optimization O(N) to O(1)',
      notes: 'Mastered 2D DP recurrence relations; happy to explain recursion trees to any buddy while practicing rolling array memory tricks.',
      preferredMode: 'concept_review',
      availability: 'available_now',
      updatedAt: '2026-09-24T10:00:00.000Z',
      targetExamOrGoal: 'Tower Research / Jane Street / Goldman Sachs Quant'
    }
  },
  {
    id: 'student-vikram-malhotra',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra2026@vit.ac.in',
    phone: '+91 98860 11223',
    password: 'password123',
    institution: 'Vellore Institute of Technology (VIT)',
    degree: 'B.Tech - Computer Science',
    targetExam: 'Product Startups & High-Scale Backend SDE',
    learningGoal: 'Master Binary Search Pointer Invariants and Mid-Calculations',
    roleType: 'student',
    graduationYearOrExp: '2026',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    currentStreak: 4,
    activeDays: ['2026-09-22', '2026-09-21'],
    overallMastery: 53,
    conceptsMastered: 11,
    questionsSolved: 34,
    primaryRootGap: 'Binary Search Mid Integer Overflow',
    gapConfidence: 89,
    problemArchetype: 'Implementation Vulnerability',
    diagnosisSummary: 'Repeatedly uses (low + high) / 2 instead of low + (high - low) / 2, leading to sign-bit integer overflows on large array tests.',
    registeredAt: '2026-08-28T09:15:00.000Z',
    lastActiveDate: '2026-09-22',
    riskLevel: 'moderate',
    dataAccessStatus: 'restricted',
    dataAccessRequests: [],
    facultyNotes: [],
    assignedInterventions: [],
    learningFocus: {
      topicId: 'binary_search',
      topicName: 'Binary Search Invariants',
      subtopicOrGoal: 'Integer overflow in mid calculation and edge boundaries',
      notes: 'Practicing lower_bound, upper_bound, and search in rotated sorted array. Ready for an accountability Pomodoro sprint.',
      preferredMode: 'accountability',
      availability: 'open_to_pairing',
      updatedAt: '2026-09-24T06:20:00.000Z',
      targetExamOrGoal: 'Product Startups & High-Scale Backend SDE'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2026-09-24T08:15:22.000Z',
    actorName: 'Dr. Aris Vance',
    actorRole: 'admin',
    actorAdminRole: 'department_head',
    actorEmail: 'aris.vance@cs.mit.edu',
    action: 'Administrator Authentication',
    target: 'Department of Computer Science',
    details: 'Verified institutional clearance using key MINDTRACE-ADMIN-2026 via MFA PIN.',
    type: 'auth',
    status: 'success',
    ipAddress: '192.168.1.104',
    hashSignature: 'sha256_8f4b29c1e09a3d42'
  },
  {
    id: 'audit-2',
    timestamp: '2026-09-24T08:30:14.000Z',
    actorName: 'Dr. Aris Vance',
    actorRole: 'admin',
    actorAdminRole: 'department_head',
    actorEmail: 'aris.vance@cs.mit.edu',
    action: 'Data Access Request Submitted',
    target: 'Student: Rohan Mehta (DTU)',
    details: 'Requested full diagnostic autopsy and contact details for Pedagogical Remediation. Status: Pending Student Approval.',
    type: 'data_access',
    status: 'pending',
    ipAddress: '192.168.1.104',
    hashSignature: 'sha256_e109d3b417c80521',
    metadata: {
      studentId: 'student-rohan',
      reason: 'Academic Advising & Diagnostic Review: Student identified with severe recursion stack unwinding gap.'
    }
  },
  {
    id: 'audit-3',
    timestamp: '2026-09-24T09:00:45.000Z',
    actorName: 'Marcus Chen',
    actorRole: 'admin',
    actorAdminRole: 'academic_advisor',
    actorEmail: 'm.chen@placement.cmu.edu',
    action: 'Prescribed Intervention',
    target: 'Student: Rohan Mehta (DTU)',
    details: 'Assigned Emergency 15-Minute Base Case Diagnostic Retest for topic: recursion.',
    type: 'intervention',
    status: 'success',
    ipAddress: '192.168.1.112',
    hashSignature: 'sha256_a4c7e290f11b6d83'
  },
  {
    id: 'audit-4',
    timestamp: '2026-09-24T10:15:00.000Z',
    actorName: 'Priya Patel',
    actorRole: 'student',
    actorEmail: 'priya.patel@bits.ac.in',
    action: 'Data Access Consent Granted',
    target: 'Administrator: Dr. Aris Vance',
    details: 'Student approved full data disclosure for academic mentoring in compliance with FERPA/DPDP.',
    type: 'data_access',
    status: 'success',
    ipAddress: '10.0.4.52',
    hashSignature: 'sha256_5b2d98f01c34ea72'
  },
  {
    id: 'audit-5',
    timestamp: '2026-09-24T11:05:12.000Z',
    actorName: 'Dr. Evelyn Sterling',
    actorRole: 'admin',
    actorAdminRole: 'dean',
    actorEmail: 'evelyn.sterling@harvard.edu',
    action: 'Institutional Accreditation Review',
    target: 'Fall 2026 CS Batch Audit',
    details: 'Verified FERPA § 99.31 disclosure registry and student consent status across 4 cohort colleges.',
    type: 'security',
    status: 'success',
    ipAddress: '192.168.1.101',
    hashSignature: 'sha256_d92e10fc3387b640'
  },
  {
    id: 'audit-6',
    timestamp: '2026-09-24T11:42:30.000Z',
    actorName: 'Security Subsystem',
    actorRole: 'system',
    action: 'RBAC Authorization Check',
    target: 'Endpoint: /api/admin/cohort-registry',
    details: 'Validated role token against authorization matrix. Privileges granted: cohort:monitor, interventions:assign.',
    type: 'rbac',
    status: 'success',
    ipAddress: '127.0.0.1',
    hashSignature: 'sha256_c77a1194200ef901'
  },
  {
    id: 'audit-7',
    timestamp: '2026-09-23T14:20:00.000Z',
    actorName: 'Kavya Reddy',
    actorRole: 'student',
    actorEmail: 'kavya.reddy@iiit.ac.in',
    action: 'Data Access Consent Granted',
    target: 'Administrator: Prof. Elena Rostova',
    details: 'Student approved full academic data access for honors fellowship program.',
    type: 'data_access',
    status: 'success',
    ipAddress: '10.0.8.19',
    hashSignature: 'sha256_31a90c427eb56012'
  },
  {
    id: 'audit-8',
    timestamp: '2026-09-23T16:45:10.000Z',
    actorName: 'Dr. Alex Mercer',
    actorRole: 'admin',
    actorAdminRole: 'system_admin',
    actorEmail: 'alex.mercer@sec.mit.edu',
    action: 'Unauthorized Admin Authentication Attempt',
    target: 'Faculty Gate: FACULTY-AUTH-FAIL',
    details: 'Blocked invalid credential token attempt from unregistered origin. IP auto-throttled.',
    type: 'rbac',
    status: 'denied',
    ipAddress: '203.0.113.88',
    hashSignature: 'sha256_ff014c2b9a781203'
  }
];
