'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página raiz que redireciona automaticamente para o dashboard.
 */
export default function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
      Redirecionando para o dashboard...
    </div>
  );
}
