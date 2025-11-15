import React, { useState } from 'react';
import { updateProfile } from '@/api/client';
import type { StudentProfile } from '@/types';

interface EditProfilePageProps {
  profile: StudentProfile;
  idToken: string | null;
  onClose: () => void;
  onProfileUpdated: (updates: Partial<StudentProfile>) => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ profile, idToken, onClose, onProfileUpdated }) => {
  const initialDob = profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '';
  const [name, setName] = useState(profile.name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(initialDob);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!idToken) {
      setError('You are not authenticated. Please sign in again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updated = await updateProfile(idToken, {
        name: name.trim(),
        dateOfBirth: dateOfBirth || undefined,
      });
      onProfileUpdated({
        name: updated.name ?? name,
        dateOfBirth: updated.dateOfBirth ?? dateOfBirth,
        updatedAt: updated.updatedAt,
      });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 900);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-8 space-y-6"
      >
        <header className="space-y-1">
          <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
          <p className="text-slate-400 text-sm">Keep your personal details up to date.</p>
        </header>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Full Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-to"
              placeholder="e.g. Maya Patel"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">Date of Birth</span>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-to"
            />
          </label>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {successMessage && <p className="text-sm text-accent-green">{successMessage}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-from to-primary-to text-white font-semibold shadow-card hover:shadow-card-hover disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
