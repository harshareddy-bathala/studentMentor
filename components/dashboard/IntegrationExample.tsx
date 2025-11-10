/**
 * Example Integration with Existing Student Mentor AI App
 * 
 * This file shows how to integrate the new Premium Dashboard
 * with your existing App.tsx structure.
 */

import React, { useState } from 'react';
import { PremiumDashboard } from './components/dashboard';
import Chat from './components/Chat'; // Your existing chat
import HomeworkList from './components/HomeworkList';
import TestsList from './components/TestsList';
import PeerChat from './components/PeerChat';
import TeacherReport from './components/TeacherReport';
import GoalsEditor from './components/GoalsEditor';

// Import your existing types
import type { StudentProfile, DailyCheckIn, ActivityLog, Homework, Test } from './types';

interface IntegratedAppProps {
  profile: StudentProfile;
  checkIns: DailyCheckIn[];
  activities: ActivityLog[];
  homework: Homework[];
  tests: Test[];
}

export const IntegratedApp: React.FC<IntegratedAppProps> = ({
  profile,
  checkIns,
  activities,
  homework,
  tests
}) => {
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'homework' | 'tests' | 'peers' | 'chat' | 'report' | 'goals'
  >('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Convert existing data to Premium Dashboard format
  const convertToDashboardData = () => {
    return {
      id: profile.id,
      name: profile.name,
      firstName: profile.name.split(' ')[0],
      grade: profile.grade,
      subjects: profile.subjects.map((subject, idx) => ({
        id: `subj-${idx}`,
        name: subject
      })),
      
      // Calculate metrics from checkIns
      avgStudyHours: checkIns.length > 0
        ? checkIns.reduce((sum, c) => sum + c.studyHours, 0) / checkIns.length
        : 0,
      
      weeklyStudy: checkIns
        .slice(0, 7)
        .reverse()
        .map(c => c.studyHours),
      
      homeworkCompletionPercent: homework.length > 0
        ? Math.round(
            (homework.filter(h => h.status === 'completed' || h.status === 'submitted').length /
              homework.length) *
              100
          )
        : 100,
      
      attendancePercent: checkIns.length > 0
        ? Math.round(
            (checkIns.reduce((sum, c) => sum + c.classesAttended, 0) /
              (checkIns.length * 6)) *
              100
          )
        : 100,
      
      energyLevel: checkIns.length > 0
        ? checkIns[0].energyLevel >= 7
          ? 'high'
          : checkIns[0].energyLevel >= 4
          ? 'balanced'
          : 'low'
        : 'balanced',
      
      overallProgressPercent: 85, // Calculate based on your logic
      
      energyTrend: checkIns.slice(0, 7).reverse().map(c => c.energyLevel),
      attendanceTrend: checkIns.slice(0, 7).reverse().map(c => c.classesAttended),
      
      // Convert homework to todaysFocus
      todaysFocus: homework
        .filter(h => h.status === 'pending' || h.status === 'in-progress')
        .slice(0, 3)
        .map(h => ({
          id: h.id,
          title: h.title,
          subject: h.subject,
          timeEstimate: h.estimatedTime ? `${h.estimatedTime} min` : '30 min',
          completed: h.status === 'completed',
          priority: h.priority
        })),
      
      // Convert tests to upcomingDeadlines
      upcomingDeadlines: [
        ...homework
          .filter(h => h.status !== 'completed' && h.status !== 'submitted')
          .map(h => ({
            id: h.id,
            title: h.title,
            subject: h.subject,
            dueDate: h.dueDate,
            daysLeft: Math.ceil(
              (new Date(h.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            ),
            priority: h.priority
          })),
        ...tests.map(t => ({
          id: t.id,
          title: t.title,
          subject: t.subject,
          dueDate: t.testDate,
          daysLeft: Math.ceil(
            (new Date(t.testDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ),
          priority: t.importance === 'board-exam' || t.importance === 'final' ? 'high' : 'medium'
        }))
      ]
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5),
      
      // Convert activities to recentActivities
      recentActivities: activities.slice(0, 10).map(a => ({
        id: a.id,
        category: a.type === 'academic' ? 'academic' : a.type === 'sports' ? 'sports' : 'wellness',
        text: a.description,
        time: new Date(a.timestamp).toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        icon: a.type === 'academic' ? '📚' : a.type === 'sports' ? '⚽' : '💚'
      })),
      
      goals: [
        {
          id: 'goal-1',
          title: profile.dreamJob,
          category: 'career',
          progress: 85
        },
        {
          id: 'goal-2',
          title: profile.academicGoals,
          category: 'academic',
          progress: 70
        }
      ]
    };
  };

  const dashboardData = convertToDashboardData();

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <PremiumDashboard
            studentData={dashboardData}
            onOpenChat={() => setIsChatOpen(true)}
            onAddGoal={() => setCurrentView('goals')}
            onViewTasks={() => setCurrentView('homework')}
            onExportReport={() => setCurrentView('report')}
          />
        );
      
      case 'homework':
        return <HomeworkList homework={homework} />;
      
      case 'tests':
        return <TestsList tests={tests} />;
      
      case 'peers':
        return <PeerChat />;
      
      case 'report':
        return (
          <TeacherReport
            profile={profile}
            checkIns={checkIns}
            activities={activities}
          />
        );
      
      case 'goals':
        return <GoalsEditor profile={profile} />;
      
      default:
        return <PremiumDashboard studentData={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation can be extracted from PremiumDashboard if needed */}
      {renderView()}
      
      {/* Chat Drawer - Overlay on any view */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsChatOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-slate-900">
            <Chat
              profile={profile}
              checkIns={checkIns}
              activities={activities}
              homework={homework}
              tests={tests}
              onAddActivity={() => {}}
              onTriggerAlert={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * USAGE IN YOUR MAIN APP.TSX:
 * 
 * import { IntegratedApp } from './IntegratedApp';
 * 
 * function App() {
 *   const [profile, setProfile] = useState<StudentProfile>(initialProfile);
 *   const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
 *   const [activities, setActivities] = useState<ActivityLog[]>([]);
 *   const [homework, setHomework] = useState<Homework[]>([]);
 *   const [tests, setTests] = useState<Test[]>([]);
 * 
 *   return (
 *     <IntegratedApp
 *       profile={profile}
 *       checkIns={checkIns}
 *       activities={activities}
 *       homework={homework}
 *       tests={tests}
 *     />
 *   );
 * }
 */
