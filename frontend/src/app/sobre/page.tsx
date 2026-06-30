import Header from "@/components/layout/Header";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12">
      <Header />

      {/* 1. Aplicamos o adotai-container direto no main para alinhar perfeitamente com o Header */}
      <main className="adotai-container flex-1 flex flex-col mt-8">
        
        {/* 2. Removido o 'max-w-4xl mx-auto' para que as bordas deste card encontrem exatamente as bordas do Header */}
        <div className="bg-adotai-fundoCard border border-adotai-textoSecundario rounded-adotai p-8 md:p-12 w-full">
        
          {/* Seção: Sobre nós */}
          <section className="mb-10">
            <h2 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-4">
              Sobre nós
            </h2>
            <div className="border border-adotai-textoSecundario rounded-adotai-sm p-6 bg-adotai-fundoCard">
              <p className="font-paragraph font-bold text-adotai-textoPrincipal text-sm md:text-base leading-relaxed">
                Somos uma página elaborada por estudantes da disciplina Web da Universidade Federal de Viçosa.
              </p>
            </div>
          </section>

          {/* Seção: Quem pode adotar? */}
          <section className="mb-10">
            <h2 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-4">
              Quem pode adotar?
            </h2>
            <div className="border border-adotai-textoSecundario rounded-adotai-sm p-6 bg-adotai-fundoCard">
              <p className="font-paragraph font-bold text-adotai-textoPrincipal text-sm md:text-base leading-relaxed">
                Para adotar um amiguinho você deve ser maior de 18 anos e ter muita responsabilidade e amor para dar e receber! :)
                <br /><br />
                Além disso, é importante que você more na região de Florestal
              </p>
            </div>
          </section>

          {/* Seção: Como doar para uma ONG parceira? */}
          <section>
            <h2 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-4">
              Como doar para uma ONG parceira?
            </h2>
            <div className="border border-adotai-textoSecundario rounded-adotai-sm p-6 bg-adotai-fundoCard">
              <ul className="font-paragraph font-bold text-adotai-textoPrincipal text-sm md:text-base leading-relaxed space-y-4">
                <li>
                  ONG Rabinho Feliz<br />
                  Chave Pix: XXXXXXXXXX
                </li>
                <li>
                  ONG Amiguinhos de patinhas<br />
                  Chave Pix: XXXXXXXXXX
                </li>
                <li>
                  ONG Miau-au<br />
                  Chave Pix: XXXXXXXXXX
                </li>
              </ul>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}