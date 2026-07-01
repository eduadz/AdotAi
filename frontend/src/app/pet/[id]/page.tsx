"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Modal from "@/components/ui/Modal"; // ⬅️ 1. Importando o Modal

interface PetDetails {
  id_pet: number;
  nome: string;
  descricao: string;
  tipo: string;
  raca: string;
  genero: string;
  porte: string;
  cor_pelagem: string;
  tipo_pelagem: string;
  idade: string;
  energia: string;
  comorbidade: string;
  castrado: boolean;
  status: string;
  fotos: Array<{ id_foto: number, url: string }>;
}

export default function DetalhesPet() {
  const { id } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<PetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // ⬅️ 2. Estado para controlar o Modal
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    async function buscarDetalhes() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/pets/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPet(data);
        } else {
          alert("Aviso: Animal não encontrado.");
          router.push("/feed");
        }

        const responseLikes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/pets/${id}/likes`);
        if (responseLikes.ok) {
          const likesData = await responseLikes.json();
          setLikesCount(likesData.count);
        }

        const token = localStorage.getItem("token");
        if (token) {
          const responseMyLikes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/me/likes`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (responseMyLikes.ok) {
            const myLikes = await responseMyLikes.json();
            const alreadyLiked = myLikes.some((p: any) => p.id_pet === Number(id));
            setIsLiked(alreadyLiked);
          }
        }

      } catch (error) {
        console.error("Erro ao buscar detalhes do pet:", error);
        alert("Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    }

    if (id) buscarDetalhes();
  }, [id, router]);

  const handleToggleLike = async () => {
    const token = localStorage.getItem("token"); 
    
    if (!token) {
      alert("Você precisa estar logado para curtir um pet!");
      return;
    }

    const previousIsLiked = isLiked;
    setIsLiked(!isLiked);
    setLikesCount((prev) => isLiked ? prev - 1 : prev + 1);

    try {
      const method = previousIsLiked ? "DELETE" : "POST";
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/pets/${id}/like`, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Falha na requisição");
      }
    } catch (error) {
      console.error("Erro ao registrar curtida:", error);
      setIsLiked(previousIsLiked);
      setLikesCount((prev) => previousIsLiked ? prev + 1 : prev - 1);
      alert("Não foi possível curtir o pet no momento.");
    }
  };

  const formatarValor = (campo: string, valor: any) => {
    if (valor === undefined || valor === null || valor === "") return "Não informado";
    if (typeof valor === "boolean") return valor ? "Sim" : "Não";

    const mapa: Record<string, string> = {
      cachorro: "Cachorro",
      gato: "Gato",
      macho: "Macho",
      femea: "Fêmea",
      pequeno: "Pequeno",
      medio: "Médio",
      grande: "Grande",
      filhote: "Filhote",
      adulto: "Adulto",
      idoso: "Idoso",
      baixa: "Baixo (Calmo)",
      media: "Moderado",
      alta: "Muito ativo",
    };

    return mapa[valor.toString().toLowerCase()] || valor;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-adotai-fundo flex items-center justify-center">
        <p className="text-xl font-title font-bold text-adotai-textoPrincipal animate-pulse">
          Carregando perfil do amiguinho...
        </p>
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />

      <main className="flex-1 adotai-container w-full mt-12">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 font-title font-bold text-adotai-textoPrincipal hover:underline text-lg focus:outline-none"
        >
          ← Voltar para o feed
        </button>

        <div className="bg-adotai-fundoCard border-[1.5px] border-adotai-textoPrincipal rounded-adotai p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 lg:gap-12">
          
          <div className="w-full md:w-2/5 flex flex-col gap-4">
            <div className="w-full aspect-square bg-white rounded-[25px] border-[1.5px] border-adotai-textoPrincipal relative overflow-hidden shadow-sm">
              <Image
                src={pet.fotos && pet.fotos.length > 0 ? pet.fotos[0].url : "/caoEgato.png"} alt={`Foto do pet ${pet.nome}`}
                fill
                className="object-cover opacity-90"
                priority
              />

              <button 
                onClick={handleToggleLike}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border-[1.5px] border-adotai-textoPrincipal rounded-full px-4 py-2 flex items-center gap-2 shadow-md hover:bg-white transition-all focus:outline-none"
              >
                <span className="text-xl">
                  {isLiked ? "❤️" : "🤍"}
                </span>
                <span className="font-title font-bold text-adotai-textoPrincipal text-lg">
                  {likesCount}
                </span>
              </button>
            </div>
            
            <div className="bg-adotai-secundaria rounded-[20px] border border-adotai-textoSecundario p-4 text-center">
              <span className="font-paragraph font-bold text-adotai-textoPrincipal text-sm block">
                Status de Adoção:
              </span>
              <span className="font-paragraph text-sm text-adotai-textoPrincipal mt-1 block">
                {pet.status === "disponivel" ? "Disponível para Adoção" : formatarValor("status", pet.status)}
              </span>
            </div>
          </div>

          <div className="w-full md:w-3/5 flex flex-col justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-title font-extrabold text-adotai-textoPrincipal mb-2">
                {pet.nome}
              </h1>
              <p className="font-paragraph text-sm text-adotai-textoSecundario uppercase tracking-wider font-bold mb-6">
                {formatarValor("tipo", pet.tipo)} • {formatarValor("idade", pet.idade)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#E1E8D8]/60 p-5 rounded-[20px] border border-adotai-textoSecundario/40 mb-6">
                <div>
                  <span className="text-xs text-adotai-textoSecundario block font-paragraph font-bold">RAÇA:</span>
                  <span className="text-base text-adotai-textoPrincipal font-title font-bold">{pet.raca || "Sem raça definida"}</span>
                </div>
                <div>
                  <span className="text-xs text-adotai-textoSecundario block font-paragraph font-bold">SEXO:</span>
                  <span className="text-base text-adotai-textoPrincipal font-title font-bold">{formatarValor("genero", pet.genero)}</span>
                </div>
                <div>
                  <span className="text-xs text-adotai-textoSecundario block font-paragraph font-bold">PORTE / TAMANHO:</span>
                  <span className="text-base text-adotai-textoPrincipal font-title font-bold">{formatarValor("porte", pet.porte)}</span>
                </div>
                <div>
                  <span className="text-xs text-adotai-textoSecundario block font-paragraph font-bold">NÍVEL DE ENERGIA:</span>
                  <span className="text-base text-adotai-textoPrincipal font-title font-bold">{formatarValor("energia", pet.energia)}</span>
                </div>
                <div>
                  <span className="text-xs text-adotai-textoSecundario block font-paragraph font-bold">CASTRADO:</span>
                  <span className="text-base text-adotai-textoPrincipal font-title font-bold">{formatarValor("castrado", pet.castrado)}</span>
                </div>
                <div>
                  <span className="text-xs text-adotai-textoSecundario block font-paragraph font-bold">PELAGEM:</span>
                  <span className="text-base text-adotai-textoPrincipal font-title font-bold">{pet.cor_pelagem} ({pet.tipo_pelagem})</span>
                </div>
                <div className="sm:col-span-2 border-t border-adotai-textoSecundario/20 pt-2 mt-1">
                  <span className="text-xs text-adotai-textoSecundario block font-paragraph font-bold">COMORBIDADES / CUIDADOS ESPECIAIS:</span>
                  <span className="text-base text-adotai-textoPrincipal font-title font-bold">{pet.comorbidade || "Nenhuma comorbidade relatada"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-title font-bold text-xl text-adotai-textoPrincipal">
                  Conheça a história de {pet.nome}
                </h3>
                <p className="font-paragraph text-adotai-textoPrincipal text-base leading-relaxed bg-[#E1E8D8]/30 p-4 rounded-[15px] border border-dashed border-adotai-textoSecundario/30 whitespace-pre-line">
                  {pet.descricao || "Este lindo amiguinho ainda não possui uma descrição detalhada, mas está ansioso por um novo lar!"}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="secondary"
                className="w-full sm:w-auto px-12 py-4 text-xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal hover:bg-adotai-primaria transition-colors"
                onClick={() => setIsModalOpen(true)} // ⬅️ 3. Abre o modal ao clicar
              >
                Quero Adotar! 🐾
              </Button>
            </div>

          </div>
        </div>
      </main>

      {/* ⬅️ 4. Renderizando o Modal no final da tela */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Formulário de Adoção"
      >
        <div className="flex flex-col gap-4">
          <p className="font-paragraph font-bold text-adotai-textoPrincipal text-base">
            Obrigado pelo seu interesse em dar um lar para <span className="text-adotai-primaria">{pet.nome}</span>! ❤️
          </p>
          <p className="font-paragraph text-adotai-textoPrincipal text-sm">
            Em breve o formulário de solicitação de adoção estará disponível aqui. Fique ligado!
          </p>
          
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={() => setIsModalOpen(false)} className="px-6 py-2">
              Entendi
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}