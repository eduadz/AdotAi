"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import MatchView from "@/components/feed/MatchView";
import NoMatchModal from "@/components/feed/NoMatchModal";
import Modal from "@/components/ui/Modal"; // ⬅️ 1. Importando o Modal

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
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // ⬅️ 2. Estado para controlar o Modal de adoção no MatchMode
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // Estado para os filtros no mobile

  useEffect(() => {
    async function carregarPets() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/pets?status=disponivel`);
        if (response.ok) {
          const data = await response.json();
          
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
            curtidas: pet.curtidas !== undefined ? pet.curtidas : 0,
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
    limparFiltros();
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

    setIsMatchMode(false);

    if (temFiltroAtivo && resultados.length === 0) {
      setShowNoMatchModal(true);
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

  // Captura o pet atual do match (se houver) para exibir o nome no modal
  const currentMatchPet = petsFiltrados[currentMatchIndex];

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />
      
      <main className="flex-1 flex flex-col mt-12">
        {isMatchMode && petsFiltrados.length > 0 ? (
          <MatchView 
            pet={currentMatchPet}
            hasMultipleMatches={petsFiltrados.length > 1}
            onNextMatch={() => setCurrentMatchIndex((prev) => (prev + 1) % petsFiltrados.length)}
            onClearFilters={limparFiltros}
            onAdopt={() => setIsAdoptModalOpen(true)} // ⬅️ 3. Passando a função de abrir o modal
          />
        ) : (
          <div className="adotai-container flex flex-col md:flex-row gap-6 w-full relative">
            {/* Botão de Filtros no Mobile */}
            <div className="w-full md:hidden mb-4">
              <Button 
                variant="secondary" 
                className="w-full py-3"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                {isFiltersOpen ? "Esconder Filtros" : "Mostrar Filtros"}
              </Button>
            </div>

            <aside className={`w-full md:w-[320px] lg:w-[350px] bg-adotai-fundoCard rounded-adotai border border-adotai-textoSecundario p-6 shadow-adotai-btn h-fit shrink-0 ${isFiltersOpen ? "block" : "hidden"} md:block mb-6 md:mb-0`}>
              <h2 className="font-title font-extrabold text-2xl text-adotai-textoPrincipal mb-6 border-b-2 border-adotai-textoSecundario pb-2 border-dashed flex justify-between items-center">
                Filtros
                <button className="md:hidden text-sm underline" onClick={() => setIsFiltersOpen(false)}>Fechar</button>
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
                onClick={() => {
                  handleAplicarFiltros();
                  setIsFiltersOpen(false); // Fechar filtros no mobile após aplicar
                }}
              >
                Aplicar Filtros
              </Button>
            </aside>

            <section className="flex-1 bg-adotai-fundoCard rounded-adotai border border-adotai-textoSecundario p-4 md:p-8 shadow-adotai-btn">
              <h2 className="font-title font-extrabold text-2xl md:text-3xl text-adotai-textoPrincipal mb-6 md:mb-8 text-center md:text-left">
                Amigos disponíveis
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {loading ? (
                  <p className="col-span-full text-center font-paragraph font-bold text-adotai-textoPrincipal mt-8 animate-pulse">
                    Buscando amiguinhos...
                  </p>
                ) : petsFiltrados.length > 0 ? (
                  petsFiltrados.map((pet) => (
                    <div
                      key={pet.id_pet}
                      className="bg-adotai-secundaria rounded-[20px] border border-adotai-textoSecundario p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-full h-40 bg-white rounded-[15px] border border-adotai-textoSecundario mb-4 flex items-center justify-center overflow-hidden relative">
                        {pet.foto && pet.foto !== "/caoEgato.png" ? (
                          <Image 
                            src={pet.foto} 
                            alt={`Foto do pet ${pet.nome}`} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-adotai-textoSecundario opacity-50">
                            <span className="text-sm font-bold">Sem foto</span>
                          </div>
                        )}
                        
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

      {/* ⬅️ 4. Renderizando o Modal para quando clicar em adotar no MatchView */}
      {currentMatchPet && (
        <Modal 
          isOpen={isAdoptModalOpen} 
          onClose={() => setIsAdoptModalOpen(false)} 
          title="Formulário de Adoção"
        >
          <div className="flex flex-col gap-4">
            <p className="font-paragraph font-bold text-adotai-textoPrincipal text-base">
              Obrigado pelo seu interesse em dar um lar para <span className="text-adotai-primaria">{currentMatchPet.nome}</span>! ❤️
            </p>
            <p className="font-paragraph text-adotai-textoPrincipal text-sm">
              Em breve o formulário de solicitação de adoção estará disponível aqui. Fique ligado!
            </p>
            
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={() => setIsAdoptModalOpen(false)} className="px-6 py-2">
                Entendi
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}