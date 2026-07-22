import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: { userId: string; username: string; email: string } | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<AuthContextType['user']>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const saveAuth = (data: AuthResponse) => {
    setToken(data.token);
    setUser({ userId: data.userId, username: data.username, email: data.email });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ userId: data.userId, username: data.username, email: data.email }));
  };

  const login = async (username: string, password: string) => {
    const data = await authService.login({ username, password });
    saveAuth(data);
  };

  const register = async (username: string, password: string, email: string) => {
    const data = await authService.register({ username, password, email });
    saveAuth(data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
