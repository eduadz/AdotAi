import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";

export default function Perfil() {
  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />

      <main className="flex-1 flex flex-col items-start justify-start w-full mt-8">
        <div className="adotai-container w-full">
          {/* Card de Informações Pessoais */}
          <div className="bg-adotai-fundoCard border border-adotai-textoPrincipal rounded-adotai p-8 md:p-12 w-full max-w-4xl mx-auto">
          
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-4">
                Informações Pessoais
              </h1>
              <p className="font-paragraph font-bold text-adotai-textoPrincipal text-sm md:text-base">
                Por favor, preencha as informações abaixo para completar seu perfil.
              </p>
            </div>

            <form className="flex flex-col gap-5">
              {/* Nome Completo */}
              <Input
                type="text"
                placeholder="Nome completo"
                className="font-bold placeholder:font-bold"
              />
              
              {/* Linha com CPF e Telefone dividindo o espaço */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-1/3">
                  <Input
                    type="text"
                    placeholder="CPF"
                    className="font-bold placeholder:font-bold"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <Input
                    type="tel"
                    placeholder="Telefone"
                    className="font-bold placeholder:font-bold"
                  />
                </div>
              </div>

              {/* Email */}
              <Input
                type="email"
                placeholder="Email"
                className="font-bold placeholder:font-bold"
              />

              {/* Endereço */}
              <Input
                type="text"
                placeholder="Endereço completo"
                className="font-bold placeholder:font-bold"
              />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}