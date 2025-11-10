/**
 * ActivitiesFeed Component
 * 
 * Compact feed of recent student activities with:
 * - Category chips (academic, wellness, sports)
 * - Timestamps
 * - Icons
 * - Filter options
 * 
 * Accessibility: Semantic list markup, filterable with keyboard
 */

import React, { useState } from 'react';

interface Activity {
  id: string;
  category: 'academic' | 'wellness' | 'sports';
  text: string;
  time: string;
  icon: string;
}

interface ActivitiesFeedProps {
  activities: Activity[];
  maxItems?: number;
}

export const ActivitiesFeed: React.FC<ActivitiesFeedProps> = ({
  activities,
  maxItems = 10
}) => {
  const [filter, setFilter] = useState<'all' | 'academic' | 'wellness' | 'sports'>('all');

  const categoryConfig = {
    academic: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-300',
      label: 'Academic'
    },
    wellness: {
      bg: 'bg-green-500/20',
      text: 'text-green-300',
      label: 'Wellness'
    },
    sports: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-300',
      label: 'Sports'
    }
  };

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.category === filter);

  const displayActivities = filteredActivities.slice(0, maxItems);

  return (
    <div className="bg-slate-800 rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Recent Activities
        </h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {(['all', 'academic', 'wellness', 'sports'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              filter === tab
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
            aria-label={`Filter by ${tab} activities`}
            aria-pressed={filter === tab}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Activities list */}
      <div className="space-y-3">
        {displayActivities.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">
            No activities to show
          </p>
        ) : (
          <ul className="space-y-3" role="list">
            {displayActivities.map((activity) => {
              const config = categoryConfig[activity.category];

              return (
                <li
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg text-lg">
                    {activity.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 mb-1">
                      {activity.text}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs ${config.bg} ${config.text} rounded`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* View all button */}
      {filteredActivities.length > maxItems && (
        <button
          className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-slate-300 border border-slate-700 hover:border-slate-600 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="View all activities"
        >
          View all {filteredActivities.length} activities
        </button>
      )}
    </div>
  );
};
