"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CadastrarAnimal() {
  const router = useRouter();
  const { user } = useAuth();

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

  const [fotoBase64, setFotoBase64] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      castrado: animal.castrado === "Sim",
      foto: fotoBase64
    };

    try {
      const response = await fetch("http://localhost:8000/admin/pets", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}` 
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`Animal ${animal.nome} salvo com sucesso!`);
        router.push("/admin");
      } else {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        alert(`Erro ao cadastrar: ${errorData.message || "Tente novamente"}`);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
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
                className={`px-6 py-2 rounded-full font-paragraph font-bold text-sm border border-adotai-textoPrincipal transition-all ${
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

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />

      <main className="flex-1 flex flex-col items-start justify-start w-full mt-8">
        <div className="adotai-container w-full">
          <div className="bg-adotai-fundoCard border-[1.5px] border-adotai-textoPrincipal rounded-adotai p-8 md:p-12 w-full shadow-sm">
          
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-2">
              Cadastrar Animal
            </h1>
          </div>

          <form onSubmit={handlePublish} className="flex flex-col gap-8">
            
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
                placeholder="Conte um pouco sobre a personalidade e história do bichinho..."
                value={animal.descricao}
                onChange={handleTextChange}
                className="w-full bg-[#E1E8D8] border-[1.5px] border-adotai-textoPrincipal rounded-[20px] px-5 py-3 text-xl font-title font-bold text-adotai-textoPrincipal placeholder:text-adotai-textoPrincipal focus:outline-none focus:ring-2 focus:ring-adotai-primaria min-h-[120px] resize-y"
                required
              ></textarea>
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-title font-bold text-adotai-textoPrincipal text-lg">
                Mídias:
              </label>
              <label className="w-full h-40 border-[1.5px] border-dashed border-adotai-textoPrincipal rounded-[20px] bg-[#E1E8D8]/50 flex flex-col items-center justify-center cursor-pointer hover:bg-[#E1E8D8] transition-colors">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, video/mp4" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                {fotoBase64 ? (
                  <span className="font-title font-bold text-xl text-adotai-textoPrincipal text-center px-4">
                    ✓ Mídia selecionada com sucesso!
                  </span>
                ) : (
                  <>
                    <span className="text-4xl mb-1 text-adotai-textoPrincipal">+</span>
                    <span className="font-title font-bold text-xl text-adotai-textoPrincipal text-center px-4">
                      Adicione fotos ou vídeos
                    </span>
                    <span className="font-paragraph font-bold text-sm text-adotai-textoSecundario mt-1">
                      Formatos suportados: JPG, PNG, MP4
                    </span>
                  </>
                )}
              </label>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                variant="secondary" 
                type="submit" 
                className="px-16 py-4 text-2xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal hover:bg-adotai-primaria transition-colors"
              >
                Salvar
              </Button>
            </div>
            
          </form>
          </div>
        </div>
      </main>
    </div>
  );
}