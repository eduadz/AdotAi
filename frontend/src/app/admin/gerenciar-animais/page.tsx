"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

// 1. Tipagem ajustada (id_pet adicionado para consistência)
export interface Pet {
  id_pet: number;
  nome: string;
  tipo: string;
  idade: string;
  porte: string;
  curtidas?: number;
  foto?: string;
}

interface Filtros {
  tipo: string;
  porte: string;
  idade: string;
}

export default function GerenciarAnimais() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erroConsulta, setErroConsulta] = useState("");

  const filtrosIniciais = { tipo: "", porte: "", idade: "" };
  const [filtrosTemporarios, setFiltrosTemporarios] = useState<Filtros>(filtrosIniciais);
  const [filtrosAplicados, setFiltrosAplicados] = useState<Filtros>(filtrosIniciais);
  const [petParaExcluir, setPetParaExcluir] = useState<Pet | null>(null);

useEffect(() => {
    const buscarAnimaisDoBanco = async () => {
      try {
        const response = await fetch("http://localhost:8000/pets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}` 
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Falha ao buscar dados do servidor.`);
        }

        const dadosRetornados = await response.json();

        const petsMapeados = dadosRetornados.map((pet: any) => ({
          id_pet: pet.id_pet,
          nome: pet.nome,
          tipo: pet.tipo ? (pet.tipo.toLowerCase() === "cachorro" ? "Cachorro" : "Gato") : "",
          porte: pet.porte?.toLowerCase() === "medio" ? "Médio" : (pet.porte ? pet.porte.charAt(0).toUpperCase() + pet.porte.slice(1).toLowerCase() : ""),
          idade: pet.idade ? pet.idade.charAt(0).toUpperCase() + pet.idade.slice(1).toLowerCase() : "",
          curtidas: pet.curtidas || 0,
          foto: (pet.fotos && pet.fotos.length > 0) ? pet.fotos[0].url : "/caoEgato.png"
        }));

        setPets(petsMapeados); 
      } catch (error) {
        console.error("Erro na consulta:", error);
        setErroConsulta("Não foi possível carregar os animais. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false); 
      }
    };

    // Se tivermos o token, fazemos a busca
    if (user?.token) {
      buscarAnimaisDoBanco();
    } else {
      // Se não houver token (ex: usuário deslogado), paramos o loading para não travar a tela
      setIsLoading(false);
    }
  }, [user]);

  const filterGroups = [
    { label: "Tipo de animal:", name: "tipo", options: ["Cachorro", "Gato"] },
    { label: "Porte/Tamanho", name: "porte", options: ["Pequeno", "Médio", "Grande"] },
    { label: "Idade", name: "idade", options: ["Filhote", "Adulto", "Idoso"] },
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltrosTemporarios((prev) => ({ ...prev, [name]: value }));
  };

  const handleAplicarFiltros = () => {
    setFiltrosAplicados(filtrosTemporarios);
  };

  // 3. Filtro simplificado, agora que os dados já chegam formatados perfeitamente
  const petsFiltrados = useMemo(() => {
    return pets.filter((pet) => {
      const matchTipo = filtrosAplicados.tipo === "" || pet.tipo === filtrosAplicados.tipo;
      const matchPorte = filtrosAplicados.porte === "" || pet.porte === filtrosAplicados.porte;
      const matchIdade = filtrosAplicados.idade === "" || pet.idade === filtrosAplicados.idade;

      return matchTipo && matchPorte && matchIdade;
    });
  }, [pets, filtrosAplicados]);

  const handleExcluir = async () => {
    if (!petParaExcluir) return;

    try {
      const response = await fetch(`http://localhost:8000/admin/pets/${petParaExcluir.id_pet}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error("Erro ao excluir animal");
      
      setPets((prev) => prev.filter((p) => p.id_pet !== petParaExcluir.id_pet));
      
      alert("Animal removido com sucesso!");
      setPetParaExcluir(null);
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor ao excluir.");
    }
  };

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />
      
      <main className="flex-1 flex flex-col mt-12">
        <div className="adotai-container flex flex-col md:flex-row gap-6 w-full">
          
          <aside className="w-full md:w-[320px] lg:w-[350px] bg-adotai-fundoCard rounded-adotai border-[1.5px] border-adotai-textoPrincipal p-6 shadow-adotai-btn h-fit shrink-0">
            <h2 className="font-title font-extrabold text-2xl text-adotai-textoPrincipal mb-6 border-b-[1.5px] border-adotai-textoPrincipal pb-2 border-dashed">
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
                    className="bg-adotai-secundaria border-[1.5px] border-adotai-textoPrincipal rounded-[15px] p-2.5 cursor-pointer outline-none font-bold text-adotai-textoPrincipal text-xs focus:ring-2 focus:ring-adotai-primaria transition-shadow"
                    disabled={isLoading} 
                  >
                    <option value="">Qualquer</option>
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
              className="w-full mt-8 py-3 px-4 text-sm font-bold"
              onClick={handleAplicarFiltros}
              disabled={isLoading}
            >
              Aplicar Filtros
            </Button>
          </aside>

          <section className="flex-1 bg-adotai-fundoCard rounded-adotai border-[1.5px] border-adotai-textoPrincipal p-6 md:p-8 shadow-adotai-btn">
            <h2 className="font-title font-extrabold text-3xl text-adotai-textoPrincipal mb-8 text-center md:text-left">
              Gerenciar Animais
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p className="font-title font-bold text-xl text-adotai-textoPrincipal animate-pulse">
                  Carregando animais do banco...
                </p>
              </div>
            ) : erroConsulta ? (
              <div className="flex justify-center items-center h-40 bg-red-100 border border-red-400 rounded-xl p-4">
                <p className="font-paragraph font-bold text-red-600 text-center">
                  {erroConsulta}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {petsFiltrados.map((pet) => (
                  <div
                    key={pet.id_pet}
                    className="bg-adotai-secundaria rounded-[20px] border-[1.5px] border-adotai-textoPrincipal p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-full h-40 bg-white rounded-[15px] border-[1.5px] border-adotai-textoPrincipal mb-4 flex items-center justify-center overflow-hidden relative">
                      
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

                      <div className="absolute top-2 right-2 bg-adotai-fundoCard border-[1.5px] border-adotai-textoPrincipal rounded-full px-2 py-1 flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] z-10">
                        <Image src="/paw-heart-svgrepo-com.svg" alt="Ícone de patinha" width={12} height={12} />
                        <span className="font-paragraph font-bold text-xs text-adotai-textoPrincipal leading-none">
                          {pet.curtidas || 0}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-title font-bold text-xl text-adotai-textoPrincipal mb-1">
                      {pet.nome}
                    </h3>
                    <p className="font-paragraph font-bold text-xs text-adotai-textoSecundario mb-4">
                      {pet.tipo} | {pet.idade}
                    </p>

                    <div className="flex flex-col xl:flex-row flex-wrap gap-3 w-full mt-auto pt-2">
                      <Link href={`/admin/cadastrar-animal/${pet.id_pet}`} className="flex-1 flex">
                        <Button variant="primary" className="w-full py-2 px-4 text-xs text-center">
                          Editar
                        </Button>
                      </Link>

                      <Button
                        variant="destructive"
                        className="flex-1 py-2 px-4 text-xs text-center"
                        onClick={() => setPetParaExcluir(pet)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
                
                {petsFiltrados.length === 0 && !isLoading && (
                  <p className="col-span-full text-center font-paragraph font-bold text-adotai-textoPrincipal mt-8">
                    Nenhum animal cadastrado atende a esses filtros.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Modal isOpen={!!petParaExcluir} onClose={() => setPetParaExcluir(null)} title="Confirmar Exclusão">
        <p className="mb-4 text-center font-bold text-base">
          Tem certeza que deseja excluir o animal <span className="text-red-600">{petParaExcluir?.nome}</span> do banco de dados? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="secondary" onClick={() => setPetParaExcluir(null)} className="py-2 px-6">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleExcluir} className="py-2 px-6 bg-red-500 text-white hover:bg-red-600">
            Sim, Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
}