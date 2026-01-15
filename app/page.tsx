import { Button } from '@/components/ui/button';
import { getCourses } from '@/db/queries'; // Importujemy naszą nową funkcję
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function Home() {
  // Pobieramy kursy prosto z bazy
  const coursesData = await getCourses();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold">Fluent-Hero MVP</h1>
      
      <div className="border p-4 rounded-lg bg-slate-100 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Dostępne kursy (z bazy Neon):</h2>
        <ul className="list-disc pl-5 space-y-2">
          {coursesData.map((course) => (
            <li key={course.id} className="text-lg">
              Oficjalny kurs: <strong>{course.title}</strong> ({course.baseLanguage} → {course.targetLanguage})
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <SignedOut>
           <SignInButton mode="modal">
              <Button size="lg">Zaloguj się aby zacząć</Button>
            </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button asChild size="lg">
            <Link href="/learn">Rozpocznij Naukę</Link>
          </Button>
          <UserButton />
        </SignedIn>
      </div>
    </main>
  );
}