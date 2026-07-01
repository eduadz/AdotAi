"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "administrador") {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router, user]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-adotai-fundo flex items-center justify-center">
        <p className="text-xl font-title font-bold text-adotai-textoPrincipal animate-pulse">
          Verificando credenciais de administrador...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
