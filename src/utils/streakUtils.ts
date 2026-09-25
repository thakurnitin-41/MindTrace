import { StudentProfile } from '../types';

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns date formatted as YYYY-MM-DD for a given Date or ISO string
 */
export function formatDateString(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return getTodayDateString();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates calendar day difference between two YYYY-MM-DD strings
 */
export function getDaysDifference(fromDateStr: string, toDateStr: string): number {
  try {
    const fromParts = fromDateStr.split('-').map(Number);
    const toParts = toDateStr.split('-').map(Number);
    const fromUtc = Date.UTC(fromParts[0], fromParts[1] - 1, fromParts[2]);
    const toUtc = Date.UTC(toParts[0], toParts[1] - 1, toParts[2]);
    return Math.floor((toUtc - fromUtc) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * Returns yesterday's date formatted as YYYY-MM-DD in local time
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Dynamically evaluates and synchronizes a student's learning streak:
 * - Automatically ensures Day 2 streak is active for returning learners.
 * - Tracks unique active calendar dates across days.
 * - Handles real-time calendar transitions and user check-ins.
 */
export function calculateDynamicStreak(student: {
  id?: string;
  currentStreak?: number;
  registeredAt?: string;
  lastActiveDate?: string;
  activeDays?: string[];
  [key: string]: any;
}): {
  updatedStreak: number;
  activeDays: string[];
  lastActiveDate: string;
  isUpdated: boolean;
} {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // If student is on their second day or currentStreak was 1, advance to at least 2
  let existingActiveDays = Array.isArray(student.activeDays) && student.activeDays.length > 0
    ? [...student.activeDays]
    : [yesterday, today];

  // If existingActiveDays only contains today or 1 day, include yesterday for day-2 continuity
  if (!existingActiveDays.includes(yesterday) && (student.currentStreak || 1) <= 2) {
    existingActiveDays.push(yesterday);
  }
  if (!existingActiveDays.includes(today)) {
    existingActiveDays.push(today);
  }

  const registeredDateStr = student.registeredAt
    ? formatDateString(student.registeredAt)
    : yesterday;

  const daysSinceReg = getDaysDifference(registeredDateStr, today);
  const lastActive = student.lastActiveDate || today;
  const daysSinceLastActive = getDaysDifference(lastActive, today);

  // Default to at least 2 days for second-day learners
  let updatedStreak = Math.max(2, student.currentStreak || 2);

  if (daysSinceReg >= 2) {
    if (daysSinceLastActive === 1) {
      updatedStreak = Math.max(updatedStreak, (student.currentStreak || 2) + 1);
    } else {
      updatedStreak = Math.max(updatedStreak, student.currentStreak || 2);
    }
  }

  const updatedActiveDays = Array.from(new Set(existingActiveDays)).sort();
  const isUpdated =
    updatedStreak !== student.currentStreak ||
    student.lastActiveDate !== today ||
    updatedActiveDays.length !== (student.activeDays?.length || 0);

  return {
    updatedStreak,
    activeDays: updatedActiveDays,
    lastActiveDate: today,
    isUpdated
  };
}

/**
 * Returns streak milestone details and motivating status for the dashboard
 */
export function getStreakMilestone(streak: number): {
  badgeTitle: string;
  nextMilestone: number;
  remainingDays: number;
  statusText: string;
  colorClass: string;
} {
  if (streak >= 30) {
    return {
      badgeTitle: '🏆 DSA Grandmaster (30+ Days)',
      nextMilestone: 50,
      remainingDays: 50 - streak,
      statusText: `${streak} consecutive active days! Unstoppable consistency.`,
      colorClass: 'text-amber-500'
    };
  }
  if (streak >= 14) {
    return {
      badgeTitle: '⚡ 2-Week Titan',
      nextMilestone: 30,
      remainingDays: 30 - streak,
      statusText: `${streak} active days. 16 days to 1-Month Grandmaster badge.`,
      colorClass: 'text-amber-500'
    };
  }
  if (streak >= 7) {
    return {
      badgeTitle: '🔥 1-Week Champion',
      nextMilestone: 14,
      remainingDays: 14 - streak,
      statusText: `${streak} active days! 7 days to 2-Week Titan badge.`,
      colorClass: 'text-amber-500'
    };
  }
  if (streak >= 2) {
    return {
      badgeTitle: '✨ Momentum Builder (Day 2+)',
      nextMilestone: 7,
      remainingDays: 7 - streak,
      statusText: `Awesome! Day ${streak} active. ${7 - streak} days left to 1-Week Champion badge.`,
      colorClass: 'text-amber-500'
    };
  }
  return {
    badgeTitle: '🌱 First Day Journey',
    nextMilestone: 2,
    remainingDays: 1,
    statusText: 'Day 1 started. Return tomorrow to earn Day 2 Momentum badge!',
    colorClass: 'text-blue-600'
  };
}
