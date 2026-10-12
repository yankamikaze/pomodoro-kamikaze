'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

/**
 * Página principal da aplicação (Dashboard).
 * Como ainda não temos fluxo de autenticação, apenas exibimos um
 * placeholder informando que o sistema está pronto para uso.
 */
export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Tentamos obter a sessão atual apenas para mostrar o e‑mail caso exista.
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Bem‑vindo ao Pomodoro Kamikaze</h1>
      {userEmail && <p className="mb-6">Usuário conectado: {userEmail}</p>}
      <p className="text-gray-400">Aqui será o seu painel de controle, resumos e agenda de sessões.</p>
    </div>
  );
}
