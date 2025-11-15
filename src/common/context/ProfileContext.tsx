import { createContext, useContext, type ReactNode } from 'react';
import type { StudentProfileRecord } from '@/api/client';

export interface ProfileContextValue {
  profile: StudentProfileRecord | null;
  refetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: ProfileContextValue;
}) => {
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextValue => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
