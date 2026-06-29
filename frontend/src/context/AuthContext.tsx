'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  logado: boolean;
  role: 'usuario' | 'administrador' | null;
  token?: string;
}

interface AuthContextType {
  user: User;
  realizarLogin: (token: string, role: 'usuario' | 'administrador') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ logado: false, role: null });
  const router = useRouter();

  // Ao carregar a aplicação, verifica se já existe um token salvo
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as 'usuario' | 'administrador';
    
    if (token && role) {
      setUser({ logado: true, role, token });
    }
  }, []);

  const realizarLogin = (token: string, role: 'usuario' | 'administrador') => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUser({ logado: true, role, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser({ logado: false, role: null });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, realizarLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}