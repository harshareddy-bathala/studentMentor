/**
 * Centralized Mock Data for Student Mentor AI
 * 
 * This file contains all mock data used throughout the application.
 * Replace these with actual API calls when integrating with backend.
 * 
 * Backend Integration Guide:
 * - Replace exports with API client functions
 * - Add loading states and error handling
 * - Implement caching strategies (React Query, SWR, etc.)
 */

import type {
  StudentProfile,
  DailyCheckIn,
  ActivityLog,
  Homework,
  Test,
  ChatContact,
  PeerMessage,
  Conversation,
  TeacherAlert,
} from './types';

// ============================================================================
// STUDENT PROFILES
// ============================================================================

export const mockStudentProfiles: Record<string, StudentProfile> = {
  'student-1': {
    id: 'student-1',
    name: 'Alex Kumar',
    age: 15,
    grade: '10th Grade',
    gender: 'male',
    
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'],
    academicGoals: 'Achieve 90%+ in board exams and secure admission to top engineering college',
    learningStyle: 'visual',
    
    careerAspirations: 'Build innovative AI products that solve real-world problems',
    dreamJob: 'AI/ML Engineer',
    roleModels: 'Andrew Ng, Demis Hassabis, Fei-Fei Li',
    
    interests: ['Artificial Intelligence', 'Robotics', 'Game Development', 'Mathematics'],
    hobbies: ['Coding', 'Chess', 'Reading sci-fi novels', 'Playing guitar'],
    
    currentGoals: [
      'Master calculus and linear algebra',
      'Complete online ML course',
      'Build 3 portfolio projects',
      'Improve problem-solving speed'
    ],
    shortTermGoals: [
      'Score 95+ in mid-term exams',
      'Finish Python certification',
      'Win school coding competition'
    ],
    longTermGoals: [
      'Get into IIT or top engineering college',
      'Intern at AI research lab',
      'Publish research paper'
    ],
    
    sportsActivities: ['Basketball', 'Yoga'],
    fitnessGoals: 'Maintain regular physical activity 4x per week',
    
    academicChallenges: ['Time management', 'Physics problem-solving speed'],
    personalChallenges: ['Procrastination', 'Test anxiety'],
    mentalHealthConcerns: 'Occasional stress during exam periods',
    
    personalityTraits: ['Curious', 'Analytical', 'Creative', 'Determined'],
    communicationPreference: 'motivational',
    
    createdAt: new Date('2024-09-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// ============================================================================
// DAILY CHECK-INS
// ============================================================================

export const generateMockCheckIns = (studentId: string, days: number = 14): DailyCheckIn[] => {
  const checkIns: DailyCheckIn[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate varied but realistic data
    const moodOptions: DailyCheckIn['mood'][] = ['excellent', 'good', 'okay', 'stressed', 'struggling'];
    const moodWeights = [0.2, 0.35, 0.25, 0.15, 0.05]; // Most days are good/okay
    const mood = weightedRandom(moodOptions, moodWeights);
    
    const stressLevel = mood === 'excellent' ? randomInt(1, 3) :
                        mood === 'good' ? randomInt(2, 5) :
                        mood === 'okay' ? randomInt(4, 6) :
                        mood === 'stressed' ? randomInt(6, 8) :
                        randomInt(7, 10);
    
    const studyHours = mood === 'struggling' ? randomFloat(0.5, 1.5) :
                       mood === 'stressed' ? randomFloat(1, 2.5) :
                       randomFloat(1.5, 4);
    
    checkIns.push({
      id: `checkin-${date.toISOString().split('T')[0]}`,
      studentId,
      date: date.toISOString().split('T')[0],
      
      mood,
      moodNotes: mood === 'struggling' ? 'Feeling overwhelmed with assignments' :
                 mood === 'stressed' ? 'Worried about upcoming test' :
                 mood === 'excellent' ? 'Had a productive day!' : undefined,
      stressLevel,
      sleepHours: randomFloat(5.5, 8.5),
      energyLevel: 10 - Math.floor(stressLevel * 0.8),
      
      studyHours,
      subjectsStudied: randomSubjects(['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English']),
      homeworkCompleted: Math.random() > 0.2,
      classesAttended: randomInt(4, 6),
      academicChallengesFaced: mood === 'struggling' || mood === 'stressed' ? 
        'Difficulty understanding complex concepts' : undefined,
      
      physicalActivityMinutes: randomInt(0, 60),
      sportsParticipation: Math.random() > 0.7 ? 'Basketball practice' : undefined,
      
      socialInteractions: mood === 'excellent' || mood === 'good' ? 'many' :
                          mood === 'okay' ? 'some' : 'few',
      emotionalState: mood === 'excellent' ? 'Happy and motivated' :
                      mood === 'good' ? 'Content and focused' :
                      mood === 'okay' ? 'Neutral' :
                      mood === 'stressed' ? 'Anxious about deadlines' :
                      'Feeling down',
      
      achievements: mood === 'excellent' && Math.random() > 0.5 ? 
        ['Solved 10 coding problems', 'Got full marks in quiz'] : undefined,
      
      timestamp: date.toISOString(),
    });
  }
  
  return checkIns;
};

// ============================================================================
// ACTIVITY LOGS
// ============================================================================

export const mockActivities: ActivityLog[] = [
  {
    id: 'activity-1',
    studentId: 'student-1',
    type: 'academic',
    category: 'homework',
    description: 'Completed Mathematics assignment on quadratic equations',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-2',
    studentId: 'student-1',
    type: 'sports',
    category: 'practice',
    description: 'Basketball practice - improved shooting accuracy',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-3',
    studentId: 'student-1',
    type: 'mental-health',
    category: 'check-in',
    description: 'Completed daily check-in: good mood, 3h study',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-4',
    studentId: 'student-1',
    type: 'achievement',
    category: 'academic',
    description: 'Scored 95% in Physics unit test',
    sentiment: 'positive',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-5',
    studentId: 'student-1',
    type: 'academic',
    category: 'study',
    description: 'Studied Chemistry for 2 hours - organic chemistry reactions',
    sentiment: 'neutral',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================================
// HOMEWORK
// ============================================================================

export const mockHomework: Homework[] = [
  {
    id: 'hw-1',
    studentId: 'student-1',
    teacherId: 't1',
    teacherName: 'Mr. Sharma',
    subject: 'Mathematics',
    title: 'Quadratic Equations Practice',
    description: 'Complete exercises 1-20 from Chapter 5. Focus on word problems.',
    assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    estimatedTime: 60,
    status: 'in-progress',
  },
  {
    id: 'hw-2',
    studentId: 'student-1',
    teacherId: 't2',
    teacherName: 'Mrs. Patel',
    subject: 'Physics',
    title: 'Numerical Problems on Motion',
    description: 'Solve problems 1-15 from exercise 3.2. Show all work.',
    assignedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    estimatedTime: 90,
    status: 'pending',
  },
  {
    id: 'hw-3',
    studentId: 'student-1',
    teacherId: 't3',
    teacherName: 'Ms. Reddy',
    subject: 'Chemistry',
    title: 'Lab Report - Titration Experiment',
    description: 'Write detailed lab report with observations and conclusions.',
    assignedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    estimatedTime: 120,
    status: 'pending',
  },
  {
    id: 'hw-4',
    studentId: 'student-1',
    teacherId: 't4',
    teacherName: 'Mr. Iyer',
    subject: 'Computer Science',
    title: 'Python Programming Assignment',
    description: 'Implement binary search and merge sort algorithms.',
    assignedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'low',
    estimatedTime: 180,
    status: 'pending',
  },
];

// ============================================================================
// TESTS
// ============================================================================

export const mockTests: Test[] = [
  {
    id: 'test-1',
    studentId: 'student-1',
    teacherId: 't1',
    teacherName: 'Mr. Sharma',
    subject: 'Mathematics',
    title: 'Mid-term Examination',
    description: 'Covers chapters 1-5: Algebra, Geometry, and Trigonometry',
    testDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 180,
    syllabus: [
      'Linear Equations',
      'Quadratic Equations',
      'Coordinate Geometry',
      'Trigonometric Ratios',
      'Heights and Distances'
    ],
    importance: 'midterm',
    preparationStatus: 'in-progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'test-2',
    studentId: 'student-1',
    teacherId: 't2',
    teacherName: 'Mrs. Patel',
    subject: 'Physics',
    title: 'Unit Test - Mechanics',
    description: 'Kinematics, Newton\'s Laws, and Work-Energy theorem',
    testDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    syllabus: [
      'Motion in a straight line',
      'Newton\'s Laws of Motion',
      'Work, Energy, and Power',
      'Numerical problem solving'
    ],
    importance: 'unit-test',
    preparationStatus: 'in-progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'test-3',
    studentId: 'student-1',
    teacherId: 't4',
    teacherName: 'Mr. Iyer',
    subject: 'Computer Science',
    title: 'Programming Quiz',
    description: 'Data structures and algorithms',
    testDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    syllabus: [
      'Arrays and Strings',
      'Sorting Algorithms',
      'Searching Algorithms',
      'Time Complexity Analysis'
    ],
    importance: 'quiz',
    preparationStatus: 'well-prepared',
    createdAt: new Date().toISOString(),
  },
];

// ============================================================================
// CHAT CONTACTS
// ============================================================================

export const mockChatContacts: ChatContact[] = [
  {
    id: 'c1',
    name: 'Priya Singh',
    role: 'student',
    class: '10th Grade',
    isOnline: true,
  },
  {
    id: 'c2',
    name: 'Rahul Verma',
    role: 'student',
    class: '10th Grade',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 't1',
    name: 'Mr. Sharma',
    role: 'teacher',
    subject: 'Mathematics',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 't2',
    name: 'Mrs. Patel',
    role: 'teacher',
    subject: 'Physics',
    isOnline: true,
  },
];

// ============================================================================
// SUGGESTED CHAT PROMPTS
// ============================================================================

export const generateSuggestedPrompts = (profile: StudentProfile): string[] => {
  return [
    `Help me understand ${profile.subjects[0] || 'a difficult concept'}`,
    'How can I manage my time better?',
    `What steps should I take to become ${profile.dreamJob}?`,
    'I\'m feeling stressed about exams',
    'Create a study plan for this week',
    'Explain this concept in simple terms',
  ];
};

// ============================================================================
// TEACHER ALERTS
// ============================================================================

export const mockTeacherAlerts: TeacherAlert[] = [
  {
    id: 'alert-1',
    studentId: 'student-1',
    studentName: 'Alex Kumar',
    teacherId: 't1',
    alertType: 'academic-struggle',
    severity: 'medium',
    title: 'Declining Performance in Mathematics',
    description: 'Student has scored below 60% in the last two assignments.',
    aiInsight: 'Pattern analysis shows difficulty with quadratic equations. Recent check-ins indicate reduced study time.',
    suggestedActions: [
      'Schedule one-on-one tutoring session',
      'Provide additional practice problems',
      'Check for understanding of prerequisite concepts',
      'Consider peer study group arrangement'
    ],
    relatedData: {},
    status: 'new',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function weightedRandom<T>(items: T[], weights: number[]): T {
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random <= sum) return items[i];
  }
  
  return items[items.length - 1];
}

function randomSubjects(allSubjects: string[]): string[] {
  const count = randomInt(1, 3);
  const shuffled = [...allSubjects].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const getMockStudentProfile = (id: string): StudentProfile | null => {
  return mockStudentProfiles[id] || null;
};

export const getMockCheckIns = (studentId: string, days: number = 14): DailyCheckIn[] => {
  return generateMockCheckIns(studentId, days);
};

export const getMockActivities = (studentId: string): ActivityLog[] => {
  return mockActivities.filter(a => a.studentId === studentId);
};

export const getMockHomework = (studentId: string): Homework[] => {
  return mockHomework.filter(h => h.studentId === studentId);
};

export const getMockTests = (studentId: string): Test[] => {
  return mockTests.filter(t => t.studentId === studentId);
};

export const getMockChatContacts = (): ChatContact[] => {
  return mockChatContacts;
};

export const getMockTeacherAlerts = (studentId: string): TeacherAlert[] => {
  return mockTeacherAlerts.filter(a => a.studentId === studentId);
};
