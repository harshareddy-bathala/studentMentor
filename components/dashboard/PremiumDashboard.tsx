/**
 * Premium Dashboard Component
 * 
 * Main dashboard page for Student Mentor AI with premium minimal design.
 * 
 * Features:
 * - Responsive 3-column grid (desktop) / 2-col (tablet) / 1-col (mobile)
 * - Hero card with progress ring
 * - Key stats with sparklines
 * - Today's focus and upcoming deadlines
 * - Recent activities feed
 * - AI Mentor CTA
 * - Teacher mode toggle
 * 
 * Backend Integration Points:
 * - GET /api/student/:id/summary - Main dashboard data
 * - POST /api/mentor/chat - Open chat
 * - POST /api/student/:id/task/toggle - Toggle task completion
 * - POST /api/student/:id/report - Export report
 * 
 * Accessibility:
 * - Semantic HTML structure
 * - WCAG 2.1 AA compliant
 * - Keyboard navigation
 * - Screen reader friendly
 */

import React, { useState } from 'react';
import { HeroCard } from './HeroCard';
import { StatCard, CircularStatCard } from './StatCard';
import { ActionBar } from './ActionBar';
import { TodayPanel } from './TodayPanel';
import { DeadlinesCard } from './DeadlinesCard';
import { ActivitiesFeed } from './ActivitiesFeed';
import { MentorCTA, ChatDrawer } from './MentorCTA';

interface StudentData {
  id: string;
  name: string;
  firstName: string;
  grade: string;
  subjects: Array<{ id: string; name: string }>;
  avgStudyHours: number;
  weeklyStudy: number[];
  homeworkCompletionPercent: number;
  attendancePercent: number;
  energyLevel: string;
  overallProgressPercent: number;
  energyTrend: number[];
  attendanceTrend: number[];
  todaysFocus: any[];
  upcomingDeadlines: any[];
  recentActivities: any[];
  goals: any[];
}

interface PremiumDashboardProps {
  studentData: StudentData;
  // Callbacks for backend integration
  onOpenChat?: () => void;
  onAddGoal?: () => void;
  onViewTasks?: () => void;
  onExportReport?: () => void;
  onToggleTeacherMode?: () => void;
}

export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({
  studentData,
  onOpenChat,
  onAddGoal,
  onViewTasks,
  onExportReport,
  onToggleTeacherMode
}) => {
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [tasks, setTasks] = useState(studentData.todaysFocus);

  // Handlers
  const handleProgressClick = () => {
    // Show progress modal or navigate to detailed view
    console.log('Progress ring clicked - show weekly summary');
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    onOpenChat?.();
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    // TODO: Call API to persist change
    // POST /api/student/:id/task/${taskId}/toggle
  };

  const handleToggleTeacherMode = () => {
    setIsTeacherMode(!isTeacherMode);
    onToggleTeacherMode?.();
  };

  // Get energy status
  const getEnergyStatus = (level: string) => {
    switch (level) {
      case 'high':
        return { emoji: '⚡', label: 'High Energy', color: 'green' as const };
      case 'balanced':
        return { emoji: '⚖️', label: 'Balanced', color: 'blue' as const };
      case 'low':
        return { emoji: '🔋', label: 'Low Energy', color: 'yellow' as const };
      default:
        return { emoji: '⚖️', label: 'Balanced', color: 'blue' as const };
    }
  };

  const energyStatus = getEnergyStatus(studentData.energyLevel);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb / Welcome */}
        <div className="mb-6">
          <p className="text-sm text-slate-400">
            Dashboard / <span className="text-white">Overview</span>
          </p>
        </div>

        {/* Hero Card */}
        <div className="mb-6">
          <HeroCard
            studentName={studentData.firstName}
            grade={studentData.grade}
            subjects={studentData.subjects}
            overallProgress={studentData.overallProgressPercent}
            onProgressClick={handleProgressClick}
          />
        </div>

        {/* Action Bar */}
        <div className="mb-6">
          <ActionBar
            onAskMentor={handleOpenChat}
            onAddGoal={() => { onAddGoal?.(); console.log('Add goal'); }}
            onViewTasks={() => { onViewTasks?.(); console.log('View tasks'); }}
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Key Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                icon={energyStatus.emoji}
                title="Energy Level"
                value={energyStatus.label}
                subtitle="7-day average trend"
                trend={studentData.energyTrend}
                trendLabel="Energy level trend over 7 days"
                statusColor={energyStatus.color}
                changePercent={5}
              />
              
              <StatCard
                icon="📚"
                title="Avg Study Hours"
                value={`${studentData.avgStudyHours}h`}
                subtitle="Keep going — 2 hours from weekly target"
                barData={studentData.weeklyStudy}
                trendLabel="Study hours per day"
                statusColor="blue"
                changePercent={12}
              />
              
              <CircularStatCard
                icon="✅"
                title="Homework Completion"
                percent={studentData.homeworkCompletionPercent}
                subtitle="On track — keep it up!"
                statusColor="green"
                onClick={() => console.log('View homework details')}
              />
              
              <StatCard
                icon="🎯"
                title="Attendance"
                value={`${studentData.attendancePercent}%`}
                subtitle="Perfect attendance this week!"
                trend={studentData.attendanceTrend}
                trendLabel="Attendance trend over 7 days"
                statusColor="green"
                changePercent={3}
              />
            </div>

            {/* Today's Focus & Deadlines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TodayPanel
                tasks={tasks as any}
                onToggleTask={handleToggleTask}
                onSnoozeTask={(id) => console.log('Snooze task:', id)}
                onRescheduleTask={(id) => console.log('Reschedule task:', id)}
              />
              
              <DeadlinesCard
                deadlines={studentData.upcomingDeadlines as any}
                onDeadlineClick={(id) => console.log('View deadline:', id)}
              />
            </div>
          </div>

          {/* Right Column: Feed & Mentor */}
          <div className="space-y-6">
            <MentorCTA
              onOpenChat={handleOpenChat}
              studentName={studentData.firstName}
            />
            
            <ActivitiesFeed
              activities={studentData.recentActivities as any}
              maxItems={5}
            />
          </div>
        </div>

        {/* Teacher Mode View */}
        {isTeacherMode && (
          <div className="mt-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Teacher View
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl">
                <p className="text-slate-400 text-sm mb-1">Class Size</p>
                <p className="text-2xl font-bold text-white">45</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl">
                <p className="text-slate-400 text-sm mb-1">At-Risk Students</p>
                <p className="text-2xl font-bold text-red-400">2</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl">
                <p className="text-slate-400 text-sm mb-1">Class Avg Study Hours</p>
                <p className="text-2xl font-bold text-blue-400">2.1h</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        studentName={studentData.name}
        grade={studentData.grade}
        lastCheckIn="2 hours ago"
      />
    </div>
  );
};

export default PremiumDashboard;
