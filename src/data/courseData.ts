export interface CourseChapter {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  lessons: string[];
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  chapters: CourseChapter[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  modules: CourseModule[];
}

export const SEEDED_COURSES: Course[] = [
  {
    id: 'data-structures-algorithms',
    title: 'Data Structures & Algorithms',
    category: 'Computer Science',
    description: 'Build strong problem-solving foundations with guided concepts, examples, and practice.',
    level: 'Intermediate',
    duration: '8 weeks',
    progress: 63,
    modules: [
      {
        id: 'foundations',
        title: 'Foundations',
        description: 'Learn the mental models behind efficient problem solving.',
        chapters: [
          { id: 'complexity', title: 'Complexity Made Practical', summary: 'Read runtime and space complexity with confidence.', durationMinutes: 18, lessons: ['Big-O intuition', 'Comparing growth rates', 'Space complexity'] , completed: true },
          { id: 'recursion', title: 'Recursion Recovery', summary: 'Break complex problems into smaller, repeatable steps.', durationMinutes: 22, lessons: ['Base cases', 'Call stacks', 'Tracing recursive code'] },
        ],
      },
      {
        id: 'trees',
        title: 'Trees & Search',
        description: 'Understand hierarchical data and search strategies.',
        chapters: [
          { id: 'trees-intro', title: 'Tree Concepts', summary: 'Explore nodes, edges, traversals, and tree vocabulary.', durationMinutes: 20, lessons: ['Tree anatomy', 'Depth and height', 'Traversal patterns'], completed: true },
          { id: 'binary-search-trees', title: 'Binary Search Trees', summary: 'Use ordering rules to search and update a BST.', durationMinutes: 25, lessons: ['BST invariant', 'Search and insertion', 'Common mistakes'] },
          { id: 'tree-practice', title: 'Tree Practice Lab', summary: 'Apply tree concepts to progressively harder problems.', durationMinutes: 30, lessons: ['Choose a traversal', 'Debug a solution', 'Reflect on trade-offs'] },
        ],
      },
      {
        id: 'algorithms',
        title: 'Core Algorithms',
        description: 'Turn patterns into reliable solutions.',
        chapters: [
          { id: 'binary-search', title: 'Binary Search', summary: 'Spot monotonic structure and search efficiently.', durationMinutes: 24, lessons: ['Search space', 'Loop invariants', 'Edge cases'] },
        ],
      },
    ],
  },
  {
    id: 'programming-fundamentals',
    title: 'Programming Fundamentals',
    category: 'Computer Science',
    description: 'A practical refresher on the building blocks of writing clear programs.',
    level: 'Beginner',
    duration: '6 weeks',
    progress: 18,
    modules: [
      {
        id: 'core-concepts',
        title: 'Core Concepts',
        description: 'Build confidence with variables, control flow, and functions.',
        chapters: [
          { id: 'variables', title: 'Variables & Data', summary: 'Model information with the right data types.', durationMinutes: 15, lessons: ['Values and types', 'Naming clearly'] },
          { id: 'control-flow', title: 'Control Flow', summary: 'Make programs respond to conditions and repetition.', durationMinutes: 20, lessons: ['Conditions', 'Loops', 'Guard clauses'] },
        ],
      },
    ],
  },
];

export const getCourse = (courseId: string) => SEEDED_COURSES.find((course) => course.id === courseId) || SEEDED_COURSES[0];

export const getChapter = (course: Course, chapterId: string) => {
  for (const module of course.modules) {
    const chapter = module.chapters.find((item) => item.id === chapterId);
    if (chapter) return chapter;
  }
  return course.modules[0].chapters[0];
};
