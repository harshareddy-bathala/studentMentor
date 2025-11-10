/**
 * TodayPanel Component
 * 
 * Displays today's focus items with:
 * - Checkboxes for completion
 * - Subject tags
 * - Time estimates
 * - Quick action buttons (snooze/reschedule)
 * 
 * Accessibility: Checkboxes with labels, keyboard navigation
 */

import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  subject: string;
  timeEstimate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TodayPanelProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onSnoozeTask?: (taskId: string) => void;
  onRescheduleTask?: (taskId: string) => void;
}

export const TodayPanel: React.FC<TodayPanelProps> = ({
  tasks,
  onToggleTask,
  onSnoozeTask,
  onRescheduleTask
}) => {
  const priorityColors = {
    high: 'border-red-500/50 bg-red-500/10',
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    low: 'border-blue-500/50 bg-blue-500/10'
  };

  const priorityDots = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Today's Focus
        </h2>
        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded-full">
          {tasks.filter(t => !t.completed).length} pending
        </span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">
            No tasks for today. Great job! 🎉
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`relative border rounded-xl p-3 transition-all duration-200 ${
                task.completed
                  ? 'border-slate-700 bg-slate-700/50 opacity-60'
                  : priorityColors[task.priority]
              }`}
            >
              {/* Priority dot */}
              <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${priorityDots[task.priority]}`}></div>

              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <label className="relative flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className="sr-only peer"
                    aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  />
                  <div className="w-5 h-5 rounded border-2 border-slate-600 peer-checked:bg-[#3DD6B8] peer-checked:border-[#3DD6B8] flex items-center justify-center transition-all group-hover:border-[#3DD6B8]">
                    {task.completed && (
                      <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium mb-1 ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                      {task.subject}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {task.timeEstimate}
                    </span>
                  </div>

                  {/* Quick actions */}
                  {!task.completed && (onSnoozeTask || onRescheduleTask) && (
                    <div className="flex gap-2 mt-2">
                      {onSnoozeTask && (
                        <button
                          onClick={() => onSnoozeTask(task.id)}
                          className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                          aria-label={`Snooze task: ${task.title}`}
                        >
                          Snooze
                        </button>
                      )}
                      {onRescheduleTask && (
                        <button
                          onClick={() => onRescheduleTask(task.id)}
                          className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                          aria-label={`Reschedule task: ${task.title}`}
                        >
                          Reschedule
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Progress indicator */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Progress</span>
            <span>{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3DD6B8] to-[#6C4AB6] rounded-full transition-all duration-500"
              style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
