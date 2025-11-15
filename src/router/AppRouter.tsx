import React from 'react';
import { useAuth } from '@/common/hooks/useAuth';
import LoginPage from '@/features/auth/LoginPage';
import AuthGuard from '@/router/AuthGuard';
import FullScreenLoader from '@/router/components/FullScreenLoader';
import ProtectedApp from '@/ProtectedApp';

const AppRouter: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader message="Checking your session..." />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AuthGuard>
      <ProtectedApp />
    </AuthGuard>
  );
};

export default AppRouter;
