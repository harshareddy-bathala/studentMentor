import { StudentProfile, DailyCheckIn, ActivityLog, SessionContext } from '../types';

/**
 * Generate a comprehensive system instruction for the AI mentor
 */
export function generateMentorSystemInstruction(profile: StudentProfile, context?: SessionContext): string {
  const ageBasedTone = getAgeBasedCommunicationStyle(profile.age);
  const recentContext = context ? generateContextSummary(context) : '';

  return `You are an advanced AI personal mentor for ${profile.name}, a ${profile.age}-year-old student in ${profile.grade}.

**YOUR ROLE:**
You are their mentor, teacher, and supportive friend—helping them grow academically, physically, mentally, and emotionally. You adapt your communication to their maturity level and needs.

**STUDENT PROFILE:**
- Name: ${profile.name}
- Age: ${profile.age} years old (${ageBasedTone})
- Grade: ${profile.grade}
- Learning Style: ${profile.learningStyle || 'mixed'}

**ACADEMIC BACKGROUND:**
- Subjects: ${profile.subjects.join(', ')}
- Goals: ${profile.academicGoals}
- Challenges: ${profile.academicChallenges.join(', ')}

**CAREER ASPIRATIONS:**
- Dream: ${profile.dreamJob}
- Aspirations: ${profile.careerAspirations}
${profile.roleModels ? `- Role Models: ${profile.roleModels}` : ''}

**INTERESTS & HOBBIES:**
- Interests: ${profile.interests.join(', ')}
- Hobbies: ${profile.hobbies.join(', ')}

**SPORTS & PHYSICAL:**
${profile.sportsActivities.length > 0 ? `- Activities: ${profile.sportsActivities.join(', ')}` : '- No regular sports activities'}
${profile.fitnessGoals ? `- Fitness Goals: ${profile.fitnessGoals}` : ''}

**PERSONAL CHALLENGES:**
- Personal: ${profile.personalChallenges.join(', ')}
${profile.mentalHealthConcerns ? `- Mental Health: ${profile.mentalHealthConcerns} (approach with extra sensitivity)` : ''}

${recentContext}

**COMMUNICATION GUIDELINES:**
${ageBasedTone}

1. **Personalization**: Always remember their goals, interests, and challenges. Reference them naturally.
2. **Encouragement**: Celebrate progress and provide constructive feedback.
3. **Holistic Support**: Address academics, sports, mental health, and personal growth.
4. **Age-Appropriate**: Adapt complexity and examples to their age and maturity.
5. **Action-Oriented**: Provide specific, actionable advice and strategies.
6. **Empathy**: Show understanding, especially for their stated challenges.
7. **Career Guidance**: Connect current activities to their dream of becoming ${profile.dreamJob}.
8. **Growth Mindset**: Encourage continuous improvement and learning from failures.

**IMPORTANT BOUNDARIES:**
- You complement but don't replace teachers, parents, or mental health professionals
- For serious mental health concerns, gently suggest speaking with a trusted adult
- Provide academic support but encourage independent thinking
- Be supportive but maintain appropriate mentor-student boundaries

**RESPONSE STYLE:**
- Use their name occasionally to personalize
- Keep responses conversational and engaging
- Use emojis sparingly and appropriately for their age
- Break down complex topics into digestible parts
- Ask follow-up questions to understand their needs better
- Provide examples relevant to their interests

Remember: Your goal is to help ${profile.name} grow in every aspect of their life, supporting their journey to becoming ${profile.dreamJob} while maintaining balance and well-being.`;
}

/**
 * Determine communication style based on age
 */
function getAgeBasedCommunicationStyle(age: number): string {
  if (age < 10) {
    return `Use simple, encouraging language. Be playful and use analogies from games and stories. Keep sentences short.`;
  } else if (age < 13) {
    return `Use friendly, supportive language. Balance fun with learning. Relate concepts to their everyday experiences.`;
  } else if (age < 16) {
    return `Use mature but relatable language. Acknowledge their growing independence. Provide deeper explanations when needed.`;
  } else if (age < 18) {
    return `Use sophisticated language. Treat them as a young adult. Discuss complex topics and future planning seriously.`;
  } else {
    return `Use adult language. Focus on practical strategies and long-term planning. Respect their maturity and decision-making.`;
  }
}

/**
 * Generate context summary from recent activities and check-ins
 */
function generateContextSummary(context: SessionContext): string {
  let summary = '\n**RECENT CONTEXT:**\n';

  if (context.currentMood) {
    summary += `- Current Mood: ${context.currentMood}\n`;
  }

  if (context.recentCheckIns && context.recentCheckIns.length > 0) {
    const latestCheckIn = context.recentCheckIns[0];
    summary += `- Latest Check-in: Mood was ${latestCheckIn.mood}, stress level ${latestCheckIn.stressLevel}/10, studied ${latestCheckIn.studyHours} hours\n`;
  }

  if (context.recentChallenges && context.recentChallenges.length > 0) {
    summary += `- Recent Challenges: ${context.recentChallenges.join(', ')}\n`;
  }

  if (context.currentGoals && context.currentGoals.length > 0) {
    summary += `- Current Goals: ${context.currentGoals.join(', ')}\n`;
  }

  if (context.recentActivities && context.recentActivities.length > 0) {
    const recentHighlights = context.recentActivities.slice(0, 3).map(a => a.description).join('; ');
    summary += `- Recent Activity: ${recentHighlights}\n`;
  }

  return summary;
}

/**
 * Analyze mood patterns from check-ins
 */
export function analyzeMoodPatterns(checkIns: DailyCheckIn[]): {
  averageMood: string;
  averageStress: number;
  trend: 'improving' | 'declining' | 'stable';
  concerns: string[];
} {
  if (checkIns.length === 0) {
    return {
      averageMood: 'unknown',
      averageStress: 0,
      trend: 'stable',
      concerns: []
    };
  }

  const moodScores: Record<string, number> = {
    'excellent': 5,
    'good': 4,
    'okay': 3,
    'stressed': 2,
    'struggling': 1
  };

  const avgMoodScore = checkIns.reduce((sum, c) => sum + moodScores[c.mood], 0) / checkIns.length;
  const avgStress = checkIns.reduce((sum, c) => sum + c.stressLevel, 0) / checkIns.length;

  // Determine trend
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (checkIns.length >= 3) {
    const recentAvg = checkIns.slice(0, 3).reduce((sum, c) => sum + moodScores[c.mood], 0) / 3;
    const olderAvg = checkIns.slice(3, 6).reduce((sum, c) => sum + moodScores[c.mood], 0) / Math.min(3, checkIns.length - 3);
    
    if (recentAvg > olderAvg + 0.5) trend = 'improving';
    else if (recentAvg < olderAvg - 0.5) trend = 'declining';
  }

  // Identify concerns
  const concerns: string[] = [];
  if (avgStress > 7) concerns.push('High stress levels detected');
  if (avgMoodScore < 2.5) concerns.push('Consistently low mood');
  
  const lowSleepCount = checkIns.filter(c => c.sleepHours < 6).length;
  if (lowSleepCount > checkIns.length / 2) concerns.push('Insufficient sleep pattern');

  const lowEnergyCount = checkIns.filter(c => c.energyLevel < 4).length;
  if (lowEnergyCount > checkIns.length / 2) concerns.push('Low energy levels');

  // Convert average mood score to mood string
  let averageMood = 'okay';
  if (avgMoodScore >= 4.5) averageMood = 'excellent';
  else if (avgMoodScore >= 3.5) averageMood = 'good';
  else if (avgMoodScore >= 2.5) averageMood = 'okay';
  else if (avgMoodScore >= 1.5) averageMood = 'stressed';
  else averageMood = 'struggling';

  return { averageMood, averageStress: Math.round(avgStress * 10) / 10, trend, concerns };
}

/**
 * Calculate academic performance metrics
 */
export function calculateAcademicMetrics(checkIns: DailyCheckIn[]): {
  totalStudyHours: number;
  averageStudyHours: number;
  homeworkCompletionRate: number;
  attendanceRate: number;
  mostStudiedSubjects: string[];
} {
  if (checkIns.length === 0) {
    return {
      totalStudyHours: 0,
      averageStudyHours: 0,
      homeworkCompletionRate: 0,
      attendanceRate: 0,
      mostStudiedSubjects: []
    };
  }

  const totalStudyHours = checkIns.reduce((sum, c) => sum + c.studyHours, 0);
  const averageStudyHours = totalStudyHours / checkIns.length;
  
  const homeworkCompleted = checkIns.filter(c => c.homeworkCompleted).length;
  const homeworkCompletionRate = (homeworkCompleted / checkIns.length) * 100;

  const totalClasses = checkIns.reduce((sum, c) => sum + c.classesAttended, 0);
  const attendanceRate = totalClasses > 0 ? (totalClasses / (checkIns.length * 6)) * 100 : 100; // Assuming 6 classes per day

  // Count subjects studied
  const subjectCounts: Record<string, number> = {};
  checkIns.forEach(c => {
    c.subjectsStudied.forEach(subject => {
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    });
  });

  const mostStudiedSubjects = Object.entries(subjectCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([subject]) => subject);

  return {
    totalStudyHours: Math.round(totalStudyHours * 10) / 10,
    averageStudyHours: Math.round(averageStudyHours * 10) / 10,
    homeworkCompletionRate: Math.round(homeworkCompletionRate),
    attendanceRate: Math.round(attendanceRate),
    mostStudiedSubjects
  };
}

/**
 * Generate insights for teacher report
 */
export function generateInsights(
  profile: StudentProfile,
  checkIns: DailyCheckIn[],
  activities: ActivityLog[]
): {
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
} {
  const strengths: string[] = [];
  const growthAreas: string[] = [];
  const recommendations: string[] = [];

  const academicMetrics = calculateAcademicMetrics(checkIns);
  const moodAnalysis = analyzeMoodPatterns(checkIns);

  // Analyze strengths
  if (academicMetrics.homeworkCompletionRate > 80) {
    strengths.push('Consistently completes homework assignments');
  }
  if (academicMetrics.attendanceRate > 90) {
    strengths.push('Excellent class attendance');
  }
  if (academicMetrics.averageStudyHours > 2) {
    strengths.push('Demonstrates strong study habits');
  }
  if (moodAnalysis.trend === 'improving') {
    strengths.push('Shows improving emotional well-being');
  }

  const physicalActivity = checkIns.reduce((sum, c) => sum + c.physicalActivityMinutes, 0) / checkIns.length;
  if (physicalActivity > 30) {
    strengths.push('Maintains regular physical activity');
  }

  // Analyze growth areas
  if (academicMetrics.homeworkCompletionRate < 60) {
    growthAreas.push('Homework completion needs improvement');
    recommendations.push('Implement a structured homework schedule with breaks');
  }
  if (moodAnalysis.averageStress > 7) {
    growthAreas.push('Managing high stress levels');
    recommendations.push('Introduce stress management techniques and regular breaks');
  }
  if (academicMetrics.averageStudyHours < 1) {
    growthAreas.push('Study time could be increased');
    recommendations.push('Set daily study goals starting with 1-2 hours');
  }

  const lowSleepDays = checkIns.filter(c => c.sleepHours < 7).length;
  if (lowSleepDays > checkIns.length / 2) {
    growthAreas.push('Sleep patterns need attention');
    recommendations.push('Establish a consistent bedtime routine aiming for 7-8 hours');
  }

  if (moodAnalysis.trend === 'declining') {
    growthAreas.push('Emotional well-being showing decline');
    recommendations.push('Consider additional support and counseling resources');
  }

  // Academic challenge-specific recommendations
  profile.academicChallenges.forEach(challenge => {
    if (challenge.toLowerCase().includes('focus') || challenge.toLowerCase().includes('concentration')) {
      recommendations.push('Try the Pomodoro Technique (25-min focused sessions)');
    }
    if (challenge.toLowerCase().includes('time') || challenge.toLowerCase().includes('management')) {
      recommendations.push('Use a planner and prioritize tasks by deadline and importance');
    }
  });

  return { strengths, growthAreas, recommendations };
}
