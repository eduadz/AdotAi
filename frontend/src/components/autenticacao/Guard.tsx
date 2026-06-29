'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface GuardProps {
  allowedRoles: ('usuario' | 'administrador')[];
  children: React.ReactNode;
}

export default function Guard({ allowedRoles, children }: GuardProps) {
  const { user } = useAuth();

  // Se o utilizador não tiver a permissão necessária, o componente desaparece da árvore HTML
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}