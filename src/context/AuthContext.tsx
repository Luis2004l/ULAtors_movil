import { login } from '@/api/auth';
import { setAuthToken, setUnauthorizedHandler } from '@/api/client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthState {
  token: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setToken(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
  }, [signOut]);

  const signIn = async (username: string, password: string) => {
    const { access_token } = await login(username, password);
    setAuthToken(access_token);
    setToken(access_token);
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth fuera de AuthProvider');
  }
  return context;
};
