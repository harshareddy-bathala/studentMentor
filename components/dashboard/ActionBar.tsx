/**
 * ActionBar Component
 * 
 * Row of primary CTAs for quick actions:
 * - Ask Mentor (primary gradient button)
 * - Add New Goal (secondary)
 * - Today's Tasks (ghost)
 * 
 * Responsive: full-width on mobile, inline on desktop
 * Accessibility: Clear focus states, aria-labels
 */

import React from 'react';

interface ActionBarProps {
  onAskMentor: () => void;
  onAddGoal: () => void;
  onViewTasks: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onAskMentor,
  onAddGoal,
  onViewTasks
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Primary: Ask Mentor */}
      <button
        onClick={onAskMentor}
        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C4AB6] to-[#8B5CF6] text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Ask your AI Mentor"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Ask Mentor
      </button>

      {/* Secondary: Add Goal */}
      <button
        onClick={onAddGoal}
        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-700 hover:bg-slate-700 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Add a new goal"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Goal
      </button>

      {/* Ghost: Today's Tasks */}
      <button
        onClick={onViewTasks}
        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 text-slate-300 font-medium rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="View today's tasks"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Today's Tasks
      </button>
    </div>
  );
};
