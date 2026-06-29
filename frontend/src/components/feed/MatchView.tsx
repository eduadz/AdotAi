"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Pet } from "@/app/feed/page"; // Importamos a tipagem do arquivo principal

interface MatchViewProps {
  pet: Pet;
  hasMultipleMatches: boolean;
  onNextMatch: () => void;
  onClearFilters: () => void;
}

export default function MatchView({ pet, hasMultipleMatches, onNextMatch, onClearFilters }: MatchViewProps) {
  return (
    <div className="adotai-container flex flex-col items-center w-full max-w-4xl mx-auto">
      <h1 className="font-title font-extrabold text-4xl md:text-5xl text-adotai-textoPrincipal mb-4 self-start pl-4 md:pl-0">
        Seu match ideal é...
      </h1>
      
      <div className="bg-adotai-fundoCard w-full rounded-adotai border border-adotai-textoSecundario p-6 md:p-10 relative flex flex-col md:flex-row items-stretch justify-between min-h-[400px] mb-8 shadow-sm">
        {/* Lado Esquerdo: Imagem do Pet */}
        <div className="flex-1 relative min-h-[300px] md:min-h-full">
          <Image 
            src={pet.foto} 
            alt={`Foto de ${pet.nome}`} 
            fill 
            className="object-contain object-bottom drop-shadow-md" 
            priority 
          />
        </div>
        
        {/* Lado Direito: Informações */}
        <div className="flex-1 flex items-center justify-center md:pl-8 mt-6 md:mt-0">
          <div className="w-full h-full min-h-[250px] bg-transparent border-2 border-adotai-textoPrincipal rounded-adotai p-6 flex flex-col gap-4 shadow-sm">
            <h2 className="font-paragraph font-bold text-sm md:text-base text-adotai-textoPrincipal">
              Informações sobre o animalzinho:
            </h2>
            <p className="font-paragraph text-sm text-adotai-textoSecundario leading-relaxed">
              <strong>Nome:</strong> {pet.nome} <br />
              <strong>Tipo:</strong> {pet.tipo} <br />
              <strong>Raça:</strong> {pet.raca} <br />
              <strong>Idade:</strong> {pet.idade} <br />
              <br />
              {pet.descricao}
            </p>
          </div>
        </div>
      </div>

      {/* Botões do Match */}
      <div className="flex flex-row justify-center gap-6 md:gap-12 w-full px-4">
        <Link href={`/pet/${pet.id}`}>
          <Button variant="secondary" className="py-3 px-8 md:px-12 text-sm md:text-lg !rounded-full">
            Adotar
          </Button>
        </Link>
        
        {hasMultipleMatches && (
          <Button variant="secondary" className="py-3 px-8 md:px-12 text-sm md:text-lg !rounded-full" onClick={onNextMatch}>
            Ver o próximo
          </Button>
        )}
      </div>

      <button 
        onClick={onClearFilters} 
        className="mt-8 font-paragraph font-bold text-sm text-adotai-textoPrincipal underline hover:opacity-70 transition-opacity"
      >
        Remover filtros e voltar ao feed
      </button>
    </div>
  );
}