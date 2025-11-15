import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/common/hooks/useAuth';
import { getStudentProfile, type StudentProfileRecord } from '@/api/client';
import OnboardingPage from '@/features/auth/OnboardingPage';
import FullScreenLoader from '@/router/components/FullScreenLoader';
import { ProfileProvider } from '@/common/context/ProfileContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, idToken } = useAuth();
  const [profile, setProfile] = useState<StudentProfileRecord | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProfile = useCallback(async () => {
    if (!idToken) {
      return;
    }

    setIsProfileLoading(true);
    setError(null);
    try {
      const record = await getStudentProfile(idToken);
      setProfile(record);
    } catch (err) {
      console.error('Failed to load student profile', err);
      setProfile(null);
      setError('Unable to load your student profile. Please try again.');
    } finally {
      setIsProfileLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    if (!idToken) {
      setProfile(null);
      return;
    }
    void fetchProfile();
  }, [fetchProfile, idToken]);

  const requiresOnboarding = !profile || profile.onboardingComplete === false;
  const providerValue = useMemo(
    () => ({ profile, refetchProfile: fetchProfile }),
    [profile, fetchProfile],
  );

  if (!user) {
    return null;
  }

  if (isProfileLoading) {
    return <FullScreenLoader message="Loading your profile..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-xl font-semibold">{error}</p>
        <button
          type="button"
          onClick={() => fetchProfile()}
          className="px-5 py-2 rounded-lg bg-sky-500 text-white font-medium hover:bg-sky-400"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ProfileProvider value={providerValue}>
      {requiresOnboarding ? <OnboardingPage idToken={idToken ?? null} /> : children}
    </ProfileProvider>
  );
};

export default AuthGuard;
