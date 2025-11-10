import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import DailyCheckIn from './components/DailyCheckIn';
import TeacherReport from './components/TeacherReport';
import GoalsEditor from './components/GoalsEditor';
import HomeworkList from './components/HomeworkList';
import TestsList from './components/TestsList';
import PeerChat from './components/PeerChat';
import TeacherAlerts from './components/TeacherAlerts';
import Navigation from './components/Navigation';
import { 
  type StudentProfile, 
  type DailyCheckIn as DailyCheckInType, 
  type ActivityLog,
  type Homework,
  type Test,
  type ChatContact,
  type PeerMessage,
  type Conversation,
  type TeacherAlert,
} from './types';
import { type User } from './authTypes';

type View = 'dashboard' | 'chat' | 'checkin' | 'report' | 'homework' | 'tests' | 'peer-chat';

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [checkIns, setCheckIns] = useState<DailyCheckInType[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [peerMessages, setPeerMessages] = useState<PeerMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [teacherAlerts, setTeacherAlerts] = useState<TeacherAlert[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showGoalsEditor, setShowGoalsEditor] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize mock data for demo
  const initializeMockData = () => {
    const mockHomework: Homework[] = [
      {
        id: '1',
        studentId: profile?.id || '',
        teacherId: 't1',
        teacherName: 'Mr. Smith',
        subject: 'Mathematics',
        title: 'Algebra Practice Problems',
        description: 'Complete exercises 1-20 from Chapter 5',
        assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        estimatedTime: 60,
        status: 'pending',
      },
      {
        id: '2',
        studentId: profile?.id || '',
        teacherId: 't2',
        teacherName: 'Ms. Johnson',
        subject: 'Science',
        title: 'Lab Report',
        description: 'Write a report on the chemical reactions experiment',
        assignedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        estimatedTime: 120,
        status: 'in-progress',
      },
    ];

    const mockTests: Test[] = [
      {
        id: '1',
        studentId: profile?.id || '',
        teacherId: 't1',
        teacherName: 'Mr. Smith',
        subject: 'Mathematics',
        title: 'Algebra Mid-term Exam',
        description: 'Covers chapters 1-5',
        testDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        syllabus: ['Linear Equations', 'Quadratic Equations', 'Functions', 'Graphs'],
        importance: 'midterm',
        preparationStatus: 'in-progress',
        createdAt: new Date().toISOString(),
      },
    ];

    const mockContacts: ChatContact[] = [
      {
        id: 'c1',
        name: 'Sarah Chen',
        role: 'student',
        class: '10th Grade',
        isOnline: true,
      },
      {
        id: 't1',
        name: 'Mr. Smith',
        role: 'teacher',
        subject: 'Mathematics',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setHomework(mockHomework);
    setTests(mockTests);
    setContacts(mockContacts);
    localStorage.setItem('studentHomework', JSON.stringify(mockHomework));
    localStorage.setItem('studentTests', JSON.stringify(mockTests));
    localStorage.setItem('chatContacts', JSON.stringify(mockContacts));
  };

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedAuthUser = localStorage.getItem('authUser');
      const savedProfile = localStorage.getItem('studentProfile');
      const savedCheckIns = localStorage.getItem('studentCheckIns');
      const savedActivities = localStorage.getItem('studentActivities');
      const savedHomework = localStorage.getItem('studentHomework');
      const savedTests = localStorage.getItem('studentTests');
      const savedContacts = localStorage.getItem('chatContacts');
      const savedMessages = localStorage.getItem('peerMessages');
      const savedConversations = localStorage.getItem('conversations');
      const savedAlerts = localStorage.getItem('teacherAlerts');

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
      if (savedHomework) {
        setHomework(JSON.parse(savedHomework));
      } else {
        // Initialize with mock data for demo
        initializeMockData();
      }
      if (savedTests) {
        setTests(JSON.parse(savedTests));
      }
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }
      if (savedMessages) {
        setPeerMessages(JSON.parse(savedMessages));
      }
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      }
      if (savedAlerts) {
        setTeacherAlerts(JSON.parse(savedAlerts));
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

  useEffect(() => {
    localStorage.setItem('studentHomework', JSON.stringify(homework));
  }, [homework]);

  useEffect(() => {
    localStorage.setItem('studentTests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('peerMessages', JSON.stringify(peerMessages));
  }, [peerMessages]);

  useEffect(() => {
    localStorage.setItem('teacherAlerts', JSON.stringify(teacherAlerts));
  }, [teacherAlerts]);

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

  const handleSendPeerMessage = (receiverId: string, message: string) => {
    const newMessage: PeerMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${[profile!.id, receiverId].sort().join('-')}`,
      senderId: profile!.id,
      senderName: profile!.name,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text',
    };
    setPeerMessages(prev => [...prev, newMessage]);
    
    // Update or create conversation
    setConversations(prev => {
      const existing = prev.find(c => c.id === newMessage.conversationId);
      if (existing) {
        return prev.map(c => c.id === newMessage.conversationId
          ? { ...c, lastMessage: message, lastMessageTime: newMessage.timestamp }
          : c
        );
      }
      return [...prev, {
        id: newMessage.conversationId,
        participants: [profile!.id, receiverId],
        lastMessage: message,
        lastMessageTime: newMessage.timestamp,
        unreadCount: 0,
        type: 'peer',
      }];
    });
  };

  const handleDismissAlert = (alertId: string) => {
    setTeacherAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleProfileUpdate = (updates: Partial<StudentProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const handleTriggerAlert = (alert: Omit<TeacherAlert, 'id' | 'createdAt'>) => {
    const newAlert: TeacherAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    };
    setTeacherAlerts(prev => [newAlert, ...prev]);
    
    // Add activity log for the alert
    addActivity({
      studentId: profile!.id,
      type: 'challenge',
      category: 'teacher-alert',
      description: `AI triggered teacher alert: ${alert.title}`,
      sentiment: 'negative',
    });
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
    <div className="min-h-screen bg-bg-dark font-sans">
      {/* Navigation */}
      <Navigation
        authUser={authUser}
        profile={profile}
        currentView={currentView}
        hasTodayCheckIn={!!todayCheckIn}
        onViewChange={setCurrentView}
        onCheckInClick={() => setShowCheckIn(true)}
        onReportClick={() => setShowReport(true)}
        onEditGoals={() => setShowGoalsEditor(true)}
        onResetProfile={handleResetProfile}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)] overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Teacher Alerts */}
          {teacherAlerts.length > 0 && currentView === 'dashboard' && (
            <div className="mb-6">
              <TeacherAlerts alerts={teacherAlerts} onDismiss={handleDismissAlert} />
            </div>
          )}

          {currentView === 'dashboard' && (
            <Dashboard 
              profile={profile} 
              checkIns={checkIns} 
              activities={activities} 
              homework={homework}
              tests={tests}
            />
          )}
          {currentView === 'homework' && (
            <HomeworkList studentId={profile.id} homework={homework} onUpdate={setHomework} />
          )}
          {currentView === 'tests' && (
            <TestsList studentId={profile.id} tests={tests} onUpdate={setTests} />
          )}
          {currentView === 'peer-chat' && (
            <PeerChat
              currentUserId={profile.id}
              currentUserName={profile.name}
              contacts={contacts}
              conversations={conversations}
              messages={peerMessages}
              onSendMessage={handleSendPeerMessage}
            />
          )}
          {currentView === 'chat' && (
            <Chat 
              profile={profile} 
              checkIns={checkIns} 
              activities={activities}
              homework={homework}
              tests={tests}
              onAddActivity={addActivity} 
              onTriggerAlert={handleTriggerAlert}
            />
          )}
        </div>
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

      {showGoalsEditor && (
        <GoalsEditor
          profile={profile}
          onUpdate={handleProfileUpdate}
          onClose={() => setShowGoalsEditor(false)}
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
