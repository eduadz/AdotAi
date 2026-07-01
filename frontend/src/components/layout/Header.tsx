"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="adotai-container bg-adotai-fundoHeader mt-4 md:mt-8 rounded-adotai shadow-adotai-btn borda-pelos flex flex-col justify-center py-3 px-4 md:px-6 relative z-50">
      <div className="flex justify-between items-center w-full">
        {/* Esquerda: Logo e os pets apoiados */}
        <div className="relative flex items-center">
          <div className="absolute -top-[76px] left-1/2 -translate-x-1/2 w-30 h-22 z-20 pointer-events-none hidden md:block">
            <Image 
              src="/pets_apoiados.png"
              alt="Pets apoiados no botão" 
              fill
              sizes="80px"
              className="object-contain object-bottom"
            />
          </div>

          {/* Botão Principal */}
          <Link href="/" className="relative z-10" onClick={() => setIsMenuOpen(false)}>
            <Button variant="primary" className="py-2 px-4 md:px-6 text-xs md:text-sm font-logo uppercase">
              ADOTAÍ
            </Button>
          </Link>
        </div>

        {/* Botão do Menu Hambúrguer (Mobile) */}
        <button
          className="md:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 border-2 border-adotai-textoSecundario rounded bg-adotai-fundoInput text-adotai-textoPrincipal"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Alternar menu"
        >
          <span className={`block w-5 h-0.5 bg-current transition-transform ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`}></span>
          <span className={`block w-5 h-0.5 bg-current transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}></span>
          <span className={`block w-5 h-0.5 bg-current transition-transform ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}></span>
        </button>

        {/* Direita: Botões de navegação (Desktop) */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/sobre">
            <Button variant="primary" className="py-2 px-6 text-sm">
              Sobre
            </Button>
          </Link>

          {user?.role !== 'administrador' && (
            <Link href="/feed">
              <Button variant="primary" className="py-2 px-6 text-sm">
                Adotar
              </Button>
            </Link>
          )}
          
          {user?.logado ? (
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
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col gap-3 mt-4 pt-4 border-t-2 border-adotai-textoSecundario border-dashed">
          <Link href="/sobre" onClick={() => setIsMenuOpen(false)}>
            <Button variant="primary" className="w-full py-2 px-6 text-sm">
              Sobre
            </Button>
          </Link>

          {user?.role !== 'administrador' && (
            <Link href="/feed" onClick={() => setIsMenuOpen(false)}>
              <Button variant="primary" className="w-full py-2 px-6 text-sm">
                Adotar
              </Button>
            </Link>
          )}
          
          {user?.logado ? (
            user.role === 'administrador' ? (
              <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" className="w-full py-2 px-6 text-sm">
                  Painel Admin
                </Button>
              </Link>
            ) : (
              <Link href="/perfil" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" className="w-full py-2 px-6 text-sm">
                  Perfil
                </Button>
              </Link>
            )
          ) : (
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="primary" className="w-full py-2 px-6 text-sm">
                Login
              </Button>
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}