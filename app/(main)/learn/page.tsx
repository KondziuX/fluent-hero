import { upsertUserProgress } from '@/actions/user-progress';
import { Button } from '@/components/ui/button';
import { getUnits, getUserProgress, getCourses } from '@/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LearnPage() {
  const userProgress = await getUserProgress();
  const units = await getUnits();
  
  // Pobieramy kurs "Angielski" (zakładamy, że ma ID 1 z seeda)
  const courses = await getCourses();
  const englishCourse = courses.find(c => c.slug === 'angielski-pl-en');

  // SCENARIUSZ 1: Użytkownik nie ma wybranego kursu
  if (!userProgress || !userProgress.activeCourseId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-3xl font-bold">Witaj w Fluent-Hero!</h1>
        <p className="text-muted-foreground text-lg text-center max-w-md">
          Wygląda na to, że nie masz jeszcze aktywnego kursu.
        </p>
        
        {englishCourse && (
          <form action={async () => {
            'use server';
            await upsertUserProgress(englishCourse.id);
          }}>
            <Button size="lg" className="w-full">
              Rozpocznij kurs: {englishCourse.title}
            </Button>
          </form>
        )}
      </div>
    );
  }

  // SCENARIUSZ 2: Użytkownik ma kurs - wyświetlamy Unity
  return (
    <div className="flex flex-col gap-8 p-6 max-w-[600px] mx-auto pb-24">
      {/* Header Postępów (Prosty) */}
      <div className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm sticky top-0 z-10">
        <div className="font-bold text-slate-700">Kurs: Angielski</div>
        <div className="flex gap-4 font-bold">
          <span className="text-rose-500">❤️ {userProgress.hearts}</span>
          <span className="text-yellow-500">⚡ {userProgress.xp} XP</span>
        </div>
      </div>

      {/* Lista Rozdziałów (Units) */}
      {units.map((unit) => (
        <div key={unit.id} className="mb-10">
          <div className="bg-green-500 p-5 rounded-xl text-white mb-6 shadow-md">
            <h2 className="text-2xl font-bold">{unit.title}</h2>
            <p className="text-green-100">{unit.description}</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {unit.lessons.map((lesson, index) => {
              // Obliczamy czy lekcja jest zablokowana (prosta logika na start)
              // W MVP odblokowujemy wszystkie, żebyś mógł testować
              const isLocked = false; 

              return (
                <div key={lesson.id} className="relative">
                  {/* Linia łącząca (wizualna) */}
                  {index < unit.lessons.length - 1 && (
                    <div className="absolute left-1/2 bottom-[-20px] w-1 h-8 bg-slate-200 -z-10" />
                  )}
                    <Link href={`/lesson/${lesson.id}`}>
                        <Button
                            variant={lesson.isCompleted ? "default" : "secondary"}
                            className="h-16 w-16 rounded-full border-b-4 active:border-b-0"
                            disabled={isLocked}
                        >
                            {lesson.isCompleted ? "✓" : index + 1}
                        </Button>
                    </Link> 
                  <div className="text-center mt-1 text-xs text-muted-foreground font-bold">
                    {lesson.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}