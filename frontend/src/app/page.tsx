export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center gap-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-emerald-400">
          Pomodoro Kamikaze
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Seu frontend Next.js foi configurado com sucesso e está rodando pela Vercel!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="font-semibold text-emerald-300 mb-2">1. Sessões</h3>
            <p className="text-sm text-gray-500">Controle seu tempo de estudo total consolidado.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="font-semibold text-emerald-300 mb-2">2. Flexível</h3>
            <p className="text-sm text-gray-500">Configure seus próprios ciclos de pomodoro e pausas.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="font-semibold text-emerald-300 mb-2">3. Nuvem</h3>
            <p className="text-sm text-gray-500">Seus dados salvos de forma segura no Supabase.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
