'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return <div className="text-gray-400">Carregando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Meus Estudos</h1>
        <p className="text-gray-400">Acompanhe seu progresso e inicie novas sessões.</p>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 font-medium mb-1">Hoje</h3>
          <p className="text-3xl font-bold text-emerald-400">0h 00m</p>
          <p className="text-sm text-gray-500 mt-2">0 sessões realizadas</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 font-medium mb-1">Esta Semana</h3>
          <p className="text-3xl font-bold text-emerald-400">0h 00m</p>
          <p className="text-sm text-gray-500 mt-2">0 sessões realizadas</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 font-medium mb-1">Este Mês</h3>
          <p className="text-3xl font-bold text-emerald-400">0h 00m</p>
          <p className="text-sm text-gray-500 mt-2">0 sessões realizadas</p>
        </div>
      </div>

      {/* Próxima Sessão (Placeholder) */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Próxima Sessão Agendada</h2>
        <div className="bg-gray-950 rounded-xl p-4 border border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-emerald-400">Nenhuma sessão agendada</h3>
            <p className="text-sm text-gray-500">Agende seus estudos na aba Sessões.</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
            Agendar Estudo
          </button>
        </div>
      </div>
    </div>
  );
}
