import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-2">Witaj w centrum dowodzenia!</h2>
        <p className="text-muted-foreground mb-4">
          Tylko osoby z listy <code>ADMIN_EMAILS</code> widzą ten ekran.
        </p>
        <div className="flex gap-4">
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