// Core Student Profile
export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  
  // Academic Information
  subjects: string[];
  academicGoals: string;
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  
  // Career & Aspirations
  careerAspirations: string;
  dreamJob: string;
  roleModels?: string;
  
  // Interests & Hobbies
  interests: string[];
  hobbies: string[];
  
  // Sports & Physical Activities
  sportsActivities: string[];
  fitnessGoals?: string;
  
  // Challenges & Support Needs
  academicChallenges: string[];
  personalChallenges: string[];
  mentalHealthConcerns?: string;
  
  // Personality & Communication
  personalityTraits?: string[];
  communicationPreference?: 'direct' | 'gentle' | 'motivational' | 'analytical';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Daily Activity & Mood Tracking
export interface DailyCheckIn {
  id: string;
  studentId: string;
  date: string;
  
  // Mood & Mental Health
  mood: 'excellent' | 'good' | 'okay' | 'stressed' | 'struggling';
  moodNotes?: string;
  stressLevel: number; // 1-10
  sleepHours: number;
  energyLevel: number; // 1-10
  
  // Academic Activities
  studyHours: number;
  subjectsStudied: string[];
  homeworkCompleted: boolean;
  classesAttended: number;
  academicChallengesFaced?: string;
  
  // Physical & Sports
  physicalActivityMinutes: number;
  sportsParticipation?: string;
  
  // Social & Emotional
  socialInteractions: 'many' | 'some' | 'few' | 'none';
  emotionalState: string;
  
  // Achievements
  achievements?: string[];
  
  timestamp: string;
}

// Activity Log for continuous monitoring
export interface ActivityLog {
  id: string;
  studentId: string;
  type: 'academic' | 'sports' | 'social' | 'mental-health' | 'achievement' | 'challenge';
  category: string;
  description: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

// AI Conversation Messages
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  context?: {
    emotion?: string;
    topic?: string;
    actionItems?: string[];
  };
}

// Teacher Report
export interface TeacherReport {
  id: string;
  studentId: string;
  studentName: string;
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  
  // Academic Summary
  academic: {
    overallProgress: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement';
    subjectPerformance: Record<string, string>;
    studyHoursAverage: number;
    homeworkCompletionRate: number;
    areasOfStrength: string[];
    areasNeedingAttention: string[];
  };
  
  // Mental & Emotional Well-being
  wellbeing: {
    averageMood: string;
    averageStressLevel: number;
    concerningPatterns?: string[];
    positiveIndicators: string[];
    recommendations: string[];
  };
  
  // Sports & Physical Health
  physical: {
    activityLevel: 'high' | 'moderate' | 'low';
    regularParticipation: boolean;
    achievements?: string[];
  };
  
  // Social & Behavioral
  social: {
    interactionLevel: string;
    behavioralNotes?: string;
  };
  
  // AI-Generated Insights
  insights: {
    strengths: string[];
    growthAreas: string[];
    recommendedInterventions: string[];
    parentGuardianNotes?: string;
  };
  
  generatedAt: string;
}

// App State & Settings
export interface AppSettings {
  checkInReminder: boolean;
  reminderTime?: string;
  parentalAccessEnabled: boolean;
  dataRetentionDays: number;
}

// Session Context for AI
export interface SessionContext {
  recentActivities: ActivityLog[];
  recentCheckIns: DailyCheckIn[];
  currentMood?: string;
  currentGoals?: string[];
  recentChallenges?: string[];
}
