'use client';

import React, { useEffect } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="adotai-modal-overlay">
      {/* Clique fora para fechar */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="adotai-modal-content">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-adotai-textoPrincipal hover:opacity-70 font-bold font-paragraph text-sm cursor-pointer"
        >
          ✕
        </button>

        <h2 className="font-title font-extrabold text-2xl md:text-3xl text-adotai-textoPrincipal mb-6 pr-6">
          {title}
        </h2>

        <div className="adotai-card-sm mb-6 text-xs md:text-sm text-adotai-textoSecundario leading-relaxed">
          {children}
        </div>

      </div>
    </div>
  );
}