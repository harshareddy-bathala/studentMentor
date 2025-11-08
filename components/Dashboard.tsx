import React, { useMemo } from 'react';
import { StudentProfile, DailyCheckIn, ActivityLog } from '../types';
import { analyzeMoodPatterns, calculateAcademicMetrics } from '../utils/aiHelpers';

interface DashboardProps {
  profile: StudentProfile;
  checkIns: DailyCheckIn[];
  activities: ActivityLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ profile, checkIns, activities }) => {
  const moodAnalysis = useMemo(() => analyzeMoodPatterns(checkIns), [checkIns]);
  const academicMetrics = useMemo(() => calculateAcademicMetrics(checkIns), [checkIns]);

  const recentCheckIns = checkIns.slice(0, 7);
  const recentActivities = activities.slice(0, 5);

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      'excellent': '😄',
      'good': '😊',
      'okay': '😐',
      'stressed': '😰',
      'struggling': '😔'
    };
    return emojis[mood] || '😐';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'text-green-400';
    if (trend === 'declining') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return '↗';
    if (trend === 'declining') return '↘';
    return '→';
  };

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
            <div className="bg-white/20 px-3 py-1 rounded-full">
              Dream: {profile.dreamJob}
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              {checkIns.length} check-ins completed
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mood Status */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Current Mood</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {moodAnalysis.averageMood} {getMoodEmoji(moodAnalysis.averageMood)}
                </p>
              </div>
              <span className={`text-3xl ${getTrendColor(moodAnalysis.trend)}`}>
                {getTrendIcon(moodAnalysis.trend)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {moodAnalysis.trend === 'improving' && 'Great progress!'}
              {moodAnalysis.trend === 'declining' && 'Let\'s work on this'}
              {moodAnalysis.trend === 'stable' && 'Maintaining steady'}
            </p>
          </div>

          {/* Study Hours */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div>
              <p className="text-slate-400 text-sm">Avg Study Hours</p>
              <p className="text-2xl font-bold text-sky-400 mt-1">
                {academicMetrics.averageStudyHours}h
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

          {/* Stress Level */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div>
              <p className="text-slate-400 text-sm">Stress Level</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                {moodAnalysis.averageStress}/10
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {moodAnalysis.averageStress < 4 && 'Low stress 😌'}
              {moodAnalysis.averageStress >= 4 && moodAnalysis.averageStress < 7 && 'Moderate 🤔'}
              {moodAnalysis.averageStress >= 7 && 'High - need support 😰'}
            </p>
            <div className="mt-2 bg-slate-700 rounded-full h-2">
              <div
                className={`rounded-full h-2 ${
                  moodAnalysis.averageStress < 4 ? 'bg-green-500' :
                  moodAnalysis.averageStress < 7 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${moodAnalysis.averageStress * 10}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Check-ins */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Check-ins 📅</h2>
            <div className="space-y-3">
              {recentCheckIns.length > 0 ? (
                recentCheckIns.map((checkIn) => (
                  <div key={checkIn.id} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">
                          {new Date(checkIn.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {getMoodEmoji(checkIn.mood)} {checkIn.mood} • {checkIn.studyHours}h study
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Stress</p>
                        <p className="text-sm font-semibold text-orange-400">{checkIn.stressLevel}/10</p>
                      </div>
                    </div>
                    {checkIn.moodNotes && (
                      <p className="text-xs text-slate-400 mt-2 italic">"{checkIn.moodNotes}"</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-8">No check-ins yet. Start tracking your progress!</p>
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

        {/* Concerns & Recommendations */}
        {moodAnalysis.concerns.length > 0 && (
          <div className="bg-orange-900/30 border border-orange-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-orange-300 mb-4">⚠️ Areas Needing Attention</h2>
            <ul className="space-y-2">
              {moodAnalysis.concerns.map((concern, idx) => (
                <li key={idx} className="text-orange-200 flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-orange-300 mt-4">
              💡 Consider discussing these with your mentor or a trusted adult.
            </p>
          </div>
        )}

        {/* Goals & Aspirations */}
        <div className="bg-gradient-to-r from-purple-900/50 to-sky-900/50 border border-purple-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-purple-300 mb-4">🎯 Your Journey</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-purple-200 font-medium">Dream Career</p>
              <p className="text-white text-lg mt-1">{profile.dreamJob}</p>
            </div>
            <div>
              <p className="text-sm text-purple-200 font-medium">Current Goals</p>
              <p className="text-white text-sm mt-1">{profile.academicGoals}</p>
            </div>
          </div>
          {profile.interests.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-purple-200 font-medium mb-2">Your Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
