import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import DailyCheckIn from './components/DailyCheckIn';
import TeacherReport from './components/TeacherReport';
import { type StudentProfile, type DailyCheckIn as DailyCheckInType, type ActivityLog } from './types';
import { type User } from './authTypes';

type View = 'dashboard' | 'chat' | 'checkin' | 'report';

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [checkIns, setCheckIns] = useState<DailyCheckInType[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedAuthUser = localStorage.getItem('authUser');
      const savedProfile = localStorage.getItem('studentProfile');
      const savedCheckIns = localStorage.getItem('studentCheckIns');
      const savedActivities = localStorage.getItem('studentActivities');

      if (savedAuthUser) {
        setAuthUser(JSON.parse(savedAuthUser));
      }
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      if (savedCheckIns) {
        setCheckIns(JSON.parse(savedCheckIns));
      }
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem('studentProfile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('studentCheckIns', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('studentActivities', JSON.stringify(activities));
  }, [activities]);

  const handleOnboardingComplete = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    // Add initial activity
    addActivity({
      studentId: newProfile.id,
      type: 'achievement',
      category: 'onboarding',
      description: 'Completed profile setup and onboarding',
      sentiment: 'positive',
    });
  };

  const handleLoginSuccess = (user: User) => {
    setAuthUser(user);
    localStorage.setItem('authUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setAuthUser(null);
      setProfile(null);
      setCheckIns([]);
      setActivities([]);
      localStorage.removeItem('authUser');
      localStorage.removeItem('studentProfile');
      localStorage.removeItem('studentCheckIns');
      localStorage.removeItem('studentActivities');
      setCurrentView('dashboard');
    }
  };

  const handleCheckInComplete = (checkIn: DailyCheckInType) => {
    setCheckIns(prev => [checkIn, ...prev]);
    setShowCheckIn(false);
    
    // Add activity log
    addActivity({
      studentId: checkIn.studentId,
      type: 'mental-health',
      category: 'check-in',
      description: `Completed daily check-in: ${checkIn.mood} mood, ${checkIn.studyHours}h study`,
      sentiment: checkIn.mood === 'excellent' || checkIn.mood === 'good' ? 'positive' : checkIn.mood === 'okay' ? 'neutral' : 'negative',
    });
  };

  const addActivity = (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLog = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleResetProfile = () => {
    if (confirm('Are you sure you want to reset your profile? This will delete all your data but keep you logged in.')) {
      localStorage.removeItem('studentProfile');
      localStorage.removeItem('studentCheckIns');
      localStorage.removeItem('studentActivities');
      setProfile(null);
      setCheckIns([]);
      setActivities([]);
      setCurrentView('dashboard');
    }
  };

  // Show loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading your mentor...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!authUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show onboarding if authenticated but no profile
  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const todayCheckIn = checkIns.find(c => c.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                {authUser.photoURL ? (
                  <img src={authUser.photoURL} alt={authUser.name} className="w-full h-full rounded-lg" />
                ) : (
                  'SM'
                )}
              </div>
              <div>
                <h1 className="text-white font-semibold">Student Mentor AI</h1>
                <p className="text-xs text-slate-400">Hey, {profile.name}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'chat'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                💬 Chat
              </button>
              {!todayCheckIn && (
                <button
                  onClick={() => setShowCheckIn(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <span>✓</span>
                  <span>Check In</span>
                </button>
              )}
              <button
                onClick={() => setShowReport(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                📄 Report
              </button>
              <div className="relative group">
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-3 border-b border-slate-600">
                    <p className="text-sm font-medium text-white">{authUser.name || authUser.email}</p>
                    <p className="text-xs text-slate-400">{authUser.email}</p>
                  </div>
                  <button
                    onClick={handleResetProfile}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                  >
                    🔄 Reset Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-600 transition-colors rounded-b-lg"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)]">
        {currentView === 'dashboard' && (
          <Dashboard profile={profile} checkIns={checkIns} activities={activities} />
        )}
        {currentView === 'chat' && (
          <Chat profile={profile} checkIns={checkIns} activities={activities} onAddActivity={addActivity} />
        )}
      </main>

      {/* Modals */}
      {showCheckIn && (
        <DailyCheckIn
          profile={profile}
          onComplete={handleCheckInComplete}
          onClose={() => setShowCheckIn(false)}
        />
      )}

      {showReport && (
        <TeacherReport
          profile={profile}
          checkIns={checkIns}
          activities={activities}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Check-in Reminder */}
      {!todayCheckIn && checkIns.length > 0 && currentView !== 'dashboard' && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
          <span>📅</span>
          <span>Don't forget your daily check-in!</span>
          <button
            onClick={() => setShowCheckIn(true)}
            className="ml-2 bg-white text-green-600 px-3 py-1 rounded font-medium hover:bg-green-50 transition-colors"
          >
            Check In Now
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
