import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, getToken, setToken, type User } from './api';

interface SessionResponse {
  user: User;
  token: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api<{ user: User }>('/me')
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email: string, password: string): Promise<void> {
    const data = await api<SessionResponse>('/sessions', { method: 'POST', body: { email, password } });
    setToken(data.token);
    setUser(data.user);
  }

  async function signUp(name: string, email: string, password: string): Promise<void> {
    const data = await api<SessionResponse>('/users', { method: 'POST', body: { name, email, password } });
    setToken(data.token);
    setUser(data.user);
  }

  function signOut(): void {
    setToken(null);
    setUser(null);
  }

  function updateUser(next: User): void {
    setUser(next);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth precisa estar dentro de AuthProvider');
  }
  return value;
}
