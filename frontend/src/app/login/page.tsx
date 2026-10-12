'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redireciona direto para a raiz da aplicação.
 * Mantém compatibilidade caso alguém acesse "/login".
 */
export default function LoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
      Redirecionando para o dashboard...
    </div>
  );
}
