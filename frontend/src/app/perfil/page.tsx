"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function Perfil() {
  const { user, logout } = useAuth();
  
  // 1. O estado agora espelha exatamente a estrutura do seu banco de dados
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    cidade: "Florestal", // Valor default conforme seu banco
    bairro: "",
    logradouro: "",
    numero: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/me", {
          headers: {
            "Authorization": `Bearer ${user?.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            nome: data.nome || "",
            cpf: data.cpf || "",
            telefone: data.telefone || "",
            email: data.email || "",
            // Extrai os dados do objeto endereco retornado pelo backend
            cidade: data.endereco?.cidade || "Florestal",
            bairro: data.endereco?.bairro || "",
            logradouro: data.endereco?.logradouro || "",
            numero: data.endereco?.numero || "",
          });
        } else {
          console.error("Falha ao carregar dados do usuário.");
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // 2. Prepara o objeto exatamente como o backend/banco espera
    const payload = {
      nome: formData.nome,
      cpf: formData.cpf,
      telefone: formData.telefone,
      email: formData.email,
      endereco: {
        cidade: formData.cidade,
        bairro: formData.bairro,
        logradouro: formData.logradouro,
        numero: formData.numero
      }
    };

    try {
      const response = await fetch("http://localhost:8000/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload), // Envia o payload estruturado
      });

      if (response.ok) {
        alert("Dados atualizados com sucesso!");
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar: ${errorData.message || "Tente novamente."}`);
      }
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      alert("Erro de conexão ao tentar salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-adotai-fundo flex items-center justify-center pb-12">
        <Header />
        <p className="font-title font-bold text-xl text-adotai-textoPrincipal animate-pulse mt-20">
          Carregando perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />

      <main className="flex-1 flex flex-col items-start justify-start w-full mt-8">
        <div className="adotai-container w-full">
          <div className="bg-adotai-fundoCard border border-adotai-textoPrincipal rounded-adotai p-8 md:p-12 w-full max-w-4xl mx-auto">
          
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-4">
                Informações Pessoais
              </h1>
              <p className="font-paragraph font-bold text-adotai-textoPrincipal text-sm md:text-base">
                Mantenha suas informações atualizadas abaixo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Dados Básicos */}
              <Input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                className="font-bold placeholder:font-bold"
                required
              />
              
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-1/3">
                  <Input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="CPF"
                    className="font-bold placeholder:font-bold"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <Input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="Telefone"
                    className="font-bold placeholder:font-bold"
                  />
                </div>
              </div>

              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="font-bold placeholder:font-bold"
                required
              />

              {/* Seção de Endereço Espelhando o Banco de Dados */}
              <div className="border-t border-adotai-textoSecundario/20 pt-5 mt-2">
                <h3 className="font-title font-bold text-adotai-textoPrincipal text-xl mb-4">
                  Endereço
                </h3>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-3/4">
                      <Input
                        type="text"
                        name="logradouro"
                        value={formData.logradouro}
                        onChange={handleChange}
                        placeholder="Logradouro (Ex: Rua Campo Grande)"
                        className="font-bold placeholder:font-bold"
                      />
                    </div>
                    <div className="w-full sm:w-2/4">
                      <Input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="Número (Ex: 121)"
                        className="font-bold placeholder:font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-1/2">
                      <Input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        placeholder="Bairro (Ex: Pernambuco)"
                        className="font-bold placeholder:font-bold"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <Input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Cidade (Ex: Florestal)"
                        className="font-bold placeholder:font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-8 pt-8 border-t border-adotai-textoSecundario/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button 
                  type="button"
                  variant="destructive" 
                  className="w-full sm:w-auto px-8 py-3 text-sm font-bold"
                  onClick={logout}
                >
                  Sair da conta
                </Button>

                <Button 
                  type="submit"
                  variant="primary" 
                  className="w-full sm:w-auto px-8 py-3 text-sm font-bold bg-adotai-primaria text-white"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
            
          </div>
        </div>
      </main>
    </div>
  );
}