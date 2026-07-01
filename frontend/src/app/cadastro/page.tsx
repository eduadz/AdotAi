"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        router.push("/login");
      } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar: ${errorData.message || "Tente novamente"}`);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center w-full mt-8">
        <div className="adotai-container w-full">
          <div className="bg-adotai-fundoCard border border-adotai-textoSecundario rounded-adotai p-8 md:p-12 w-full max-w-[500px] mx-auto">
            <h1 className="text-5xl md:text-6xl font-title font-bold text-adotai-textoPrincipal text-center mb-8">
              Cadastrar
            </h1>

            <form className="flex flex-col gap-4" onSubmit={handleCadastro}>
              <Input type="text" name="nome" placeholder="Nome Completo" value={formData.nome} onChange={handleChange} required className="font-bold placeholder:font-bold" />
              <Input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required className="font-bold placeholder:font-bold" />
              <Input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required className="font-bold placeholder:font-bold" />
              <Input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required className="font-bold placeholder:font-bold" />
              <Input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required className="font-bold placeholder:font-bold" />

              <Button variant="primary" type="submit" className="w-full text-2xl mt-2">
                Cadastrar meu perfil
              </Button>
            </form>
          </div>
          
          <p className="mt-6 text-xl font-title font-bold text-adotai-textoPrincipal text-center">
            Já possui cadastro? <Link href="/login" className="hover:opacity-80 underline transition-opacity">Faça login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}