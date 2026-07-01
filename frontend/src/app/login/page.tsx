// AdotAi/frontend/src/app/login/page.tsx
"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { realizarLogin } = useAuth();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // CORREÇÃO 1: Usar 'data.access_token' (conforme retorna do backend)
        realizarLogin(data.access_token, data.role);
        
        alert("Bem-vindo de volta!");
        
        // CORREÇÃO 2: Testar 'administrador' (conforme a tipagem do AuthContext)
        if (data.role === "administrador") {
          router.push("/admin");
        } else {
          router.push("/perfil");
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Credenciais inválidas. Tente novamente.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center w-full mt-8">
        <div className="adotai-container w-full px-4 md:px-0">
          <div className="bg-adotai-fundoCard border-[1.5px] border-adotai-textoPrincipal rounded-adotai p-6 md:p-12 w-full max-w-[500px] mx-auto">
            <h1 className="text-4xl md:text-6xl font-title font-bold text-adotai-textoPrincipal text-center mb-8">
              Login
            </h1>

            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              <Input
                type="email"
                name="email"
                placeholder="E-mail"
                className="font-bold placeholder:font-bold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Input
                type="password"
                placeholder="Senha"
                className="font-bold placeholder:font-bold"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />

              <Button 
                variant="primary" 
                type="submit" 
                className="w-full text-2xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal mt-2"
              >
                Entrar
              </Button>
            </form>
          </div>

          <p className="mt-6 text-xl font-title font-bold text-adotai-textoPrincipal text-center">
            Ainda não possui conta?{" "}
            <Link href="/cadastro" className="hover:opacity-80 underline transition-opacity" >
              Cadastre-se 
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}