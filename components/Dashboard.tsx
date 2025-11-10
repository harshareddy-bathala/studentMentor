import React, { useMemo } from 'react';
import { StudentProfile, DailyCheckIn, ActivityLog, Homework, Test } from '../types';
import { analyzeMoodPatterns, calculateAcademicMetrics } from '../utils/aiHelpers';

interface DashboardProps {
  profile: StudentProfile;
  checkIns: DailyCheckIn[];
  activities: ActivityLog[];
  homework?: Homework[];
  tests?: Test[];
}

const Dashboard: React.FC<DashboardProps> = ({ profile, checkIns, activities, homework = [], tests = [] }) => {
  const academicMetrics = useMemo(() => calculateAcademicMetrics(checkIns), [checkIns]);

  const recentActivities = activities.slice(0, 5);

  // Get upcoming deadlines (homework + tests)
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const deadlines: Array<{type: 'homework' | 'test', title: string, date: string, subject: string, priority?: string, importance?: string}> = [];
    
    homework.forEach(hw => {
      if (hw.status !== 'completed' && hw.status !== 'submitted') {
        deadlines.push({
          type: 'homework',
          title: hw.title,
          date: hw.dueDate,
          subject: hw.subject,
          priority: hw.priority
        });
      }
    });

    tests.forEach(test => {
      deadlines.push({
        type: 'test',
        title: test.title,
        date: test.testDate,
        subject: test.subject,
        importance: test.importance
      });
    });

    return deadlines
      .filter(d => new Date(d.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [homework, tests]);

  const getDaysUntil = (date: string) => {
    const days = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const getWellbeingStatus = () => {
    if (checkIns.length === 0) return { status: 'No data', color: 'text-gray-400' };
    const recent = checkIns.slice(0, 3);
    const avgEnergy = recent.reduce((sum, c) => sum + c.energyLevel, 0) / recent.length;
    
    if (avgEnergy >= 7) return { status: 'Energetic', emoji: '⚡', color: 'text-green-400' };
    if (avgEnergy >= 5) return { status: 'Balanced', emoji: '😊', color: 'text-blue-400' };
    return { status: 'Low energy', emoji: '😴', color: 'text-orange-400' };
  };

  const wellbeing = getWellbeingStatus();

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-purple-600 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold">Welcome back, {profile.name}! 👋</h1>
          <p className="mt-2 text-sky-100">Your personal growth dashboard</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="bg-white/20 px-3 py-1 rounded-full">
              Grade: {profile.grade}
            </div>
            {profile.currentGoals && profile.currentGoals.length > 0 && (
              <div className="bg-white/20 px-3 py-1 rounded-full">
                🎯 {profile.currentGoals.length} Active Goals
              </div>
            )}
            <div className="bg-white/20 px-3 py-1 rounded-full">
              {profile.subjects.length} Subjects
            </div>
          </div>
        </div>

        {/* Quick Stats Grid - Professional & Minimalistic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Wellbeing Status - Positive Energy Focus */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Energy Level</p>
                <p className={`text-2xl font-bold mt-1 ${wellbeing.color}`}>
                  {wellbeing.emoji} {wellbeing.status}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Based on recent activity</p>
          </div>

          {/* Study Hours */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div>
              <p className="text-slate-400 text-sm">Avg Study Hours</p>
              <p className="text-2xl font-bold text-sky-400 mt-1">
                {academicMetrics.averageStudyHours}h/day
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Total: {academicMetrics.totalStudyHours} hours
            </p>
            <div className="mt-2 bg-slate-700 rounded-full h-2">
              <div
                className="bg-sky-500 rounded-full h-2"
                style={{ width: `${Math.min(100, (academicMetrics.averageStudyHours / 4) * 100)}%` }}
              />
            </div>
          </div>

          {/* Homework Completion */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div>
              <p className="text-slate-400 text-sm">Homework</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {academicMetrics.homeworkCompletionRate}%
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-2">Completion rate</p>
            <div className="mt-2 bg-slate-700 rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2"
                style={{ width: `${academicMetrics.homeworkCompletionRate}%` }}
              />
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div>
              <p className="text-slate-400 text-sm">Attendance</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">
                {academicMetrics.attendanceRate}%
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-2">Classes attended</p>
            <div className="mt-2 bg-slate-700 rounded-full h-2">
              <div
                className="bg-purple-500 rounded-full h-2"
                style={{ width: `${academicMetrics.attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines - NEW FEATURE */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">📅 Upcoming Deadlines</h2>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline, idx) => {
                  const daysUntil = getDaysUntil(deadline.date);
                  const isUrgent = daysUntil === 'Today' || daysUntil === 'Tomorrow';
                  
                  return (
                    <div
                      key={idx}
                      className={`rounded-lg p-4 ${
                        isUrgent ? 'bg-red-900/20 border border-red-500/30' : 'bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                          deadline.type === 'homework' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                        }`}>
                          {deadline.type === 'homework' ? '📚' : '📝'}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{deadline.title}</p>
                          <p className="text-sm text-slate-400">{deadline.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm ${isUrgent ? 'text-red-400' : 'text-sky-400'}`}>
                            {daysUntil}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(deadline.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <div className="text-4xl mb-2">🎉</div>
                  <p>No upcoming deadlines!</p>
                  <p className="text-sm mt-1">You're all caught up</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activities 🎯</h2>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => {
                  const typeColors: Record<string, string> = {
                    'academic': 'bg-blue-500/20 text-blue-400',
                    'sports': 'bg-green-500/20 text-green-400',
                    'social': 'bg-purple-500/20 text-purple-400',
                    'mental-health': 'bg-pink-500/20 text-pink-400',
                    'achievement': 'bg-yellow-500/20 text-yellow-400',
                    'challenge': 'bg-orange-500/20 text-orange-400'
                  };
                  const colorClass = typeColors[activity.type] || 'bg-slate-500/20 text-slate-400';

                  return (
                    <div key={activity.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
                          {activity.type}
                        </span>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-center py-8">No recent activities logged.</p>
              )}
            </div>
          </div>
        </div>

        {/* Subjects Focus */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Your Focus Areas 📚</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {profile.subjects.map((subject, idx) => {
              const isFrequent = academicMetrics.mostStudiedSubjects.includes(subject);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg text-center ${
                    isFrequent
                      ? 'bg-sky-600/30 border border-sky-500/50'
                      : 'bg-slate-700/50 border border-slate-600'
                  }`}
                >
                  <p className="text-white font-medium">{subject}</p>
                  {isFrequent && (
                    <p className="text-xs text-sky-300 mt-1">⭐ Frequently studied</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
