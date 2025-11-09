import React, { useState } from 'react';
import { Test } from '../types';

interface TestsListProps {
  studentId: string;
  tests: Test[];
  onUpdate: (tests: Test[]) => void;
}

export default function TestsList({ studentId, tests, onUpdate }: TestsListProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'week'>('upcoming');
  
  const updatePreparationStatus = (id: string, status: Test['preparationStatus']) => {
    const updated = tests.map(test => 
      test.id === id ? { ...test, preparationStatus: status } : test
    );
    onUpdate(updated);
  };

  const addNote = (id: string, note: string) => {
    const updated = tests.map(test => 
      test.id === id ? { ...test, notes: note } : test
    );
    onUpdate(updated);
  };

  const getFilteredTests = () => {
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return tests.filter(test => {
      const testDate = new Date(test.testDate);
      if (filter === 'all') return true;
      if (filter === 'upcoming') return testDate > now;
      if (filter === 'today') return testDate <= todayEnd && testDate >= now;
      if (filter === 'week') return testDate <= weekEnd && testDate >= now;
      return true;
    }).sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
  };

  const filteredTests = getFilteredTests();

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'board-exam': return 'bg-red-100 text-red-700 border-red-300';
      case 'final': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'midterm': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'unit-test': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'quiz': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'board-exam': return '🎓';
      case 'final': return '📊';
      case 'midterm': return '📝';
      case 'unit-test': return '📄';
      case 'quiz': return '✏️';
      default: return '📋';
    }
  };

  const getPreparationColor = (status: string) => {
    switch (status) {
      case 'well-prepared': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'not-started': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysUntilTest = (testDate: string) => {
    const days = Math.ceil((new Date(testDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Completed';
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📝 Upcoming Tests & Exams</h2>
          <p className="text-gray-600 mt-1">Stay prepared for your assessments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow-sm">
        {[
          { id: 'upcoming', label: 'Upcoming', icon: '🔜' },
          { id: 'today', label: 'Today', icon: '⚡' },
          { id: 'week', label: 'This Week', icon: '📅' },
          { id: 'all', label: 'All', icon: '📚' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tests List */}
      <div className="grid gap-4">
        {filteredTests.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests {filter !== 'all' ? filter : 'scheduled'}</h3>
            <p className="text-gray-600">Enjoy your study time!</p>
          </div>
        ) : (
          filteredTests.map(test => {
            const daysUntil = getDaysUntilTest(test.testDate);
            const isUrgent = new Date(test.testDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;
            
            return (
              <div
                key={test.id}
                className={`bg-white rounded-lg p-6 shadow-sm border-l-4 transition-all hover:shadow-md ${
                  isUrgent ? 'border-red-500' : 'border-indigo-500'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getImportanceIcon(test.importance)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{test.title}</h3>
                        <p className="text-sm text-gray-600">{test.subject} • {test.teacherName}</p>
                      </div>
                    </div>
                    {test.description && (
                      <p className="text-gray-700 mt-2">{test.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImportanceColor(test.importance)}`}>
                      {test.importance.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-4 py-2 rounded-lg font-bold ${
                      isUrgent ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {daysUntil}
                    </span>
                  </div>
                </div>

                {/* Test Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">📅 Test Date & Time</p>
                    <p className="text-gray-900">
                      {new Date(test.testDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {test.duration && (
                      <p className="text-sm text-gray-600 mt-1">Duration: {test.duration} minutes</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">📚 Syllabus Coverage</p>
                    <div className="flex flex-wrap gap-1">
                      {test.syllabus.map((topic, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preparation Status */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preparation Status</p>
                  <div className="flex gap-2">
                    {(['not-started', 'in-progress', 'well-prepared'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => updatePreparationStatus(test.id, status)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          test.preparationStatus === status
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full inline-block mr-2 ${getPreparationColor(status)}`}></div>
                        {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Study Materials */}
                {test.studyMaterials && test.studyMaterials.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">📖 Study Materials</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {test.studyMaterials.map((material, idx) => (
                        <li key={idx}>{material}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">📝 Your Notes</p>
                  <textarea
                    value={test.notes || ''}
                    onChange={(e) => addNote(test.id, e.target.value)}
                    placeholder="Add your preparation notes, questions, or reminders..."
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
