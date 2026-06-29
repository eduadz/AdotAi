"use client"; // Adicionado pois precisamos usar o hook useAuth do React

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user } = useAuth(); // Recupera o estado de autenticação

  return (
    <header className="adotai-container bg-adotai-fundoHeader mt-8 rounded-adotai shadow-adotai-btn borda-pelos flex justify-between items-center py-3 px-6">
      
      {/* Esquerda: Logo e os pets apoiados */}
      <div className="relative flex items-center">
        
        <div className="absolute -top-[76px] left-1/2 -translate-x-1/2 w-30 h-22 z-20 pointer-events-none">
          <Image 
            src="/pets_apoiados.png"
            alt="Pets apoiados no botão" 
            fill
            sizes="80px"
            className="object-contain object-bottom"
          />
        </div>

        {/* Botão Principal */}
        <Link href="/" className="relative z-10">
          <Button variant="primary" className="py-2 px-6 text-sm font-logo uppercase">
            ADOTAÍ
          </Button>
        </Link>

      </div>

      {/* Direita: Botões de navegação */}
      <nav className="flex items-center gap-4">
        <Link href="/sobre">
          <Button variant="primary" className="py-2 px-6 text-sm">
            Sobre
          </Button>
        </Link>

        <Link href="/feed">
          <Button variant="primary" className="py-2 px-6 text-sm">
            Adotar
          </Button>
        </Link>
        
        {/* Renderização Condicional: Admin, Perfil ou Login */}
        {user.logado ? (
          user.role === 'administrador' ? (
            <Link href="/admin">
              <Button variant="primary" className="py-2 px-6 text-sm">
                Painel Admin
              </Button>
            </Link>
          ) : (
            <Link href="/perfil">
              <Button variant="primary" className="py-2 px-6 text-sm">
                Perfil
              </Button>
            </Link>
          )
        ) : (
          <Link href="/login">
            <Button variant="primary" className="py-2 px-6 text-sm">
              Login
            </Button>
          </Link>
        )}
      </nav>
      
    </header>
  );
}