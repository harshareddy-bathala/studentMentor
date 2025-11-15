import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';

import { auth } from '@/firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

type AuthMode = 'signin' | 'signup';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setError(null);
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        if (credential.user && fullName.trim()) {
          await updateProfile(credential.user, { displayName: fullName.trim() });
        }
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      }
    } catch (authError) {
      console.error(authError);
      setError('Unable to authenticate. Please double-check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (authError) {
      console.error(authError);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-purple-500 text-3xl">
            🎓
          </div>
          <h1 className="text-3xl font-semibold text-white">Student Mentor AI</h1>
          <p className="text-slate-400">Sign in to meet your personal mentor</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur p-6 space-y-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white py-3 font-medium text-slate-900 hover:bg-slate-100 transition disabled:opacity-60"
          >
            <span className="text-lg">🔐</span> Continue with Google
          </button>

          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="flex-1 border-t border-white/10" />
            or
            <span className="flex-1 border-t border-white/10" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Alex Rivera"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-slate-400 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="••••••••"
              />
            </div>

            {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-purple-500 py-3 font-semibold text-white hover:from-sky-400 hover:to-purple-400 transition disabled:opacity-60"
            >
              {isSubmitting ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-center text-sm text-slate-400 hover:text-white"
          >
            {mode === 'signin' ? "Need an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">By continuing you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default LoginPage;
