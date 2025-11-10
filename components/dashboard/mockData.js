/**
 * Mock Data for Premium Dashboard
 * 
 * This file contains sample data matching the expected API shape.
 * Replace with actual API calls:
 * - GET /api/student/:id/summary
 * - GET /api/student/:id/activities
 * - GET /api/student/:id/deadlines
 */

export const mockStudent = {
  id: 'student-001',
  name: 'Harsha',
  firstName: 'Harsha',
  grade: 'Grade 12',
  subjects: [
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'cs', name: 'Computer Science' }
  ],
  
  // Key metrics
  avgStudyHours: 2.7,
  weeklyStudy: [1.2, 2.5, 3.0, 0.5, 2.7, 1.8, 2.9], // Last 7 days
  homeworkCompletionPercent: 100,
  attendancePercent: 95,
  energyLevel: 'balanced', // 'low' | 'balanced' | 'high'
  overallProgressPercent: 85,
  
  // Energy trend (last 7 days, scale 1-10)
  energyTrend: [7, 8, 6, 7, 8, 7, 8],
  
  // Attendance trend (last 7 days)
  attendanceTrend: [6, 6, 5, 6, 6, 6, 5],
  
  // Today's focus items
  todaysFocus: [
    {
      id: 'task-1',
      title: 'Complete Calculus Problem Set',
      subject: 'Mathematics',
      timeEstimate: '45 min',
      completed: false,
      priority: 'high'
    },
    {
      id: 'task-2',
      title: 'Review Quantum Mechanics Notes',
      subject: 'Physics',
      timeEstimate: '30 min',
      completed: false,
      priority: 'medium'
    },
    {
      id: 'task-3',
      title: 'Practice React Components',
      subject: 'Computer Science',
      timeEstimate: '1 hour',
      completed: false,
      priority: 'medium'
    }
  ],
  
  // Upcoming deadlines
  upcomingDeadlines: [
    {
      id: 'deadline-1',
      title: 'Chemistry Lab Report',
      subject: 'Chemistry',
      dueDate: '2025-11-12T23:59:00',
      daysLeft: 2,
      priority: 'high'
    },
    {
      id: 'deadline-2',
      title: 'Physics Assignment Chapter 5',
      subject: 'Physics',
      dueDate: '2025-11-14T23:59:00',
      daysLeft: 4,
      priority: 'medium'
    },
    {
      id: 'deadline-3',
      title: 'Math Project Submission',
      subject: 'Mathematics',
      dueDate: '2025-11-18T23:59:00',
      daysLeft: 8,
      priority: 'low'
    }
  ],
  
  // Recent activities
  recentActivities: [
    {
      id: 'activity-1',
      category: 'academic',
      text: 'Completed homework: Algebra equations',
      time: '2 hours ago',
      icon: '📚'
    },
    {
      id: 'activity-2',
      category: 'wellness',
      text: 'Logged 2.5h study session',
      time: '3 hours ago',
      icon: '⏱️'
    },
    {
      id: 'activity-3',
      category: 'academic',
      text: 'Asked mentor about: Derivatives',
      time: '5 hours ago',
      icon: '💬'
    },
    {
      id: 'activity-4',
      category: 'sports',
      text: 'Completed 30min physical activity',
      time: '6 hours ago',
      icon: '⚽'
    },
    {
      id: 'activity-5',
      category: 'academic',
      text: 'Attended all 6 classes',
      time: 'Yesterday',
      icon: '✅'
    }
  ],
  
  // Goals
  goals: [
    {
      id: 'goal-1',
      title: 'Become a Software Engineer',
      category: 'career',
      progress: 85
    },
    {
      id: 'goal-2',
      title: 'Score 95%+ in final exams',
      category: 'academic',
      progress: 70
    }
  ]
};

// Teacher view mock data
export const mockTeacherData = {
  classSize: 45,
  atRiskStudents: [
    {
      id: 'student-002',
      name: 'Priya Sharma',
      reason: 'Low attendance (65%)',
      severity: 'high'
    },
    {
      id: 'student-003',
      name: 'Rahul Kumar',
      reason: 'Homework completion below 50%',
      severity: 'medium'
    }
  ],
  classAverage: {
    studyHours: 2.1,
    homeworkCompletion: 78,
    attendance: 88
  }
};
