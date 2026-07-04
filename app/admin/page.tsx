import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0]">
        <h2 className="text-2xl font-bold mb-2 text-[#111827]">Witaj w centrum dowodzenia!</h2>
        <p className="text-[#64748B] mb-4">
          Tylko osoby z listy <code className="bg-[#F1F5F9] px-1 rounded">ADMIN_EMAILS</code> widzą ten ekran.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button variant="outline" disabled>
            Zarządzaj Lekcjami (Coming soon)
          </Button>
          <Button asChild>
            <Link href="/">Wróć do aplikacji</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}