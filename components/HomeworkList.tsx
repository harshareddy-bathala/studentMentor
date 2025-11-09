import React, { useState } from 'react';
import { Homework } from '../types';

interface HomeworkListProps {
  studentId: string;
  homework: Homework[];
  onUpdate: (homework: Homework[]) => void;
}

export default function HomeworkList({ studentId, homework, onUpdate }: HomeworkListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');

  const toggleComplete = (id: string) => {
    const updated = homework.map(hw => {
      if (hw.id === id) {
        const newStatus: Homework['status'] = hw.status === 'completed' ? 'pending' : 'completed';
        return {
          ...hw,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return hw;
    });
    onUpdate(updated);
  };

  const updateStatus = (id: string, status: Homework['status']) => {
    const updated = homework.map(hw => {
      if (hw.id === id) {
        return { ...hw, status };
      }
      return hw;
    });
    onUpdate(updated);
  };

  const filteredHomework = homework.filter(hw => {
    if (filter === 'all') return true;
    if (filter === 'pending') return hw.status !== 'completed' && hw.status !== 'submitted';
    if (filter === 'completed') return hw.status === 'completed' || hw.status === 'submitted';
    return true;
  });

  const sortedHomework = [...filteredHomework].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'submitted': return '📤';
      case 'in-progress': return '⏳';
      case 'overdue': return '⚠️';
      default: return '📝';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed' && status !== 'submitted';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days left`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📚 Homework & To-Do</h2>
          <p className="text-gray-600 mt-1">Track your assignments and tasks</p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({homework.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({homework.filter(h => h.status !== 'completed' && h.status !== 'submitted').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed ({homework.filter(h => h.status === 'completed' || h.status === 'submitted').length})
          </button>
        </div>
        <div className="ml-auto flex gap-2 items-center">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Homework List */}
      <div className="space-y-3">
        {sortedHomework.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'No homework assigned yet' : `No ${filter} homework`}
            </p>
          </div>
        ) : (
          sortedHomework.map(hw => (
            <div
              key={hw.id}
              className={`bg-white rounded-lg p-5 shadow-sm border-l-4 transition-all hover:shadow-md ${
                isOverdue(hw.dueDate, hw.status)
                  ? 'border-red-500'
                  : hw.status === 'completed' || hw.status === 'submitted'
                  ? 'border-green-500 opacity-75'
                  : 'border-indigo-500'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={hw.status === 'completed' || hw.status === 'submitted'}
                  onChange={() => toggleComplete(hw.id)}
                  className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        hw.status === 'completed' || hw.status === 'submitted' ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {getStatusIcon(hw.status)} {hw.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{hw.subject} • {hw.teacherName}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(hw.priority)}`}>
                        {hw.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{hw.description}</p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className={`font-medium ${
                      isOverdue(hw.dueDate, hw.status) ? 'text-red-600' :
                      new Date(hw.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      📅 {getDaysUntilDue(hw.dueDate)}
                    </span>
                    {hw.estimatedTime && (
                      <span className="text-gray-600">⏱️ {hw.estimatedTime} min</span>
                    )}
                    <span className="text-gray-600">
                      Assigned: {new Date(hw.assignedDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Update */}
                  {hw.status !== 'completed' && hw.status !== 'submitted' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => updateStatus(hw.id, 'in-progress')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          hw.status === 'in-progress'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(hw.id, 'submitted')}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                      >
                        Mark Submitted
                      </button>
                    </div>
                  )}

                  {hw.completedAt && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Completed on {new Date(hw.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
