import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FC]">
      <header className="bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Fluent-Hero Admin</h1>
          <span className="badge badge-muted text-xs">
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