export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  suggestedAction?: {
    label: string;
    actionType: 'switchToLogin' | 'switchToRegister' | 'focusPhone' | 'focusInstitution' | 'viewDashboard' | 'viewAutopsy';
  };
}

export const MINDTRACE_FAQS: FaqItem[] = [
  // 1. Onboarding & Registration
  {
    id: 'faq-reg-1',
    category: 'Onboarding & Registration',
    question: 'How do I register a new student account?',
    answer: 'To register, click the "Register" button. Enter your Full Name, Email Address, Phone Number (with auto-detected country code like +91 for India), Institution/College Name, Degree & Target Exam, and choose a secure 6+ character password. You can also upload a photo or snap one directly using your camera!',
    keywords: ['register', 'registration', 'create account', 'sign up', 'signup', 'join', 'new user', 'kaise karein'],
    suggestedAction: {
      label: 'Open Registration Form',
      actionType: 'switchToRegister'
    }
  },
  {
    id: 'faq-reg-2',
    category: 'Onboarding & Registration',
    question: 'How does mobile number verification and country code work?',
    answer: 'When you select or type a country code (such as +91 for India, +1 for US/Canada, +44 for UK, +971 for UAE), the input automatically verifies the international standard and validates the exact digit length (10 digits for India). You can click the country flag dropdown to search and choose from 40+ countries worldwide!',
    keywords: ['phone', 'mobile', '+91', 'country code', 'india', 'number', 'flag', 'sms', 'international'],
    suggestedAction: {
      label: 'Go to Phone Number Field',
      actionType: 'focusPhone'
    }
  },
  {
    id: 'faq-reg-3',
    category: 'Onboarding & Registration',
    question: 'How do I search for my college or university (IITs, DY Patil, SRM, etc.)?',
    answer: 'MindTrace includes a comprehensive global GPS directory of universities and colleges. Simply start typing your college name or city (e.g. "IIT" for all 23 IITs like Delhi, Mumbai, Ropar; "DY Patil" for Mumbai/Pune; "SRM" for Chennai; "Lucknow" for Lucknow colleges; "Noida" for Noida institutes). You can also click "Add Custom Institution" to type any location in the world!',
    keywords: ['college', 'university', 'institution', 'iit', 'dy patil', 'srm', 'noida', 'lucknow', 'delhi', 'gps', 'search college'],
    suggestedAction: {
      label: 'Search Institutions',
      actionType: 'focusInstitution'
    }
  },
  {
    id: 'faq-reg-4',
    category: 'Onboarding & Registration',
    question: 'How do I log in if I already have an account?',
    answer: 'Switch to the "Sign In" tab, select or type your registered Email address, and enter your password. If you need to switch accounts or manage profiles, all your learning history and dynamic streaks are securely saved.',
    keywords: ['login', 'log in', 'sign in', 'signin', 'existing user', 'password', 'already registered'],
    suggestedAction: {
      label: 'Switch to Sign In',
      actionType: 'switchToLogin'
    }
  },

  // 2. Account Security & Deletion
  {
    id: 'faq-sec-1',
    category: 'Security & Profile',
    question: 'How do I delete my account or reset my data?',
    answer: 'On the Sign In page, you can remove any saved profile by clicking the red "Delete Account" / trash button next to the account card, or by clicking "Delete Account" during login. It will ask for quick confirmation and permanently clean your profile and session data.',
    keywords: ['delete', 'delete account', 'remove', 'trash', 'remove account', 'reset data', 'delete profile']
  },
  {
    id: 'faq-sec-2',
    category: 'Security & Profile',
    question: 'Is my password and personal information secure?',
    answer: 'Yes! Passwords must be at least 6 characters and are validated for length and integrity. All notifications (welcome emails and SMS alerts) are logged inside your secure Dispatched Message Center accessible from the top bell icon.',
    keywords: ['security', 'password', 'safe', 'privacy', 'email', 'sms', 'protection']
  },

  // 3. Learning Dynamics & Streak
  {
    id: 'faq-dyn-1',
    category: 'Learning Dynamics & Streak',
    question: 'How does the Dynamic Learning Streak work?',
    answer: 'MindTrace dynamically tracks continuous learning sessions. Returning on consecutive days automatically updates your streak (e.g., Day 2 Momentum Builder). You can also use the interactive 7-day roadmap and the "+1 Check In" button on your Dashboard to log practice and unlock milestone badges.',
    keywords: ['streak', 'day 2', 'dynamic streak', 'check in', 'milestone', 'days', 'learning streak', 'flame', 'second day'],
    suggestedAction: {
      label: 'View Dashboard Streak',
      actionType: 'viewDashboard'
    }
  },
  {
    id: 'faq-dyn-2',
    category: 'Learning Dynamics & Streak',
    question: 'What is the "Gap Behind the Gap" concept?',
    answer: 'When a student struggles with complex topics like Binary Search Trees, the actual blocker is rarely the BST syntax itself—it is usually an unreinforced prerequisite like Recursion or Call Stack unwinding. MindTrace traces your errors backwards through the Knowledge Graph to pinpoint and fix the exact prerequisite root gap.',
    keywords: ['gap behind gap', 'root gap', 'philosophy', 'concept', 'prerequisite', 'bottleneck', 'autopsy'],
    suggestedAction: {
      label: 'Explore Learning Autopsy',
      actionType: 'viewAutopsy'
    }
  },

  // 4. Diagnostic & Tools
  {
    id: 'faq-dia-1',
    category: 'Diagnostic & Tools',
    question: 'What happens during the Diagnostic Assessment?',
    answer: 'The Diagnostic Assessment consists of conceptual DSA questions that analyze not just right/wrong answers, but response hesitation, confidence markers, and error archetypes to generate your personal Learning Twin and Mistake DNA.',
    keywords: ['diagnostic', 'assessment', 'test', 'exam', 'mistake dna', 'learning twin', 'questions']
  },
  {
    id: 'faq-dia-2',
    category: 'Diagnostic & Tools',
    question: 'What is Rescue Mode?',
    answer: 'Rescue Mode is an intensive 15, 30, or 60-minute targeted sprint designed for upcoming exams or interviews. It compresses the highest-leverage concepts and prerequisite fixes into structured actionable steps for rapid score recovery.',
    keywords: ['rescue mode', 'rescue sprint', '15 min', '30 min', '60 min', 'exam prep', 'interview']
  }
];

export const FAQ_CATEGORIES = [
  'All',
  'Onboarding & Registration',
  'Security & Profile',
  'Learning Dynamics & Streak',
  'Diagnostic & Tools'
];

export const POPULAR_QUESTIONS = [
  'How do I register a new account?',
  'How does +91 mobile verification work?',
  'How do I search for my college or IIT?',
  'How does the Day 2 streak work?',
  'How do I delete or switch accounts?',
  'What is the Root Gap philosophy?'
];

export const TAGLINES = [
  'Find the Gap Behind the Gap',
  'Same Score Does Not Mean Same Learning Problem',
  'Diagnose Cognitive Misconceptions, Not Just Wrong Answers',
  'Instant Onboarding Support & AI FAQ Knowledge'
];

