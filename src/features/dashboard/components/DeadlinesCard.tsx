/**
 * DeadlinesCard Component
 * 
 * Shows upcoming deadlines with:
 * - Subject tags
 * - Due dates
 * - Urgency badges (low/medium/high)
 * - Days remaining
 * 
 * Updated: Uses new premium design system colors
 * 
 * Accessibility: Clear hierarchy, semantic time elements
 */

import React from 'react';

interface Deadline {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  daysLeft: number;
  priority: 'low' | 'medium' | 'high';
}

interface DeadlinesCardProps {
  deadlines: Deadline[];
  onDeadlineClick?: (deadlineId: string) => void;
}

export const DeadlinesCard: React.FC<DeadlinesCardProps> = ({
  deadlines,
  onDeadlineClick
}) => {
  const priorityConfig = {
    high: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-300',
      label: 'Urgent'
    },
    medium: {
      bg: 'bg-accent-amber/10',
      border: 'border-accent-amber/30',
      text: 'text-accent-amber',
      badge: 'bg-accent-amber/20 text-yellow-300',
      label: 'Soon'
    },
    low: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300',
      label: 'Upcoming'
    }
  };

  const formatDaysLeft = (days: number): string => {
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days left`;
  };

  return (
    <div className="bg-panel rounded-2xl p-5 shadow-card border border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section-title text-white flex items-center gap-2">
          <span className="text-2xl">📅</span>
          Upcoming Deadlines
        </h2>
        {deadlines.length > 0 && (
          <span className="text-micro text-muted-ink bg-panel-elevated px-2 py-1 rounded-full">
            {deadlines.length} deadline{deadlines.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {deadlines.length === 0 ? (
          <p className="text-muted-ink text-body-sm text-center py-8">
            No upcoming deadlines. You're all caught up! ✨
          </p>
        ) : (
          deadlines.map((deadline) => {
            const config = priorityConfig[deadline.priority];
            const dueDate = new Date(deadline.dueDate);

            return (
              <button
                key={deadline.id}
                onClick={() => onDeadlineClick?.(deadline.id)}
                className={`w-full text-left border ${config.border} ${config.bg} rounded-xl p-3 hover:bg-opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-discrete-highlight`}
                aria-label={`View deadline: ${deadline.title}, ${formatDaysLeft(deadline.daysLeft)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-sm font-medium text-white mb-1 truncate">
                      {deadline.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-micro mb-2">
                      <span className="px-2 py-0.5 bg-panel-elevated text-slate-300 rounded">
                        {deadline.subject}
                      </span>
                      <span className={`px-2 py-0.5 ${config.badge} rounded font-medium`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-micro text-slate-400">
                      <time dateTime={deadline.dueDate} className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </time>
                      <span className={config.text}>•</span>
                      <span className={config.text}>
                        {formatDaysLeft(deadline.daysLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Quick add button */}
      <button
        className="w-full mt-4 py-2 text-body-sm text-slate-400 hover:text-slate-300 border border-dashed border-card-border hover:border-discrete-highlight rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-discrete-highlight"
        aria-label="Add new deadline"
      >
        + Add deadline
      </button>
    </div>
  );
};
