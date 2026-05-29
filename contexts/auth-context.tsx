'use client';

import { User } from '@/types';
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in production, this would call your auth API
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (email === 'admin@sigizi.id' && password === 'admin123') {
        setUser({
          id: 'admin1',
          name: 'Dr. Siti Nurhaliza',
          email,
          role: 'admin',
          siziLocation: 'SIGIZI Ceria, Jakarta Pusat',
        });
      } else if (email === 'kader@sigizi.id' && password === 'kader123') {
        setUser({
          id: 'kader1',
          name: 'Ibu Sinta',
          email,
          role: 'kader',
          siziLocation: 'SIGIZI Ceria, Jakarta Pusat',
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
