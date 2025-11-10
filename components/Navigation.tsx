/**
 * Navigation Component
 * 
 * Responsive navigation bar with:
 * - View switching (Dashboard, Homework, Tests, Peers, AI Mentor)
 * - Check-in button (shows when no check-in for today)
 * - Report button
 * - User menu with profile actions
 * 
 * Updated: Uses premium design system colors
 * 
 * Accessibility: Keyboard navigation, ARIA labels, focus states
 */

import React from 'react';
import { type User } from '../authTypes';
import { type StudentProfile } from '../types';

type View = 'dashboard' | 'chat' | 'checkin' | 'report' | 'homework' | 'tests' | 'peer-chat';

interface NavigationProps {
  authUser: User;
  profile: StudentProfile;
  currentView: View;
  hasTodayCheckIn: boolean;
  onViewChange: (view: View) => void;
  onCheckInClick: () => void;
  onReportClick: () => void;
  onEditGoals: () => void;
  onResetProfile: () => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  authUser,
  profile,
  currentView,
  hasTodayCheckIn,
  onViewChange,
  onCheckInClick,
  onReportClick,
  onEditGoals,
  onResetProfile,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard' as View, icon: '📊', label: 'Dashboard' },
    { id: 'homework' as View, icon: '📚', label: 'Homework' },
    { id: 'tests' as View, icon: '📝', label: 'Tests' },
    { id: 'peer-chat' as View, icon: '💬', label: 'Peers' },
    { id: 'chat' as View, icon: '🤖', label: 'AI Mentor' },
  ];

  return (
    <nav className="bg-panel border-b border-card-border sticky top-0 z-40 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-from to-primary-to rounded-xl flex items-center justify-center text-white font-bold shadow-card p-2">
              {authUser.photoURL ? (
                <img 
                  src={authUser.photoURL} 
                  alt={authUser.name} 
                  className="w-full h-full rounded-xl object-cover" 
                />
              ) : (
                <img 
                  src="/favicon_io/favicon-32x32.png" 
                  alt="Student Mentor AI" 
                  className="w-full h-full object-contain" 
                />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-semibold text-body">Student Mentor AI</h1>
              <p className="text-micro text-muted-ink">Hey, {profile.name.split(' ')[0]}!</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {/* Main Nav Buttons */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-4 py-2 rounded-xl text-body-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-discrete-highlight ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-primary-from to-primary-to text-white shadow-card'
                    : 'text-slate-300 hover:text-white hover:bg-panel-elevated'
                }`}
                aria-label={`View ${item.label}`}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
            
            {/* Check In Button (only show if no check-in today) */}
            {!hasTodayCheckIn && (
              <button
                onClick={onCheckInClick}
                className="px-4 py-2 bg-gradient-to-r from-accent-green to-primary-to hover:from-accent-green/90 hover:to-primary-to/90 text-white rounded-xl text-body-sm font-medium transition-all duration-200 shadow-card hover:shadow-card-hover flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent-green"
                aria-label="Complete daily check-in"
              >
                <span>✓</span>
                <span className="hidden sm:inline">Check In</span>
              </button>
            )}
            
            {/* Report Button */}
            <button
              onClick={onReportClick}
              className="px-4 py-2 bg-gradient-to-r from-primary-from to-primary-to hover:from-primary-from/90 hover:to-primary-to/90 text-white rounded-xl text-body-sm font-medium transition-all duration-200 shadow-card hover:shadow-card-hover flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-discrete-highlight"
              aria-label="View progress report"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Report</span>
            </button>
            
            {/* User Menu */}
            <div className="relative group">
              <button 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-green to-primary-to flex items-center justify-center text-white font-semibold shadow-card hover:shadow-card-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-discrete-highlight"
                aria-label="User menu"
                aria-haspopup="true"
              >
                {profile.name.charAt(0).toUpperCase()}
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className="absolute right-0 mt-2 w-56 bg-panel rounded-xl shadow-hero border border-card-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden"
                role="menu"
                aria-label="User menu options"
              >
                <div className="p-3 border-b border-card-border bg-panel-elevated">
                  <p className="text-body-sm font-medium text-white truncate">{authUser.name || authUser.email}</p>
                  <p className="text-micro text-muted-ink truncate">{authUser.email}</p>
                </div>
                
                <button
                  onClick={onEditGoals}
                  className="w-full text-left px-4 py-3 text-body-sm text-slate-300 hover:bg-panel-elevated hover:text-white transition-colors focus:outline-none focus:bg-panel-elevated focus:text-white flex items-center gap-2"
                  role="menuitem"
                >
                  <span className="text-lg">🎯</span>
                  <span>Edit Goals</span>
                </button>
                
                <button
                  onClick={onResetProfile}
                  className="w-full text-left px-4 py-3 text-body-sm text-slate-300 hover:bg-panel-elevated hover:text-white transition-colors focus:outline-none focus:bg-panel-elevated focus:text-white flex items-center gap-2"
                  role="menuitem"
                >
                  <span className="text-lg">🔄</span>
                  <span>Reset Profile</span>
                </button>
                
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 text-body-sm text-red-400 hover:bg-panel-elevated hover:text-red-300 transition-colors rounded-b-xl focus:outline-none focus:bg-panel-elevated flex items-center gap-2"
                  role="menuitem"
                >
                  <span className="text-lg">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
