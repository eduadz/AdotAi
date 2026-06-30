"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface NoMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoMatchModal({ isOpen, onClose }: NoMatchModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Ops! Nenhum match :("
    >
      <div className="text-center flex flex-col items-center space-y-6">
        <p className="font-bold text-adotai-textoPrincipal">
          Não encontramos nenhum amiguinho com as características exatas que você procurou.
        </p>
        <p className="text-adotai-textoSecundario text-sm">
          Que tal alterar um pouco as suas preferências? Muitas vezes o seu melhor amigo pode estar fora das características que você imaginava!
        </p>
      </div>
    </Modal>
  );
}