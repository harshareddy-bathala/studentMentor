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

// Mock data import - replace with API calls
import { mockStudent, mockTeacherData } from './mockData';

interface PremiumDashboardProps {
  // Optional: pass student data as prop
  studentData?: typeof mockStudent;
  // Callbacks for backend integration
  onOpenChat?: () => void;
  onAddGoal?: () => void;
  onViewTasks?: () => void;
  onExportReport?: () => void;
  onToggleTeacherMode?: () => void;
}

export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({
  studentData = mockStudent,
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

      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C4AB6] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">SM</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">Student Mentor AI</h1>
                <p className="text-xs text-slate-400">Hey, {studentData.firstName}!</p>
              </div>
            </div>

            {/* Center nav items - hidden on mobile */}
            <div className="hidden md:flex items-center gap-1">
              {['Dashboard', 'Homework', 'Tests', 'Peers', 'AI Mentor'].map((item) => (
                <button
                  key={item}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    item === 'Dashboard'
                      ? 'text-white bg-slate-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Right side: Report button + Teacher toggle + Avatar */}
            <div className="flex items-center gap-3">
              {/* Report button */}
              <button
                onClick={onExportReport}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Generate and export report"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Report
              </button>

              {/* Teacher mode toggle */}
              <button
                onClick={handleToggleTeacherMode}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  isTeacherMode ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                aria-label="Toggle teacher mode"
                aria-pressed={isTeacherMode}
                title="Teacher View"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>

              {/* User avatar */}
              <button
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3DD6B8] to-[#6C4AB6] flex items-center justify-center text-white font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="User profile menu"
              >
                {studentData.firstName.charAt(0)}
              </button>
            </div>
          </div>
        </div>
      </nav>

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
                <p className="text-2xl font-bold text-white">{mockTeacherData.classSize}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl">
                <p className="text-slate-400 text-sm mb-1">At-Risk Students</p>
                <p className="text-2xl font-bold text-red-400">{mockTeacherData.atRiskStudents.length}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl">
                <p className="text-slate-400 text-sm mb-1">Class Avg Study Hours</p>
                <p className="text-2xl font-bold text-blue-400">{mockTeacherData.classAverage.studyHours}h</p>
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
