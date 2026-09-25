import { AchievementBadge, StudentProfile, Topic } from '../types';

export const DEFAULT_ACHIEVEMENTS: AchievementBadge[] = [
  // 1. Diagnostic Assessment Milestones
  {
    id: 'diag-first-step',
    title: 'Diagnostic Pioneer',
    description: 'Answered your first diagnostic assessment question to initialize cognitive tracing.',
    category: 'diagnostic',
    icon: 'Brain',
    isUnlocked: true,
    unlockedAt: '2026-09-22T10:15:00.000Z',
    progress: { current: 1, max: 1 },
    rewardXP: 50,
    rarity: 'common',
    criteria: 'Submit at least 1 question response in Diagnostic Assessment.'
  },
  {
    id: 'diag-halfway',
    title: 'Midpoint Diagnostic Evaluator',
    description: 'Reached question 5 of the diagnostic assessment, tracing 3 distinct topic nodes.',
    category: 'diagnostic',
    icon: 'Activity',
    isUnlocked: true,
    unlockedAt: '2026-09-22T10:20:00.000Z',
    progress: { current: 5, max: 5 },
    rewardXP: 100,
    rarity: 'rare',
    criteria: 'Complete 5 questions in the Trees & Recursion diagnostic assessment.'
  },
  {
    id: 'diag-complete',
    title: 'Diagnostic Conqueror',
    description: 'Completed the full 10-question Trees & Recursion Diagnostic Assessment.',
    category: 'diagnostic',
    icon: 'CheckCircle2',
    isUnlocked: false,
    progress: { current: 3, max: 10 },
    rewardXP: 250,
    rarity: 'epic',
    criteria: 'Complete all 10 questions in the diagnostic assessment.'
  },
  {
    id: 'diag-high-accuracy',
    title: 'Precision Thinker',
    description: 'Attained 70%+ score on the Trees & Recursion diagnostic assessment.',
    category: 'diagnostic',
    icon: 'Target',
    isUnlocked: false,
    progress: { current: 60, max: 70 },
    rewardXP: 200,
    rarity: 'epic',
    criteria: 'Score 70% or higher upon completing the diagnostic assessment.'
  },
  {
    id: 'diag-autopsy-detective',
    title: 'Root Gap Detective',
    description: 'Pinpointed your foundational prerequisite root gap in the Learning Autopsy engine.',
    category: 'diagnostic',
    icon: 'Sparkles',
    isUnlocked: true,
    unlockedAt: '2026-09-22T10:30:00.000Z',
    progress: { current: 1, max: 1 },
    rewardXP: 150,
    rarity: 'rare',
    criteria: 'Inspect the prerequisite dependency chain in Learning Autopsy.'
  },

  // 2. Subject Mastery Milestones
  {
    id: 'mastery-arrays',
    title: 'Array Architect',
    description: 'Attained 90%+ Mastery in Linear Array Structures & Two-Pointer Invariants.',
    category: 'mastery',
    icon: 'Award',
    isUnlocked: true,
    unlockedAt: '2026-09-20T14:00:00.000Z',
    progress: { current: 92, max: 90 },
    rewardXP: 150,
    rarity: 'rare',
    criteria: 'Reach 90% or higher mastery in the Arrays topic module.'
  },
  {
    id: 'mastery-searching',
    title: 'Search Pathfinder',
    description: 'Attained 80%+ Mastery in Searching Algorithms & Linear Traversal.',
    category: 'mastery',
    icon: 'Zap',
    isUnlocked: true,
    unlockedAt: '2026-09-21T16:30:00.000Z',
    progress: { current: 81, max: 80 },
    rewardXP: 150,
    rarity: 'rare',
    criteria: 'Reach 80% or higher mastery in Searching algorithms.'
  },
  {
    id: 'mastery-trees',
    title: 'Tree Arborist',
    description: 'Attained 75%+ Mastery in Hierarchical Binary Trees.',
    category: 'mastery',
    icon: 'GitFork',
    isUnlocked: true,
    unlockedAt: '2026-09-22T09:45:00.000Z',
    progress: { current: 79, max: 75 },
    rewardXP: 200,
    rarity: 'epic',
    criteria: 'Reach 75% or higher mastery in the Binary Trees topic module.'
  },
  {
    id: 'mastery-binary-search',
    title: 'Invariant Sentry',
    description: 'Attained 65%+ Mastery in Binary Search pointer boundaries and overflow prevention.',
    category: 'mastery',
    icon: 'ShieldCheck',
    isUnlocked: false,
    progress: { current: 63, max: 65 },
    rewardXP: 150,
    rarity: 'rare',
    criteria: 'Reach 65% or higher mastery in Binary Search.'
  },
  {
    id: 'mastery-recursion-breakthrough',
    title: 'Recursion Breakthrough',
    description: 'Broke the core prerequisite blocker by lifting Recursion above 50% mastery.',
    category: 'mastery',
    icon: 'Flame',
    isUnlocked: false,
    progress: { current: 42, max: 50 },
    rewardXP: 300,
    rarity: 'legendary',
    criteria: 'Lift Recursion mastery from Needs Attention to Developing (50%+).'
  },
  {
    id: 'mastery-grandmaster',
    title: 'Algorithmic Grandmaster',
    description: 'Reached an Overall Mastery score of 80%+ across all DSA modules.',
    category: 'mastery',
    icon: 'Award',
    isUnlocked: false,
    progress: { current: 74, max: 80 },
    rewardXP: 500,
    rarity: 'legendary',
    criteria: 'Achieve an overall cumulative student mastery score of 80% or greater.'
  },

  // 3. Streak & Collaboration Milestones
  {
    id: 'streak-7-days',
    title: 'Consistency Champion',
    description: 'Maintained a 7-Day active learning streak in the cognitive system.',
    category: 'streak',
    icon: 'Flame',
    isUnlocked: true,
    unlockedAt: '2026-09-22T08:00:00.000Z',
    progress: { current: 9, max: 7 },
    rewardXP: 150,
    rarity: 'rare',
    criteria: 'Maintain a verified learning streak of at least 7 consecutive days.'
  },
  {
    id: 'collab-first-buddy',
    title: 'Cohort Collaborator',
    description: 'Broadcasted your learning focus and joined a Study Buddy pairing session.',
    category: 'collaboration',
    icon: 'Users',
    isUnlocked: true,
    unlockedAt: '2026-09-24T10:00:00.000Z',
    progress: { current: 1, max: 1 },
    rewardXP: 150,
    rarity: 'rare',
    criteria: 'Send or participate in an active Study Buddy co-study session.'
  },
  {
    id: 'rescue-sprint-hero',
    title: 'Rescue Sprint Finisher',
    description: 'Completed a high-impact 15-minute targeted Rescue Mode sprint.',
    category: 'rescue',
    icon: 'Zap',
    isUnlocked: false,
    progress: { current: 0, max: 1 },
    rewardXP: 200,
    rarity: 'epic',
    criteria: 'Complete all steps of an emergency Rescue Mode intervention plan.'
  }
];

/**
 * Evaluates student progress against badge criteria and returns the updated badges list.
 * Any badge that transitions from locked to unlocked will be flagged.
 */
export function evaluateMilestoneAchievements(
  currentBadges: AchievementBadge[],
  student: StudentProfile | null,
  topics: Record<string, Topic>,
  assessmentScore: { correct: number; total: number; percentage: number },
  responsesCount: number,
  isAssessmentCompleted: boolean,
  pairingsCount: number
): {
  updatedBadges: AchievementBadge[];
  newlyUnlocked: AchievementBadge[];
} {
  const newlyUnlocked: AchievementBadge[] = [];

  const updatedBadges = currentBadges.map((badge) => {
    // If already unlocked, keep it
    if (badge.isUnlocked) return badge;

    let shouldUnlock = false;
    let newCurrent = badge.progress.current;

    switch (badge.id) {
      // Diagnostic milestones
      case 'diag-first-step':
        newCurrent = Math.min(1, responsesCount);
        shouldUnlock = responsesCount >= 1;
        break;

      case 'diag-halfway':
        newCurrent = Math.min(5, responsesCount);
        shouldUnlock = responsesCount >= 5;
        break;

      case 'diag-complete':
        newCurrent = Math.min(10, isAssessmentCompleted ? 10 : responsesCount);
        shouldUnlock = isAssessmentCompleted || responsesCount >= 10;
        break;

      case 'diag-high-accuracy':
        newCurrent = Math.min(70, assessmentScore.percentage);
        shouldUnlock = isAssessmentCompleted && assessmentScore.percentage >= 70;
        break;

      case 'diag-autopsy-detective':
        shouldUnlock = (student?.gapConfidence ?? 0) >= 80;
        newCurrent = shouldUnlock ? 1 : 0;
        break;

      // Subject Mastery milestones
      case 'mastery-arrays':
        newCurrent = topics.arrays?.mastery ?? 0;
        shouldUnlock = (topics.arrays?.mastery ?? 0) >= 90;
        break;

      case 'mastery-searching':
        newCurrent = topics.searching?.mastery ?? 0;
        shouldUnlock = (topics.searching?.mastery ?? 0) >= 80;
        break;

      case 'mastery-trees':
        newCurrent = topics.trees?.mastery ?? 0;
        shouldUnlock = (topics.trees?.mastery ?? 0) >= 75;
        break;

      case 'mastery-binary-search':
        newCurrent = topics.binary_search?.mastery ?? 0;
        shouldUnlock = (topics.binary_search?.mastery ?? 0) >= 65;
        break;

      case 'mastery-recursion-breakthrough':
        newCurrent = topics.recursion?.mastery ?? 0;
        shouldUnlock = (topics.recursion?.mastery ?? 0) >= 50;
        break;

      case 'mastery-grandmaster':
        newCurrent = student?.overallMastery ?? 0;
        shouldUnlock = (student?.overallMastery ?? 0) >= 80;
        break;

      // Streak & Collaboration
      case 'streak-7-days':
        newCurrent = student?.currentStreak ?? 0;
        shouldUnlock = (student?.currentStreak ?? 0) >= 7;
        break;

      case 'collab-first-buddy':
        newCurrent = Math.min(1, pairingsCount);
        shouldUnlock = pairingsCount >= 1 || !!student?.learningFocus;
        break;

      case 'rescue-sprint-hero':
        // Evaluated during rescue completion
        break;
    }

    if (shouldUnlock) {
      const unlockedBadge: AchievementBadge = {
        ...badge,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
        progress: { ...badge.progress, current: badge.progress.max }
      };
      newlyUnlocked.push(unlockedBadge);
      return unlockedBadge;
    }

    return {
      ...badge,
      progress: { ...badge.progress, current: newCurrent }
    };
  });

  return { updatedBadges, newlyUnlocked };
}
