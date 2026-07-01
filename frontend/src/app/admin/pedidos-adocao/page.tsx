"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Tipagem para os dados do pedido
type Pedido = {
  id: number;
  animal: string;
  tutor: string;
  data: string;
  status: "Pendente" | "Aceito" | "Recusado";
};

export default function PedidosAdocao() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar qual pedido está selecionado no Modal
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);

  useEffect(() => {
    async function carregarPedidos() {
      if (!user?.token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/adoption-requests`, {
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((p: any) => ({
            id: p.id_pedido,
            animal: p.pet?.nome || "Desconhecido",
            tutor: p.usuario?.nome || "Desconhecido",
            data: p.data_pedido ? new Date(p.data_pedido).toLocaleDateString("pt-BR") : "Sem data",
            status: p.status === "pendente" ? "Pendente" : (p.status === "aceito" ? "Aceito" : "Recusado")
          }));
          setPedidos(mapped);
        }
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarPedidos();
  }, [user?.token]);

  // Funções para lidar com as ações do modal
  const handleAceitar = async () => {
    if (!pedidoSelecionado || !user?.token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/adoption-requests/${pedidoSelecionado.id}/accept`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar o status no servidor.");
      }

      // Se a API aceitou, atualiza o estado local para mudar o visual da tela
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoSelecionado.id ? { ...p, status: "Aceito" } : p))
      );

      alert(`Pedido de ${pedidoSelecionado.tutor} para adotar ${pedidoSelecionado.animal} foi ACEITO!`);
    } catch (error) {
      console.error("Erro ao persistir os dados:", error);
      alert("Ocorreu um erro ao salvar o pedido. Tente novamente.");
    } finally {
      setPedidoSelecionado(null); // Fecha o modal
    }
  };

  const handleRecusar = async () => {
    if (!pedidoSelecionado || !user?.token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/adoption-requests/${pedidoSelecionado.id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error("Falha ao recusar o status no servidor.");
      }

      // Se a API aceitou, atualiza o estado local para "Recusado"
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoSelecionado.id ? { ...p, status: "Recusado" } : p))
      );

      alert(`Pedido de ${pedidoSelecionado.tutor} para adotar ${pedidoSelecionado.animal} foi RECUSADO.`);
    } catch (error) {
      console.error("Erro ao recusar o pedido:", error);
      alert("Ocorreu um erro ao recusar o pedido. Tente novamente.");
    } finally {
      setPedidoSelecionado(null); // Fecha o modal
    }
  };

  return (
    <div className="min-h-screen bg-adotai-fundo flex flex-col pb-12 relative">
      <Header />

      <main className="flex-1 flex flex-col items-start justify-start w-full mt-8">
        <div className="adotai-container w-full px-4 md:px-0">
          <div className="bg-adotai-fundoCard border-[1.5px] border-adotai-textoPrincipal rounded-adotai p-6 md:p-12 w-full max-w-4xl shadow-sm mx-auto">

            <div className="mb-10 text-center">
              <h1 className="text-4xl md:text-5xl font-title font-bold text-adotai-textoPrincipal mb-2">
                Pedidos de Cadastro
              </h1>
              <p className="font-paragraph font-bold text-adotai-textoPrincipal text-sm md:text-base">
                Selecione um pedido para avaliá-lo.
              </p>
            </div>

            {/* Lista de Pedidos */}
            <div className="flex flex-col gap-4">
              {loading ? (
                <p className="text-center font-paragraph font-bold text-adotai-textoPrincipal mt-8 animate-pulse">
                  Carregando pedidos de adoção...
                </p>
              ) : pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  onClick={() => pedido.status === "Pendente" && setPedidoSelecionado(pedido)}
                  className={`flex flex-col sm:flex-row justify-between items-center p-5 rounded-[20px] border-[1.5px] border-adotai-textoPrincipal transition-all ${pedido.status === "Pendente"
                      ? "bg-[#E1E8D8] cursor-pointer hover:bg-adotai-primaria/50 hover:translate-y-[-2px] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      : "bg-gray-200 opacity-60 cursor-not-allowed"
                    }`}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <span className="font-title font-bold text-xl text-adotai-textoPrincipal">
                      Animal: {pedido.animal}
                    </span>
                    <span className="font-paragraph font-bold text-sm text-adotai-textoPrincipal">
                      tutor: {pedido.tutor}
                    </span>
                    <span className="font-paragraph font-bold text-sm text-adotai-textoSecundario">
                      Data: {pedido.data}
                    </span>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <span className={`px-4 py-2 rounded-full font-paragraph font-bold text-sm border-[1.5px] border-adotai-textoPrincipal ${pedido.status === "Pendente" ? "bg-yellow-300" :
                        pedido.status === "Aceito" ? "bg-green-400" : "bg-red-400 text-white"
                      }`}>
                      {pedido.status}
                    </span>
                  </div>
                </div>
              ))}

              {!loading && pedidos.length === 0 && (
                <p className="text-center font-paragraph font-bold text-adotai-textoPrincipal mt-8">
                  Nenhum pedido encontrado.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* POPUP / MODAL */}
      {pedidoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-adotai-fundoCard border-[1.5px] border-adotai-textoPrincipal rounded-adotai p-6 md:p-8 max-w-md w-full shadow-[8px_8px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">

            <h2 className="text-3xl font-title font-bold text-adotai-textoPrincipal mb-6 text-center">
              Avaliar Pedido
            </h2>

            <div className="flex flex-col gap-2 mb-8 bg-[#E1E8D8] p-4 rounded-[15px] border-[1.5px] border-adotai-textoPrincipal">
              <p className="font-paragraph font-bold text-adotai-textoPrincipal">
                <span className="text-adotai-textoSecundario">Tutor:</span> {pedidoSelecionado.tutor}
              </p>
              <p className="font-paragraph font-bold text-adotai-textoPrincipal">
                <span className="text-adotai-textoSecundario">Animal:</span> {pedidoSelecionado.animal}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                variant="primary"
                onClick={handleAceitar}
                className="w-full py-4 text-xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal bg-[#8CBFB8] hover:bg-green-400 transition-colors"
              >
                Aceitar pedido
              </Button>

              <Button
                variant="secondary"
                onClick={handleRecusar}
                className="w-full py-4 text-xl !font-title !font-bold border-[1.5px] border-adotai-textoPrincipal hover:bg-red-400 transition-colors"
              >
                Recusar pedido
              </Button>

              <button
                onClick={() => setPedidoSelecionado(null)}
                className="mt-2 font-paragraph font-bold text-sm text-adotai-textoPrincipal underline hover:opacity-70"
              >
                Cancelar e voltar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}