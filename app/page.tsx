import { Button } from '@/components/ui/button';
import { getCourses } from '@/db/queries';
import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  // 1. Sprawdzamy, czy użytkownik jest zalogowany
  const { userId } = await auth();

  // 2. Jeśli tak -> natychmiastowy "kop" do aplikacji właściwej
  if (userId) {
    redirect('/learn');
  }

  // 3. Jeśli nie -> pobieramy dane dla strony startowej (Landing Page)
  const coursesData = await getCourses();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold">Fluent-Hero MVP</h1>
      
      <div className="border p-4 rounded-lg bg-slate-100 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Dostępne kursy:</h2>
        <ul className="list-disc pl-5 space-y-2">
          {coursesData.map((course) => (
            <li key={course.id} className="text-lg">
              <strong>{course.title}</strong> ({course.baseLanguage} → {course.targetLanguage})
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        {/* Skoro jesteśmy tutaj, to na pewno userId == null, więc nie potrzebujemy <SignedOut> */}
        <SignInButton mode="modal" forceRedirectUrl="/learn">
          <Button size="lg" className="w-full">
            Zaloguj się aby zacząć
          </Button>
        </SignInButton>
      </div>
    </main>
  );
}