import { Topic, AssessmentQuestion, StudentProfile, MistakeDNA, LearningTwinMetrics, RescuePlan } from '../types';

export const INITIAL_STUDENTS: StudentProfile[] = [];


export const TOPICS: Record<string, Topic> = {
  arrays: {
    id: 'arrays',
    name: 'Arrays',
    category: 'Linear Structures',
    mastery: 92,
    status: 'mastered',
    prerequisites: [],
    directDependents: ['searching'],
    recentAccuracy: 95,
    questionsAttempted: 38,
    commonMistakes: ['Off-by-one boundary', 'Index out of bounds'],
    recommendedDifficulty: 'Hard'
  },
  searching: {
    id: 'searching',
    name: 'Searching',
    category: 'Algorithms',
    mastery: 81,
    status: 'proficient',
    prerequisites: ['arrays'],
    directDependents: ['binary_search'],
    recentAccuracy: 85,
    questionsAttempted: 24,
    commonMistakes: ['Unsorted array assumption', 'Linear search when binary search is needed'],
    recommendedDifficulty: 'Medium'
  },
  binary_search: {
    id: 'binary_search',
    name: 'Binary Search',
    category: 'Divide & Conquer',
    mastery: 63,
    status: 'developing',
    prerequisites: ['searching', 'recursion'],
    directDependents: ['bst'],
    recentAccuracy: 64,
    questionsAttempted: 29,
    detectedRisk: 'Struggles with mid calculation and recursive termination',
    commonMistakes: ['Integer overflow in mid = (low + high) / 2', 'Infinite loop when low == high'],
    recommendedDifficulty: 'Medium'
  },
  trees: {
    id: 'trees',
    name: 'Binary Trees',
    category: 'Hierarchical Structures',
    mastery: 79,
    status: 'proficient',
    prerequisites: ['recursion'],
    directDependents: ['bst', 'advanced_trees'],
    recentAccuracy: 78,
    questionsAttempted: 26,
    commonMistakes: ['Confusing height with depth', 'Not handling null leaf pointers'],
    recommendedDifficulty: 'Medium'
  },
  recursion: {
    id: 'recursion',
    name: 'Recursion',
    category: 'Algorithmic Paradigm',
    mastery: 42,
    status: 'needs_attention',
    prerequisites: [],
    directDependents: ['binary_search', 'trees', 'bst'],
    recentAccuracy: 40,
    questionsAttempted: 35,
    detectedRisk: 'Root blocker for all tree traversals and BST validation logic',
    commonMistakes: [
      'Missing base case condition',
      'Incorrect recursive step accumulation',
      'Confusing call stack unwinding with forward execution'
    ],
    recommendedDifficulty: 'Easy'
  },
  bst: {
    id: 'bst',
    name: 'Binary Search Trees (BST)',
    category: 'Non-Linear Structures',
    mastery: 43,
    status: 'needs_attention',
    prerequisites: ['trees', 'binary_search', 'recursion'],
    directDependents: ['advanced_trees'],
    recentAccuracy: 45,
    questionsAttempted: 22,
    detectedRisk: 'Recursion weakness directly impairs recursive search and insert implementations',
    commonMistakes: [
      'Only checking immediate child values instead of whole subtree limits',
      'Assuming in-order traversal creates balanced tree',
      'Recursive return value dropped in helper calls'
    ],
    recommendedDifficulty: 'Easy'
  },
  advanced_trees: {
    id: 'advanced_trees',
    name: 'Advanced Trees (AVL / Red-Black)',
    category: 'Self-Balancing Structures',
    mastery: 25,
    status: 'needs_attention',
    prerequisites: ['bst'],
    directDependents: [],
    recentAccuracy: 25,
    questionsAttempted: 8,
    detectedRisk: 'Blocked by prerequisite weaknesses in BST and Recursion',
    commonMistakes: ['Incorrect rotation pointers', 'Balance factor calculation off by 1'],
    recommendedDifficulty: 'Easy'
  }
};

export const DIAGNOSTIC_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    topicId: 'bst',
    topicName: 'Binary Search Trees',
    prerequisiteTested: 'searching',
    difficulty: 'Easy',
    prompt: 'What is the time complexity of searching for an element in a balanced Binary Search Tree with n nodes?',
    options: [
      { id: 'q1-a', text: 'O(1)', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Confused with hash map lookup' },
      { id: 'q1-b', text: 'O(log n)', isCorrect: true },
      { id: 'q1-c', text: 'O(n)', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'True only for degenerate/skewed trees, not balanced' },
      { id: 'q1-d', text: 'O(n²)', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Overestimated polynomial bound' }
    ],
    explanation: 'In a balanced BST, each comparison halves the remaining search space, yielding O(log n) time complexity, equivalent to binary search.',
    rootGapIfWrong: 'searching'
  },
  {
    id: 'q2',
    topicId: 'recursion',
    topicName: 'Recursion',
    prerequisiteTested: 'recursion',
    difficulty: 'Medium',
    prompt: 'Consider this recursive snippet intended to compute sum of numbers from 1 to n:\nfunction sum(n) { return n + sum(n - 1); }\nWhat happens when sum(5) is invoked?',
    codeSnippet: 'function sum(n) {\n  return n + sum(n - 1);\n}',
    options: [
      { id: 'q2-a', text: 'It returns 15 correctly', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Assumed loop terminates automatically' },
      { id: 'q2-b', text: 'Stack overflow exception occurs because there is no base case', isCorrect: true },
      { id: 'q2-c', text: 'It returns 0 because negative numbers cancel out', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Ignored call stack mechanics' },
      { id: 'q2-d', text: 'Syntax error during compilation', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Grammar is valid JS/TS' }
    ],
    explanation: 'A recursive function must have a terminating base condition (e.g., if (n <= 1) return n;). Without it, calls continue endlessly until the call stack runs out of memory.',
    rootGapIfWrong: 'recursion'
  },
  {
    id: 'q3',
    topicId: 'bst',
    topicName: 'Binary Search Trees',
    prerequisiteTested: 'recursion',
    difficulty: 'Medium',
    prompt: 'Which traversal of a valid Binary Search Tree always produces values in strictly sorted ascending order?',
    options: [
      { id: 'q3-a', text: 'Pre-order (Root, Left, Right)', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Pre-order yields root first, not sorted sequence' },
      { id: 'q3-b', text: 'In-order (Left, Root, Right)', isCorrect: true },
      { id: 'q3-c', text: 'Post-order (Left, Right, Root)', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Post-order yields leaves before roots' },
      { id: 'q3-d', text: 'Level-order (BFS queue traversal)', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Level-order traverses tier by tier' }
    ],
    explanation: 'In-order traversal visits the left subtree (all smaller values), then root, then right subtree (all larger values), producing an ascending list.',
    rootGapIfWrong: 'trees'
  },
  {
    id: 'q4',
    topicId: 'bst',
    topicName: 'Binary Search Trees',
    prerequisiteTested: 'recursion',
    difficulty: 'Hard',
    prompt: 'Why does this recursive helper fail to correctly validate a general BST?\nfunction isValid(node) {\n  if (!node) return true;\n  if (node.left && node.left.val >= node.val) return false;\n  if (node.right && node.right.val <= node.val) return false;\n  return isValid(node.left) && isValid(node.right);\n}',
    codeSnippet: 'function isValid(node) {\n  if (!node) return true;\n  if (node.left && node.left.val >= node.val) return false;\n  if (node.right && node.right.val <= node.val) return false;\n  return isValid(node.left) && isValid(node.right);\n}',
    options: [
      { id: 'q4-a', text: 'It checks only immediate child nodes rather than passing min/max boundaries down the recursive call stack', isCorrect: true },
      { id: 'q4-b', text: 'The base case `!node` should return false instead of true', isCorrect: false, misconceptionType: 'prerequisite', misconceptionNote: 'Shows deep confusion about null leaf base cases' },
      { id: 'q4-c', text: 'It fails because Binary Search Trees cannot have duplicate values', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Inequalities already disallow duplicates, not root flaw' },
      { id: 'q4-d', text: 'It produces a stack overflow on every tree', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Base case exists, so it terminates' }
    ],
    explanation: 'A node in a left subtree could be smaller than its parent but greater than an ancestor root (e.g. Root=10, Left=5, Left.Right=15). Proper validation requires passing allowable (min, max) ranges down the recursive calls.',
    rootGapIfWrong: 'recursion'
  },
  {
    id: 'q5',
    topicId: 'recursion',
    topicName: 'Recursion',
    prerequisiteTested: 'recursion',
    difficulty: 'Medium',
    prompt: 'In a recursive function with two branching calls like fibonacci(n) = fib(n-1) + fib(n-2), what is the auxiliary call stack space complexity (without memoization)?',
    options: [
      { id: 'q5-a', text: 'O(2ⁿ)', isCorrect: false, misconceptionType: 'application', misconceptionNote: 'Confused time complexity (number of total calls) with stack memory depth' },
      { id: 'q5-b', text: 'O(n)', isCorrect: true },
      { id: 'q5-c', text: 'O(log n)', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Call stack depth is proportional to maximum tree branch height n' },
      { id: 'q5-d', text: 'O(1)', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Recursion inherently utilizes stack memory' }
    ],
    explanation: 'While the total number of operations is O(2ⁿ), the maximum depth of the call stack at any one moment is determined by the longest active path from root to leaf, which is O(n).',
    rootGapIfWrong: 'recursion'
  },
  {
    id: 'q6',
    topicId: 'binary_search',
    topicName: 'Binary Search',
    prerequisiteTested: 'arrays',
    difficulty: 'Medium',
    prompt: 'In a binary search implementation on a sorted array of length n, why is `mid = low + Math.floor((high - low) / 2)` preferred over `mid = Math.floor((low + high) / 2)` in languages like Java or C++?',
    options: [
      { id: 'q6-a', text: 'It calculates the position in half the CPU clock cycles', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Arithmetic operation count is virtually identical' },
      { id: 'q6-b', text: 'It prevents integer overflow when `low + high` exceeds maximum 32-bit signed integer value', isCorrect: true },
      { id: 'q6-c', text: 'It handles negative numbers whereas the other fails', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Indices are non-negative' },
      { id: 'q6-d', text: 'It guarantees the search finishes in exactly O(1) time', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Binary search remains O(log n)' }
    ],
    explanation: 'When both low and high are very large (close to 2^31 - 1), adding them causes integer overflow into negative numbers, leading to an index out of bounds error.',
    rootGapIfWrong: 'arrays'
  },
  {
    id: 'q7',
    topicId: 'trees',
    topicName: 'Binary Trees',
    prerequisiteTested: 'recursion',
    difficulty: 'Easy',
    prompt: 'What is the maximum number of nodes in a binary tree of height h (where height of single root node is 1)?',
    options: [
      { id: 'q7-a', text: '2ʰ - 1', isCorrect: true },
      { id: 'q7-b', text: '2ʰ', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Off-by-one; forgot to subtract 1' },
      { id: 'q7-c', text: '2^(h - 1)', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'That is the maximum nodes at only the h-th level' },
      { id: 'q7-d', text: 'h²', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Trees grow exponentially, not quadratically' }
    ],
    explanation: 'Summing nodes at each level: 2^0 + 2^1 + ... + 2^(h-1) = 2^h - 1.',
    rootGapIfWrong: 'trees'
  },
  {
    id: 'q8',
    topicId: 'bst',
    topicName: 'Binary Search Trees',
    prerequisiteTested: 'recursion',
    difficulty: 'Hard',
    prompt: 'When deleting a node with two children from a BST, which replacement maintains the BST ordering property without violating tree structure?',
    options: [
      { id: 'q8-a', text: 'Either the In-order Predecessor (max of left subtree) or In-order Successor (min of right subtree)', isCorrect: true },
      { id: 'q8-b', text: 'Always replace with the tree’s root node', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Moving root breaks the rest of the tree hierarchy' },
      { id: 'q8-c', text: 'Any arbitrary leaf node from either subtree', isCorrect: false, misconceptionType: 'prerequisite', misconceptionNote: 'Ignores the ordering invariant' },
      { id: 'q8-d', text: 'The leftmost node of the entire tree', isCorrect: false, misconceptionType: 'application', misconceptionNote: 'The global minimum is smaller than the deleted node’s left children' }
    ],
    explanation: 'The in-order predecessor or in-order successor is guaranteed to be greater than all elements in the left subtree and smaller than all elements in the right subtree.',
    rootGapIfWrong: 'bst'
  },
  {
    id: 'q9',
    topicId: 'recursion',
    topicName: 'Recursion',
    prerequisiteTested: 'recursion',
    difficulty: 'Hard',
    prompt: 'Suppose a student writes a recursive function to compute the height of a binary tree:\nfunction treeHeight(node) {\n  if (!node) return 0;\n  let leftH = treeHeight(node.left);\n  let rightH = treeHeight(node.right);\n  return Math.max(leftH, rightH); // Line X\n}\nWhy does this function return 0 for ANY valid non-empty tree?',
    codeSnippet: 'function treeHeight(node) {\n  if (!node) return 0;\n  let leftH = treeHeight(node.left);\n  let rightH = treeHeight(node.right);\n  return Math.max(leftH, rightH); // Line X\n}',
    options: [
      { id: 'q9-a', text: 'Line X forgets to add +1 to account for the current node’s edge/level contribution', isCorrect: true },
      { id: 'q9-b', text: 'The base case `!node` should return -1 instead of 0', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Returning -1 measures height in edges, but returning 0 without adding +1 collapses all answers to 0' },
      { id: 'q9-c', text: 'Math.max cannot accept integer values in JavaScript', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Math.max is standard JS' },
      { id: 'q9-d', text: 'The left subtree and right subtree cannot be called in the same scope', isCorrect: false, misconceptionType: 'prerequisite', misconceptionNote: 'Double recursive calls are standard pattern' }
    ],
    explanation: 'Without adding +1 at each returning stack frame, all base cases return 0, and Math.max(0, 0) accumulates to 0 regardless of how deep the tree is.',
    rootGapIfWrong: 'recursion'
  },
  {
    id: 'q10',
    topicId: 'advanced_trees',
    topicName: 'Advanced Trees',
    prerequisiteTested: 'bst',
    difficulty: 'Hard',
    prompt: 'In an AVL Tree, if an insertion into the left child of the right child of node P causes an imbalance, which rotation sequence restores height balance?',
    options: [
      { id: 'q10-a', text: 'Right rotation at P', isCorrect: false, misconceptionType: 'conceptual', misconceptionNote: 'Right-Left case requires double rotation' },
      { id: 'q10-b', text: 'Right rotation at Right Child, followed by Left rotation at P (RL Rotation)', isCorrect: true },
      { id: 'q10-c', text: 'Left rotation at P followed by Right rotation at P', isCorrect: false, misconceptionType: 'careless', misconceptionNote: 'Incorrect rotation pivot' },
      { id: 'q10-d', text: 'No rotation needed; BST auto-rebalances', isCorrect: false, misconceptionType: 'prerequisite', misconceptionNote: 'Standard BST does not self-balance' }
    ],
    explanation: 'A Right-Left (RL) insertion forms a zig-zag imbalance. A single rotation cannot fix it; it requires a right rotation on the child followed by a left rotation on the parent.',
    rootGapIfWrong: 'bst'
  }
];

export const MISTAKE_DNA_DATA: MistakeDNA = {
  conceptual: 38,
  application: 27,
  prerequisite: 21,
  careless: 14,
  recurringPatterns: [
    'Complexity analysis of nested calls',
    'Recursive state passing across stack frames',
    'Multi-step application of tree invariants'
  ],
  strongPatterns: [
    'Direct formula memorization (O(log n), height equations)',
    'Basic array indexing and linear searches',
    'Direct concept identification'
  ],
  coreInsight:
    'You perform strongly on direct conceptual questions but struggle when multiple concepts must be applied together, particularly when recursive problem decomposition is required.'
};

export const LEARNING_TWIN_DATA: LearningTwinMetrics = {
  knowledge: 68,
  application: 51,
  retention: 63,
  consistency: 74,
  currentBottleneck: 'Recursion',
  learningBehaviors: [
    'Strong conceptual recall on foundational definitions',
    'Moderate application ability on single-step mechanics',
    'Weak multi-step reasoning when tracing call stacks',
    'Improving consistency with regular daily practice'
  ],
  recommendedAction: 'Complete the 8-minute Recursion Recovery Path.'
};

export const RESCUE_PLANS: Record<15 | 30 | 60, RescuePlan> = {
  15: {
    durationMinutes: 15,
    items: [
      { duration: '05 min', title: 'Base Case vs Recursive Step', topic: 'Recursion', type: 'Concept Review', summary: 'Visualizing call stack termination and return flow.' },
      { duration: '05 min', title: 'BST Invariant Range Tracking', topic: 'BST', type: 'Step-by-Step', summary: 'Why passing min/max boundaries is strictly necessary.' },
      { duration: '03 min', title: 'Targeted High-Leverage Drill', topic: 'Recursion', type: 'Targeted Practice', summary: '3 rapid-fire questions on stack unwinding.' },
      { duration: '02 min', title: 'Instant Confidence Re-check', topic: 'Synthesis', type: 'Reassessment', summary: 'Verify prerequisite stabilization.' }
    ],
    highestImpactConcepts: [
      { name: 'Recursion', impact: 'High', reason: 'Unblocks 3 downstream tree topics.' },
      { name: 'BST Invariant', impact: 'High', reason: 'Immediate +18% accuracy bump on validation.' }
    ]
  },
  30: {
    durationMinutes: 30,
    items: [
      { duration: '08 min', title: 'Recursion Fundamentals & Call Stacks', topic: 'Recursion', type: 'Concept Review', summary: 'Frame-by-frame memory model and inductive proofs.' },
      { duration: '07 min', title: 'Binary Search Midpoint & Termination', topic: 'Binary Search', type: 'Step-by-Step', summary: 'Handling boundaries and avoiding infinite recursion.' },
      { duration: '08 min', title: 'BST Operations & Range Propagation', topic: 'BST Operations', type: 'Step-by-Step', summary: 'Recursive inserts, in-order traversal, and range checks.' },
      { duration: '05 min', title: 'Targeted Multi-step Practice', topic: 'Synthesis', type: 'Targeted Practice', summary: 'Adaptive questions tuned to your exact mistake DNA.' },
      { duration: '02 min', title: 'Final Reassessment & Twin Update', topic: 'Verification', type: 'Reassessment', summary: 'Real-time re-scoring of knowledge graph mastery.' }
    ],
    highestImpactConcepts: [
      { name: 'Recursion', impact: 'High', reason: 'Primary root gap causing 62% of tree errors.' },
      { name: 'BST Operations', impact: 'High', reason: 'Direct target for upcoming exam syllabus.' },
      { name: 'Complexity Analysis', impact: 'Medium', reason: 'Prevents confusing stack depth with operation count.' }
    ]
  },
  60: {
    durationMinutes: 60,
    items: [
      { duration: '15 min', title: 'Deep Dive: Recursive Tree Decomposition', topic: 'Recursion', type: 'Concept Review', summary: 'Mastering subproblem solutions and accumulator returns.' },
      { duration: '12 min', title: 'Binary Search to BST Mastery Bridge', topic: 'Binary Search', type: 'Step-by-Step', summary: 'Mapping array search principles to non-linear binary nodes.' },
      { duration: '15 min', title: 'Full BST Lifecycle: Insert, Delete, Validate', topic: 'BST', type: 'Step-by-Step', summary: 'Two-child deletion with predecessor/successor exchange.' },
      { duration: '12 min', title: 'Comprehensive Adaptive Gauntlet', topic: 'Adaptive Practice', type: 'Targeted Practice', summary: '6 questions with auto-adjusting difficulty.' },
      { duration: '06 min', title: 'Mastery Certification & Twin Sync', topic: 'Certification', type: 'Reassessment', summary: 'Upgrades status from Needs Attention to Proficient.' }
    ],
    highestImpactConcepts: [
      { name: 'Recursion', impact: 'High', reason: 'Fundamental paradigm shift required for advanced DS.' },
      { name: 'BST Operations', impact: 'High', reason: 'Essential prerequisite for AVL/Red-Black trees.' },
      { name: 'Complexity Analysis', impact: 'Medium', reason: 'Crucial for coding interview benchmarks.' }
    ]
  }
};

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'ai' as const,
    text: "Hello! I've analyzed your Tree & Recursion diagnostic assessment. While your raw score was 6/10, your error signature points to a specific prerequisite gap: **recursive problem decomposition** rather than tree definitions.",
    timestamp: '10:42 AM',
    callout: {
      type: 'prerequisite_alert' as const,
      title: 'Prerequisite Insight Detected',
      content: 'Your BST validation error on Q4 occurred because child nodes were checked in isolation instead of carrying recursive boundaries (min, max) through the stack.'
    }
  },
  {
    id: 'msg-2',
    sender: 'user' as const,
    text: 'Explain recursion simply. Why does it feel so confusing when applied to trees?',
    timestamp: '10:43 AM'
  },
  {
    id: 'msg-3',
    sender: 'ai' as const,
    text: "You already understand basic loops. Let's connect recursion to something familiar.\n\nIn a loop, you repeat steps in a single timeline forward. In a tree, however, a node has **two futures**: go left AND go right. A standard loop can't be in two places at once without a stack.\n\nRecursion isn't doing the work yourself—it's **delegating to identical mini-assistants**:\n1. Base Case: If there's no node, you owe nothing (return 0 or true).\n2. Trust the Left: Ask the left assistant for its result.\n3. Trust the Right: Ask the right assistant for its result.\n4. Combine: Add your 1 to whichever was taller.\n\nNotice you never need to simulate 100 nodes in your head! You only ever write the script for ONE node.",
    timestamp: '10:43 AM',
    callout: {
      type: 'reasoning' as const,
      title: 'Mental Model Shift',
      content: 'Never mentally trace deep call stacks. Use Mathematical Induction: write for node n, assume n.left and n.right return truth, then combine.'
    }
  }
];

export const ADAPTIVE_PRACTICE_QUESTIONS = [
  {
    id: 'ap-1',
    topic: 'Recursion',
    initialDifficulty: 'Medium' as const,
    prompt: 'What is the minimum condition required for any recursive function to guarantee termination?',
    options: [
      { id: 'ap-1-a', text: 'At least one base case that does not trigger another recursive call', isCorrect: true },
      { id: 'ap-1-b', text: 'A while loop inside the function body', isCorrect: false },
      { id: 'ap-1-c', text: 'Passing arguments by reference', isCorrect: false },
      { id: 'ap-1-d', text: 'Allocating array memory on the heap', isCorrect: false }
    ],
    aiFeedbackIfWrong: 'Your approach is close, but you confused loop mechanics with base case termination.',
    aiFeedbackIfCorrect: 'Spot on! Without at least one reachable base case, recursive calls consume the call stack infinitely.'
  },
  {
    id: 'ap-2',
    topic: 'Recursion',
    initialDifficulty: 'Easy' as const,
    prompt: 'Look at this code:\nfunction countdown(n) {\n  if (n <= 0) return;\n  console.log(n);\n  countdown(n - 1);\n}\nWhat is printed for countdown(3)?',
    options: [
      { id: 'ap-2-a', text: '3, 2, 1', isCorrect: true },
      { id: 'ap-2-b', text: '1, 2, 3', isCorrect: false },
      { id: 'ap-2-c', text: '3, 2, 1, 0', isCorrect: false },
      { id: 'ap-2-d', text: 'Infinite loop', isCorrect: false }
    ],
    aiFeedbackIfWrong: 'Careful with the print position! The console.log runs BEFORE the recursive call, outputting in descending order.',
    aiFeedbackIfCorrect: 'Exact! Because the print happens before delegating to countdown(n-1), it prints in forward descending sequence.'
  },
  {
    id: 'ap-3',
    topic: 'Binary Search Trees',
    initialDifficulty: 'Medium' as const,
    prompt: 'In a BST, if you search for target = 24 and current node = 30, which child must you recursively traverse?',
    options: [
      { id: 'ap-3-a', text: 'Left child, because all keys in the left subtree are < 30', isCorrect: true },
      { id: 'ap-3-b', text: 'Right child, because 24 is closer to 30', isCorrect: false },
      { id: 'ap-3-c', text: 'Both children simultaneously', isCorrect: false },
      { id: 'ap-3-d', text: 'Parent node', isCorrect: false }
    ],
    aiFeedbackIfWrong: 'Remember the core BST invariant: everything smaller than the current node lives strictly in the left subtree.',
    aiFeedbackIfCorrect: 'Perfect! Since 24 < 30, the BST ordering invariant guarantees 24 can only exist in the left branch.'
  },
  {
    id: 'ap-4',
    topic: 'BST Validation',
    initialDifficulty: 'Hard' as const,
    prompt: 'When recursively validating a BST with signature `check(node, minVal, maxVal)`, what parameters are passed to `check(node.right, ...)`?',
    options: [
      { id: 'ap-4-a', text: 'check(node.right, node.val, maxVal)', isCorrect: true },
      { id: 'ap-4-b', text: 'check(node.right, minVal, node.val)', isCorrect: false },
      { id: 'ap-4-c', text: 'check(node.right, -Infinity, +Infinity)', isCorrect: false },
      { id: 'ap-4-d', text: 'check(node.right, null, null)', isCorrect: false }
    ],
    aiFeedbackIfWrong: 'Notice that entering the right subtree sets a new floor! The right child must be strictly greater than node.val, while still obeying the ancestor ceiling maxVal.',
    aiFeedbackIfCorrect: 'Brilliant deduction! The right child must exceed node.val (new lower bound) while remaining beneath maxVal.'
  }
];
