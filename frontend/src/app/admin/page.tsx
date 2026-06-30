"use client";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function PainelAdmin() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />

      <main className="flex-1 flex flex-col items-start justify-start w-full mt-12">
        <div className="adotai-container w-full">
        {/* Card Central do Dashboard */}
          <div className="bg-adotai-fundoCard border-[1.5px] border-adotai-textoPrincipal rounded-adotai p-8 md:p-12 w-full max-w-3xl shadow-sm mx-auto">
            
            <div className="mb-10 text-center">
              <h1 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-4">
                Painel Administrativo
              </h1>
              <p className="font-paragraph font-bold text-adotai-textoPrincipal text-sm md:text-base">
                O que você gostaria de fazer?
              </p>
            </div>

            {/* Menu de Botões */}
            <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
              
              {/* Botão: Cadastrar Animal */}
              <Link href="/admin/cadastrar-animal" className="w-full">
                <Button 
                  variant="primary" 
                  className="w-full py-5 text-2xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal hover:bg-adotai-primaria/90 transition-all"
                >
                  Cadastrar animal
                </Button>
              </Link>

              {/* Botão: Gerenciar Animais */}
              <Link href="/admin/gerenciar-animais" className="w-full">
                <Button 
                  variant="primary" 
                  className="w-full py-5 text-2xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal hover:bg-adotai-primaria/90 transition-all"
                >
                  Gerenciar Animais
                </Button>
              </Link>

              {/* Botão: Pedidos de adoção */}
              <Link href="/admin/pedidos-adocao" className="w-full">
                <Button 
                  variant="primary" 
                  className="w-full py-5 text-2xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal hover:bg-adotai-primaria/90 transition-all"
                >
                  Pedidos de adoção
                </Button>
              </Link>

            </div>
            <div className="mt-12 pt-8 border-t border-adotai-textoSecundario/20 flex justify-center">
              <Button 
                variant="destructive" 
                className="px-8 py-3 text-sm font-bold"
                onClick={logout}
              >
                Sair da conta
              </Button>
            </div>
          </div>        
        </div>      
      </main>
    </div>
  );
}