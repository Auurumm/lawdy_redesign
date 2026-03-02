'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

interface SignupResult {
  user?: User;
  needsVerification?: boolean;
  email?: string;
}

interface LoginError extends Error {
  needsVerification?: boolean;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<SignupResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // 401이면 refresh 시도
        if (res.status === 401) {
          const refreshRes = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.error || '로그인에 실패했습니다.') as LoginError;
      if (data.needsVerification) {
        error.needsVerification = true;
        error.email = data.email;
      }
      throw error;
    }

    setUser(data.user);
  }

  async function signup(signupData: SignupData): Promise<SignupResult> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || '회원가입에 실패했습니다.');
    }

    // 이메일 인증이 필요한 경우 user state 미설정
    if (data.needsVerification) {
      return { needsVerification: true, email: data.email };
    }

    setUser(data.user);
    return { user: data.user };
  }

  async function logout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
