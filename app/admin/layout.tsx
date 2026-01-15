import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // To wywołanie sprawdza uprawnienia przed wyrenderowaniem czegokolwiek
  await requireAdmin();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Fluent-Hero Admin</h1>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
            Tryb Administratora
          </span>
        </div>
      </header>
      <main className="container mx-auto p-8">
        {children}
      </main>
    </div>
  );
}