"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import MatchView from "@/components/feed/MatchView";
import NoMatchModal from "@/components/feed/NoMatchModal";

export interface Filtros {
  tipo: string;
  raca: string;
  genero: string;
  porte: string;
  cor: string;
  tipoPelagem: string;
  idade: string;
  energia: string;
  comorbidade: string;
  castrado: string;
}

export interface Pet extends Filtros {
  id_pet: number;
  nome: string;
  curtidas: number;
  foto: string;
  descricao?: string;
}

export default function Feed() {
  // 1. Inicia o estado vazio
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Busca os dados do backend ao carregar a página
  useEffect(() => {
    async function carregarPets() {
      try {
        // Busca apenas animais com status disponível
        const response = await fetch("http://localhost:8000/pets?status=disponivel");
        if (response.ok) {
          const data = await response.json();
          
          // 3. Mapeia o formato do banco para o formato do Frontend
          const petsMapeados = data.map((pet: any) => ({
            id_pet: pet.id_pet,
            nome: pet.nome,
            tipo: pet.tipo ? (pet.tipo === "cachorro" ? "Cachorro" : "Gato") : "",
            raca: pet.raca || "SRD (Sem Raça Definida)",
            genero: pet.genero === "femea" ? "Fêmea" : "Macho",
            porte: pet.porte === "medio" ? "Médio" : (pet.porte ? pet.porte.charAt(0).toUpperCase() + pet.porte.slice(1) : ""),
            cor: pet.cor_pelagem || "",
            tipoPelagem: pet.tipo_pelagem || "",
            idade: pet.idade ? pet.idade.charAt(0).toUpperCase() + pet.idade.slice(1) : "",
            energia: pet.energia === "alta" ? "Muito ativo" : (pet.energia === "media" ? "Moderado" : "Calmo"),
            comorbidade: pet.comorbidade ? "Sim" : "Não",
            castrado: pet.castrado ? "Sim" : "Não",
            // Se o backend ainda não retorna curtidas e foto, mockamos para o visual não quebrar
            curtidas: pet.curtidas || 0,
            foto: (pet.fotos && pet.fotos.length > 0) ? pet.fotos[0].url : "/caoEgato.png",
            descricao: pet.descricao || ""
          }));

          setPets(petsMapeados);
        }
      } catch (error) {
        console.error("Erro ao buscar animais:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarPets();
  }, []);

  const filtrosIniciais: Filtros = {
    tipo: "", raca: "", genero: "", porte: "", cor: "", 
    tipoPelagem: "", idade: "", energia: "", comorbidade: "", castrado: ""
  };
  
  const [filtrosTemporarios, setFiltrosTemporarios] = useState<Filtros>(filtrosIniciais);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>(filtrosIniciais);
  
  const [isMatchMode, setIsMatchMode] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showNoMatchModal, setShowNoMatchModal] = useState(false);

  const filterGroups = [
    { label: "Tipo de animal:", name: "tipo", options: ["Cachorro", "Gato"] },
    { label: "Raça:", name: "raca", options: ["SRD (Sem Raça Definida)", "Poodle", "Pinscher", "Labrador", "Golden Retriever", "Shih Tzu", "Persa", "Siamês", "Maine Coon", "Outro"] },
    { label: "Sexo:", name: "genero", options: ["Macho", "Fêmea"] },
    { label: "Porte/Tamanho", name: "porte", options: ["Pequeno", "Médio", "Grande"] },
    { label: "Cor da pelagem", name: "cor", options: ["Branco", "Preto", "Amarelo", "Laranja", "Rajado", "Escaminha", "Siamês", "Frajola", "Marrom", "Cinza", "Pintado", "Tricolor"] },
    { label: "Tipo da pelagem", name: "tipoPelagem", options: ["Curtos", "Médio", "Longos"] },
    { label: "Idade", name: "idade", options: ["Filhote", "Adulto", "Idoso"] },
    { label: "Energia:", name: "energia", options: ["Muito ativo", "Moderado", "Calmo"] },
    { label: "Aceita animal com algum tipo de comorbidade?", name: "comorbidade", options: ["Sim", "Não"] },
    { label: "Castrado:", name: "castrado", options: ["Sim", "Não"] },
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltrosTemporarios((prev) => ({ ...prev, [name]: value }));
  };

  const limparFiltros = () => {
    setFiltrosTemporarios(filtrosIniciais);
    setFiltrosAplicados(filtrosIniciais);
    setIsMatchMode(false);
  };

  const handleCloseModal = () => {
    setShowNoMatchModal(false);
    limparFiltros(); // Restaura a grade completa ao clicar em "Entendido"
  };

  const handleAplicarFiltros = () => {
    setFiltrosAplicados(filtrosTemporarios);
    
    const resultados = pets.filter((pet) => {
      return (Object.keys(filtrosTemporarios) as Array<keyof Filtros>).every((chave) => {
        const valorFiltro = filtrosTemporarios[chave];
        if (valorFiltro === "") return true;
        return pet[chave] === valorFiltro;
      });
    });

    const temFiltroAtivo = Object.values(filtrosTemporarios).some(val => val !== "");

    if (temFiltroAtivo) {
      if (resultados.length > 0) {
        setIsMatchMode(true);
        setCurrentMatchIndex(0);
      } else {
        setIsMatchMode(false);
        setShowNoMatchModal(true);
      }
    } else {
      setIsMatchMode(false);
    }
  };

  const petsFiltrados = useMemo(() => {
    return pets.filter((pet) => {
      return (Object.keys(filtrosAplicados) as Array<keyof Filtros>).every((chave) => {
        const valorFiltro = filtrosAplicados[chave];
        if (valorFiltro === "") return true;
        return pet[chave] === valorFiltro;
      });
    });
  }, [pets, filtrosAplicados]);

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />
      
      <main className="flex-1 flex flex-col mt-12">
        {isMatchMode && petsFiltrados.length > 0 ? (
          <MatchView 
            pet={petsFiltrados[currentMatchIndex]}
            hasMultipleMatches={petsFiltrados.length > 1}
            onNextMatch={() => setCurrentMatchIndex((prev) => (prev + 1) % petsFiltrados.length)}
            onClearFilters={limparFiltros}
          />
        ) : (
          <div className="adotai-container flex flex-col md:flex-row gap-6 w-full">
            {/* Sidebar de Filtros */}
            <aside className="w-full md:w-[320px] lg:w-[350px] bg-adotai-fundoCard rounded-adotai border border-adotai-textoSecundario p-6 shadow-adotai-btn h-fit shrink-0">
              <h2 className="font-title font-extrabold text-2xl text-adotai-textoPrincipal mb-6 border-b-2 border-adotai-textoSecundario pb-2 border-dashed">
                Filtros
              </h2>
              <div className="space-y-4 font-paragraph text-sm text-adotai-textoPrincipal font-bold">
                {filterGroups.map((group, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <label>{group.label}</label>
                    <select 
                      name={group.name}
                      value={filtrosTemporarios[group.name as keyof Filtros]}
                      onChange={handleSelectChange}
                      className="adotai-select"
                    >
                      <option value="">Sem preferência</option>
                      {group.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <Button 
                variant="primary" 
                className="w-full mt-8 py-3 px-4 text-sm"
                onClick={handleAplicarFiltros}
              >
                Aplicar Filtros
              </Button>
            </aside>

            {/* Grade de Animais */}
            <section className="flex-1 bg-adotai-fundoCard rounded-adotai border border-adotai-textoSecundario p-6 md:p-8 shadow-adotai-btn">
              <h2 className="font-title font-extrabold text-3xl text-adotai-textoPrincipal mb-8 text-center md:text-left">
                Amigos disponíveis
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  // ⬅️ Nova mensagem de carregamento
                  <p className="col-span-full text-center font-paragraph font-bold text-adotai-textoPrincipal mt-8 animate-pulse">
                    Buscando amiguinhos...
                  </p>
                ) : petsFiltrados.length > 0 ? (
                  petsFiltrados.map((pet) => (
                    <div
                      key={pet.id_pet}
                      className="bg-adotai-secundaria rounded-[20px] border border-adotai-textoSecundario p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Bloco da Imagem corrigido */}
                      <div className="w-full h-40 bg-white rounded-[15px] border border-adotai-textoSecundario mb-4 flex items-center justify-center overflow-hidden relative">
                        {pet.foto && pet.foto !== "/caoEgato.png" ? (
                          <Image 
                            src={pet.foto} 
                            alt={`Foto do pet ${pet.nome}`} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          // Espaço em branco/ícone caso não tenha foto
                          <div className="flex flex-col items-center justify-center text-adotai-textoSecundario opacity-50">
                            <span className="text-sm font-bold">Sem foto</span>
                          </div>
                        )}
                        
                        {/* Contador de curtidas (mantido) */}
                        <div className="absolute top-2 right-2 bg-adotai-fundoCard border border-adotai-textoSecundario rounded-full px-2 py-1 flex items-center gap-1.5 shadow-sm z-10">
                          <Image src="/paw-heart-svgrepo-com.svg" alt="Patinha" width={12} height={12} />
                          <span className="font-paragraph font-bold text-xs text-adotai-textoPrincipal leading-none">
                            {pet.curtidas}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="font-title font-bold text-xl text-adotai-textoPrincipal mb-1">
                        {pet.nome}
                      </h3>
                      <p className="font-paragraph text-xs text-adotai-textoSecundario mb-4">
                        {pet.tipo} | {pet.idade}
                      </p>
                      <Link href={`/pet/${pet.id_pet}`} className="w-full">
                        <Button variant="secondary" className="w-full py-2 px-4 text-xs">
                          Conhecer
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center font-paragraph font-bold text-adotai-textoPrincipal mt-8">
                    Nenhum animal encontrado com esses filtros.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <NoMatchModal 
        isOpen={showNoMatchModal} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}