import { StudyBuddyPairing, LearningFocus, StudentProfile, CollaborationMode } from '../types';

export interface FocusTopicPreset {
  id: string;
  name: string;
  category: string;
  defaultSubtopics: string[];
  sampleNotes: string;
  starterCodeSnippet: string;
}

export const STUDY_BUDDY_TOPIC_PRESETS: FocusTopicPreset[] = [
  {
    id: 'recursion',
    name: 'Recursion & Call Stacks',
    category: 'Algorithmic Paradigm',
    defaultSubtopics: [
      'Stack frame unwinding & multi-branch tree recursion',
      'Recursive base case omission defense',
      'Tracing local variable state vs parent frame memory'
    ],
    sampleNotes: 'Traced through tree recursions. Looking for someone to whiteboard call stack frames and base returns together!',
    starterCodeSnippet: `// Problem: Maximum Depth of Binary Tree
// Topic: Recursion Call Stack Unwinding

function maxDepth(root) {
  // Base case: empty tree has depth 0
  if (root === null) {
    return 0;
  }
  
  // Recursively find depth of subtrees
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  
  // Return current node + max of subtree branches
  return Math.max(leftDepth, rightDepth) + 1;
}

// Test call: maxDepth({ val: 3, left: { val: 9 }, right: { val: 20 } })
`
  },
  {
    id: 'trees',
    name: 'Binary Search Trees',
    category: 'Hierarchical Structures',
    defaultSubtopics: [
      'BST min-max subtree invariant propagation',
      'Lowest Common Ancestor in BST vs Binary Tree',
      'In-order traversal sorted property verification'
    ],
    sampleNotes: 'Eliminating subtle boundary conditions in isValidBST. Doing mock technical interviews for FAANG prep!',
    starterCodeSnippet: `// Problem: Validate Binary Search Tree
// Topic: Subtree Global Range Invariants

function isValidBST(root, min = -Infinity, max = Infinity) {
  // Base case: empty subtree is valid BST
  if (root === null) return true;
  
  // Invariant check: node value must lie strictly within (min, max)
  if (root.val <= min || root.val >= max) {
    return false;
  }
  
  // Recurse: left subtree must be < root.val, right must be > root.val
  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max);
}
`
  },
  {
    id: 'binary_search',
    name: 'Binary Search & Invariants',
    category: 'Divide & Conquer',
    defaultSubtopics: [
      'Integer overflow in mid calculation and edge boundaries',
      'Search in rotated sorted array with duplicates',
      'Lower bound vs upper bound pointer termination'
    ],
    sampleNotes: 'Practicing lower_bound, upper_bound, and search in rotated sorted array. Ready for an accountability Pomodoro sprint.',
    starterCodeSnippet: `// Problem: Safe Binary Search Template
// Topic: Pointer Invariants & Overflow Defense

function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  
  while (low <= high) {
    // Avoid integer overflow: low + Math.floor((high - low) / 2)
    const mid = low + Math.floor((high - low) / 2);
    
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  return -1; // Not found
}
`
  },
  {
    id: 'searching',
    name: 'Graph & BFS Traversal',
    category: 'Algorithms',
    defaultSubtopics: [
      'Visited sets vs cycle tracking in graphs',
      'Bidirectional BFS level-order optimization',
      'Topological sort with Kahn\'s algorithm and in-degrees'
    ],
    sampleNotes: 'Working on BFS visited queue tracking to eliminate redundant queue exploration.',
    starterCodeSnippet: `// Problem: BFS Traversal with Strict Visited Set
// Topic: Visited State Synchronization

function bfsShortestPath(graph, startNode, targetNode) {
  const queue = [[startNode, 0]];
  const visited = new Set([startNode]); // CRITICAL: mark visited on enqueue!
  
  while (queue.length > 0) {
    const [current, dist] = queue.shift();
    if (current === targetNode) return dist;
    
    for (const neighbor of (graph[current] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor); // Mark immediately
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  
  return -1;
}
`
  },
  {
    id: 'arrays',
    name: 'Dynamic Programming & Memory',
    category: 'Linear Structures & DP',
    defaultSubtopics: [
      'Rolling array buffer space optimization O(N) to O(1)',
      '1D vs 2D memoization state compression',
      'Two-pointer sliding window invariants'
    ],
    sampleNotes: 'Mastered 2D DP recurrence relations; happy to explain recursion trees to any buddy while practicing rolling array memory tricks.',
    starterCodeSnippet: `// Problem: House Robber / Fibonacci Space Optimization
// Topic: Rolling Array Buffer (O(N) -> O(1) space)

function robHouses(nums) {
  if (nums.length === 0) return 0;
  let prev2 = 0; // max profit up to i-2
  let prev1 = 0; // max profit up to i-1
  
  for (const num of nums) {
    const current = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}
`
  }
];

export const INITIAL_STUDY_BUDDY_PAIRINGS: StudyBuddyPairing[] = [
  {
    id: 'pairing-rohan-incoming',
    studentAId: 'student-rohan-mehta',
    studentAName: 'Rohan Mehta',
    studentAAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    studentAInstitution: 'Delhi Technological University (DTU)',
    studentBId: 'student-aarav-sharma',
    studentBName: 'Aarav Sharma',
    studentBAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    studentBInstitution: 'IIT Bombay',
    topicId: 'recursion',
    topicName: 'Recursion Base Conditions',
    subtopicOrGoal: 'Recursion Call Stack Unwinding & Base Case Defense',
    mode: 'live_coding',
    status: 'pending',
    initiatedBy: 'student-rohan-mehta',
    message: 'Hey! Saw in the cohort feed that you are also focusing on Recursion Call Stacks. Would love to pair debug base cases together on LeetCode #104 & #226!',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    sessionGoal: 'Trace call stack unwinding and resolve Maximum Call Stack Exceeded errors in multi-branch tree recursion.',
    sharedCode: `// Problem: Maximum Depth of Binary Tree
// Pair Debugging Session: Rohan Mehta & Aarav Sharma

function maxDepth(root) {
  // Base case: What happens on an empty node?
  if (root === null) {
    return 0;
  }
  
  // Step 1: Compute left branch depth
  const left = maxDepth(root.left);
  
  // Step 2: Compute right branch depth
  const right = maxDepth(root.right);
  
  // Step 3: Combine with current node (+1)
  return Math.max(left, right) + 1;
}

// Sample test tree: [3, 9, 20, null, null, 15, 7]
const testTree = {
  val: 3,
  left: { val: 9, left: null, right: null },
  right: {
    val: 20,
    left: { val: 15, left: null, right: null },
    right: { val: 7, left: null, right: null }
  }
};

console.log("Tree Max Depth:", maxDepth(testTree));
`,
    sessionNotes: 'Shared Whiteboard Notes:\n- Call Stack Depth = Maximum number of active stack frames before unwinding.\n- When root is null, frame returns 0 to the caller.\n- Next test case: Skewed single-branch linked-list tree.',
    timerSecondsLeft: 25 * 60,
    isTimerRunning: false,
    chatMessages: [
      {
        id: 'msg-init-1',
        senderId: 'student-rohan-mehta',
        senderName: 'Rohan Mehta',
        text: 'Hey! I kept hitting RangeError: Maximum call stack size exceeded on left subtrees. Let me know when you are free to step through the stack frames together!',
        timestamp: '35m ago',
        type: 'text'
      }
    ]
  },
  {
    id: 'pairing-priya-kavya',
    studentAId: 'student-kavya-reddy',
    studentAName: 'Kavya Reddy',
    studentAAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    studentAInstitution: 'IIIT Hyderabad',
    studentBId: 'student-priya-patel',
    studentBName: 'Priya Patel',
    studentBAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    studentBInstitution: 'BITS Pilani',
    topicId: 'trees',
    topicName: 'Binary Search Trees & DP',
    subtopicOrGoal: 'BST Invariant Propagation vs Memoization Boundaries',
    mode: 'mock_interview',
    status: 'completed',
    initiatedBy: 'student-kavya-reddy',
    message: 'Awesome session practicing global bounds propagation down subtrees.',
    createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    sessionGoal: 'Deep dive into isValidBST global min/max bounds and 1D memoization.',
    sessionNotes: 'Priya explained subtree range invariants; Kavya demonstrated rolling buffer memory tricks. Both solved 2 LeetCode Mediums.',
    timerSecondsLeft: 0,
    isTimerRunning: false,
    chatMessages: [
      {
        id: 'msg-k-1',
        senderId: 'student-kavya-reddy',
        senderName: 'Kavya Reddy',
        text: 'Great session today! Propagating min/max down both children completely prevented the invalid child bug.',
        timestamp: 'Yesterday at 4:10 PM',
        type: 'high_five'
      }
    ]
  }
];

/**
 * Intelligent Cognitive Matching Engine:
 * Compares two students to compute compatibility score, synergy classification, and reasons.
 */
export function calculateBuddyMatch(
  currentStudent: StudentProfile,
  candidate: StudentProfile
): {
  score: number;
  synergyType: 'complementary' | 'peer_gap' | 'exam_alignment' | 'general';
  reasons: string[];
} {
  let score = 70; // baseline
  const reasons: string[] = [];
  let synergyType: 'complementary' | 'peer_gap' | 'exam_alignment' | 'general' = 'general';

  // 1. Complementary Mastery Check
  // If candidate is strong in what currentStudent is weak in:
  const candidateFocusTopic = candidate.learningFocus?.topicId || '';
  const currentRootGap = currentStudent.primaryRootGap.toLowerCase();

  const isCandidateStrongInMyGap =
    (currentRootGap.includes('recursion') && candidate.overallMastery >= 75) ||
    (currentRootGap.includes('bst') && (candidate.overallMastery >= 80 || candidate.conceptsMastered > 20));

  if (isCandidateStrongInMyGap) {
    score += 18;
    synergyType = 'complementary';
    reasons.push(`Mastery Synergy: ${candidate.name.split(' ')[0]} has high mastery (${candidate.overallMastery}%) and can mentor you in your root gap.`);
  }

  // 2. Peer Gap Check
  // If both students share the same learning focus or root gap topic:
  const candidateTopicName = candidate.learningFocus?.topicName?.toLowerCase() || '';
  const myFocusTopic = currentStudent.learningFocus?.topicName?.toLowerCase() || '';
  if (
    candidateFocusTopic === currentStudent.learningFocus?.topicId ||
    (candidateTopicName.includes('recursion') && currentRootGap.includes('recursion')) ||
    (candidateTopicName.includes('tree') && currentRootGap.includes('tree'))
  ) {
    score += 15;
    if (synergyType !== 'complementary') {
      synergyType = 'peer_gap';
    }
    reasons.push(`Cohort Co-Learner: Both targeting ${candidate.learningFocus?.topicName || 'Recursion'} base concepts.`);
  }

  // 3. Target Exam or Career Goal Alignment
  if (
    currentStudent.targetExam &&
    candidate.targetExam &&
    (currentStudent.targetExam.toLowerCase().includes('faang') ||
     currentStudent.targetExam.toLowerCase().includes('google') ||
     currentStudent.targetExam.toLowerCase().includes('uber') ||
     currentStudent.targetExam.toLowerCase().includes('placement')) &&
    (candidate.targetExam.toLowerCase().includes('faang') ||
     candidate.targetExam.toLowerCase().includes('google') ||
     candidate.targetExam.toLowerCase().includes('uber') ||
     candidate.targetExam.toLowerCase().includes('sde'))
  ) {
    score += 10;
    if (synergyType === 'general') synergyType = 'exam_alignment';
    reasons.push(`Shared Target: Both preparing for high-bar Tier-1 Technical Placements.`);
  }

  // 4. Activity & Availability Boost
  if (candidate.learningFocus?.availability === 'available_now') {
    score += 8;
    reasons.push(`Online Now: Ready for an immediate live co-study session.`);
  }

  // Cap between 65 and 98
  const finalScore = Math.min(98, Math.max(68, score));

  if (reasons.length === 0) {
    reasons.push(`Cohort Colleague from ${candidate.institution || 'Engineering Network'}.`);
  }

  return {
    score: finalScore,
    synergyType,
    reasons
  };
}
