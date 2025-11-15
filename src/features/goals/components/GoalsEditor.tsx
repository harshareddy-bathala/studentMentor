import React, { useEffect, useState } from 'react';
import { getGoals, updateGoals, type StudentGoalsPayload } from '@/api/client';
import { StudentProfile } from '@/types';

interface GoalsEditorProps {
  profile: StudentProfile;
  idToken: string;
  onUpdate: (updates: Partial<StudentProfile>) => void;
  onClose: () => void;
}

export default function GoalsEditor({ profile, idToken, onUpdate, onClose }: GoalsEditorProps) {
  const [currentGoals, setCurrentGoals] = useState<string[]>(profile.currentGoals || []);
  const [shortTermGoals, setShortTermGoals] = useState<string[]>(profile.shortTermGoals || []);
  const [longTermGoals, setLongTermGoals] = useState<string[]>(profile.longTermGoals || []);
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [careerAspirations, setCareerAspirations] = useState(profile.careerAspirations || '');
  const [dreamJob, setDreamJob] = useState(profile.dreamJob || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'short' | 'long' | 'career' | 'interests'>('current');

  const applyGoals = (source?: StudentGoalsPayload | Partial<StudentProfile> | null) => {
    setCurrentGoals(source?.currentGoals ?? []);
    setShortTermGoals(source?.shortTermGoals ?? []);
    setLongTermGoals(source?.longTermGoals ?? []);
    setInterests(source?.interests ?? []);
    setCareerAspirations(source?.careerAspirations ?? '');
    setDreamJob(source?.dreamJob ?? '');
  };

  useEffect(() => {
    let isMounted = true;
    const fetchGoals = async () => {
      setLoading(true);
      setError(null);
      try {
        const { goals } = await getGoals(idToken);
        if (!isMounted) return;
        if (goals) {
          applyGoals(goals);
        } else {
          applyGoals(profile);
        }
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Unable to load goals. Showing saved profile data instead.';
        setError(message);
        applyGoals(profile);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchGoals();
    return () => {
      isMounted = false;
    };
  }, [idToken, profile]);

  const addGoal = (type: 'current' | 'short' | 'long') => {
    if (!newGoal.trim()) return;
    
    if (type === 'current') {
      setCurrentGoals([...currentGoals, newGoal.trim()]);
    } else if (type === 'short') {
      setShortTermGoals([...shortTermGoals, newGoal.trim()]);
    } else if (type === 'long') {
      setLongTermGoals([...longTermGoals, newGoal.trim()]);
    }
    setNewGoal('');
  };

  const removeGoal = (type: 'current' | 'short' | 'long', index: number) => {
    if (type === 'current') {
      setCurrentGoals(currentGoals.filter((_, i) => i !== index));
    } else if (type === 'short') {
      setShortTermGoals(shortTermGoals.filter((_, i) => i !== index));
    } else if (type === 'long') {
      setLongTermGoals(longTermGoals.filter((_, i) => i !== index));
    }
  };

  const addInterest = () => {
    if (!newGoal.trim()) return;
    setInterests([...interests, newGoal.trim()]);
    setNewGoal('');
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const payload: StudentGoalsPayload = {
      currentGoals,
      shortTermGoals,
      longTermGoals,
      interests,
      careerAspirations,
      dreamJob,
    };

    setSaving(true);
    setError(null);
    try {
      await updateGoals(idToken, payload);
      onUpdate({
        ...payload,
        updatedAt: new Date().toISOString(),
      });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save your goals. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Edit Your Goals & Aspirations</h2>
          <p className="text-purple-100">Update your goals anytime as your interests evolve</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 overflow-x-auto">
          {[
            { id: 'current', label: '📌 Current Goals' },
            { id: 'short', label: '⏳ Short-term' },
            { id: 'long', label: '🎯 Long-term' },
            { id: 'career', label: '💼 Career' },
            { id: 'interests', label: '❤️ Interests' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && <p className="text-center text-gray-500 py-4">Loading your goals...</p>}
          {error && !loading && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {/* Current Goals */}
          {activeTab === 'current' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Focus Areas</h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal('current')}
                  placeholder="Add a current goal..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => addGoal('current')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {currentGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="flex-1">{goal}</span>
                    <button
                      onClick={() => removeGoal('current', idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {currentGoals.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No current goals set</p>
                )}
              </div>
            </div>
          )}

          {/* Short-term Goals */}
          {activeTab === 'short' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Short-term Goals (3-6 months)</h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal('short')}
                  placeholder="Add a short-term goal..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => addGoal('short')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {shortTermGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="flex-1">{goal}</span>
                    <button
                      onClick={() => removeGoal('short', idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {shortTermGoals.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No short-term goals set</p>
                )}
              </div>
            </div>
          )}

          {/* Long-term Goals */}
          {activeTab === 'long' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Long-term Goals (1+ years)</h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal('long')}
                  placeholder="Add a long-term goal..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => addGoal('long')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {longTermGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="flex-1">{goal}</span>
                    <button
                      onClick={() => removeGoal('long', idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {longTermGoals.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No long-term goals set</p>
                )}
              </div>
            </div>
          )}

          {/* Career Aspirations */}
          {activeTab === 'career' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Aspirations
                </label>
                <textarea
                  value={careerAspirations}
                  onChange={(e) => setCareerAspirations(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="What career path interests you?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dream Job
                </label>
                <input
                  type="text"
                  value={dreamJob}
                  onChange={(e) => setDreamJob(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="What's your dream job?"
                />
              </div>
            </div>
          )}

          {/* Interests */}
          {activeTab === 'interests' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Interests & Hobbies</h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  placeholder="Add an interest..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addInterest}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-full"
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(idx)}
                      className="text-pink-500 hover:text-pink-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {interests.length === 0 && (
                  <p className="text-gray-500 text-center py-8 w-full">No interests added yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-60"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
