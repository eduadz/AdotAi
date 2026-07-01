"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function EditarAnimal() {
  const router = useRouter();
  const { id } = useParams(); // Captura o ID vindo da URL dynamic route
  const { user } = useAuth();

  // Estado idêntico ao de cadastro
  const [animal, setAnimal] = useState({
    nome: "",
    tipo: "",
    raca: "",
    genero: "",
    porte: "",
    cor: "",
    tipoPelagem: "",
    idade: "",
    energia: "",
    comorbidade: "",
    castrado: "",
    descricao: "",
  });

  const [loading, setLoading] = useState(true);

  // Carrega os dados do animal existentes ao entrar na página
  useEffect(() => {
    async function carregarAnimal() {
      try {
        // Ajuste a rota se o seu endpoint público de detalhes for diferente
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/pets/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Mapeamento Inverso: Transforma os dados do Banco (miúdos/enuns) para o padrão visual das Pills do Front
          setAnimal({
            nome: data.nome || "",
            tipo: data.tipo ? (data.tipo === "cachorro" ? "Cachorro" : "Gato") : "",
            raca: data.raca || "",
            genero: data.genero ? (data.genero === "femea" ? "Fêmea" : "Macho") : "",
            porte: data.porte ? (data.porte === "medio" ? "Médio" : data.porte.charAt(0).toUpperCase() + data.porte.slice(1)) : "",
            cor: data.cor_pelagem || "",
            tipoPelagem: data.tipo_pelagem || "",
            idade: data.idade ? data.idade.charAt(0).toUpperCase() + data.idade.slice(1) : "",
            energia: data.energia === "alta" ? "Muito ativo" : (data.energia === "media" ? "Moderado" : "Calmo"),
            comorbidade: data.comorbidade ? "Sim" : "Não",
            castrado: data.castrado ? "Sim" : "Não",
            descricao: data.descricao || "",
          });
        } else {
          alert("Animal não encontrado.");
          router.push("/admin");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do animal:", error);
        alert("Erro ao carregar dados do servidor.");
      } finally {
        setLoading(false);
      }
    }

    if (id) carregarAnimal();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mapeamento padrão: Transforma as Pills do front em dados limpos para o DTO do Backend
    const payload = {
      nome: animal.nome,
      raca: animal.raca,
      descricao: animal.descricao,
      tipo: animal.tipo.toLowerCase(),
      genero: animal.genero === "Fêmea" ? "femea" : "macho",
      porte: animal.porte === "Médio" ? "medio" : animal.porte.toLowerCase(),
      cor_pelagem: animal.cor,
      tipo_pelagem: animal.tipoPelagem,
      idade: animal.idade.toLowerCase(),
      energia: animal.energia === "Muito ativo" ? "alta" : (animal.energia === "Moderado" ? "media" : "baixa"),
      comorbidade: animal.comorbidade === "Sim",
      castrado: animal.castrado === "Sim"
    };

    try {
      // Dispara a requisição PATCH para atualizar o registro específico
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/pets/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`Alterações de ${animal.nome} salvas com sucesso!`);
        router.push("/admin");
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar: ${errorData.message || "Tente novamente"}`);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnimal((prev) => ({ ...prev, [name]: value }));
  };

  const renderPillGroup = (field: keyof typeof animal, label: string, options: string[]) => {
    return (
      <div className="flex flex-col gap-3">
        <label className="font-title font-bold text-adotai-textoPrincipal text-lg">
          {label}
        </label>
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => {
            const isSelected = animal[field] === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setAnimal((prev) => ({ 
                  ...prev, 
                  [field]: prev[field] === opt ? "" : opt 
                }))}
                className={`px-6 py-2 rounded-full font-paragraph font-bold text-sm border-[1.5px] border-adotai-textoPrincipal transition-all ${
                  isSelected
                    ? "bg-adotai-primaria text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] translate-y-[-2px]"
                    : "bg-[#8CBFB8]/30 text-adotai-textoPrincipal hover:bg-adotai-primaria/50"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-adotai-fundo flex items-center justify-center">
        <p className="text-xl font-title font-bold text-adotai-textoPrincipal animate-pulse">Carregando dados do bichinho...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />

      <main className="flex-1 flex flex-col items-start justify-start w-full mt-8">
        <div className="adotai-container w-full px-4 md:px-0">
          <div className="bg-adotai-fundoCard border-[1.5px] border-adotai-textoPrincipal rounded-adotai p-6 md:p-12 w-full shadow-sm">
          
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-2">
              Editar Dados do Animal
            </h1>
          </div>

          <form onSubmit={handleUpdate} className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-3">
              <label className="font-title font-bold text-adotai-textoPrincipal text-lg">
                Nome do animal:
              </label>
              <Input
                type="text"
                name="nome"
                placeholder="Ex: Caramelo"
                className="font-bold placeholder:font-bold"
                value={animal.nome}
                onChange={handleTextChange}
                required
              />
            </div>

            {renderPillGroup("tipo", "Tipo de animal:", ["Cachorro", "Gato"])}
            
            {renderPillGroup("raca", "Raça:", [
              "SRD (Sem Raça Definida)", "Poodle", "Pinscher", "Labrador", 
              "Golden Retriever", "Shih Tzu", "Persa", "Siamês", "Maine Coon", "Outro"
            ])}

            {renderPillGroup("genero", "Sexo:", ["Macho", "Fêmea"])}
            
            {renderPillGroup("porte", "Porte/Tamanho:", ["Pequeno", "Médio", "Grande"])}
            
            {renderPillGroup("cor", "Cor da pelagem:", [
              "Branco", "Preto", "Amarelo", "Laranja", "Rajado", 
              "Escaminha", "Siamês", "Frajola", "Marrom", "Cinza", "Pintado", "Tricolor"
            ])}
            
            {renderPillGroup("tipoPelagem", "Tipo da pelagem:", ["Curtos", "Médio", "Longos"])}
            
            {renderPillGroup("idade", "Idade:", ["Filhote", "Adulto", "Idoso"])}
            
            {renderPillGroup("energia", "Energia:", ["Muito ativo", "Moderado", "Calmo"])}
            
            {renderPillGroup("comorbidade", "Possui algum tipo de comorbidade?", ["Sim", "Não"])}
            
            {renderPillGroup("castrado", "Castrado:", ["Sim", "Não"])}

            <div className="flex flex-col gap-3">
              <label className="font-title font-bold text-adotai-textoPrincipal text-lg">
                Descrição do animal:
              </label>
              <textarea
                name="descricao"
                placeholder="Conte um pouco sobre a personalidade..."
                value={animal.descricao}
                onChange={handleTextChange}
                className="w-full bg-[#E1E8D8] border-[1.5px] border-adotai-textoPrincipal rounded-[20px] px-5 py-3 text-xl font-title font-bold text-adotai-textoPrincipal placeholder:text-adotai-textoPrincipal focus:outline-none focus:ring-2 focus:ring-adotai-primaria min-h-[120px] resize-y"
                required
              ></textarea>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                variant="secondary" 
                type="submit" 
                className="px-16 py-4 text-2xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal hover:bg-adotai-primaria transition-colors"
              >
                Salvar Alterações
              </Button>
            </div>
            
          </form>
          </div>
        </div>
      </main>
    </div>
  );
}