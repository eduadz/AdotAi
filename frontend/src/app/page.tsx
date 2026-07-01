import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Guard from "@/components/autenticacao/Guard";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      {/* Cabeçalho Flutuante */}
      <Header />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col mt-12">
        <div className="adotai-container w-full">
        {/* Card Principal (Verde #C6D6B8, Raio 30px, Permite visualização do overflow) */}
        <div className="bg-adotai-fundoCard w-full rounded-adotai border border-adotai-textoSecundario p-6 md:p-16 relative flex flex-col md:flex-row items-center justify-between min-h-[380px] overflow-visible mb-6">
          
          {/* Lado Esquerdo: Títulos e Textos */}
          <div className="flex-1 space-y-6 max-w-xl z-10 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-title font-extrabold text-adotai-textoPrincipal leading-tight whitespace-pre-line">
              Faça match {"\n"} com seu pet
            </h1>
            <p className="text-sm md:text-base font-paragraph font-bold text-adotai-textoSecundario leading-relaxed">
              Um hub para adoção de animais em Florestal
            </p>
          </div>

          <div className="absolute -top-[4px] -right-[4px] bottom-0 w-64 md:w-[400px] hidden md:block z-20 pointer-events-none">
            <div className="w-full h-full relative">
              <Image 
                src="/caoEgato.png" 
                alt="Cão e Gato" 
                fill 
                /* object-right-bottom cola a base dos animais no fundo do container, impedindo o vazamento */
                className="object-contain object-right-bottom drop-shadow-md"
                priority
              />
            </div>
          </div>
          
        </div>

        {/* Container dos Botões abaixo do Card (Alinhados à esquerda) */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-start mt-2">
          <Guard allowedRoles={["ADMIN"]}>
            <Link href="/admin" className="w-full sm:w-auto">
              <Button variant="secondary" className="py-4 px-10 text-sm w-full">
                Painel Administrativo
              </Button>
            </Link>
          </Guard>
        </div>
        </div>
      </main>
    </div>
  );
}