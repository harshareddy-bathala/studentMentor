// Authentication types
export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  provider: 'google' | 'email';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
