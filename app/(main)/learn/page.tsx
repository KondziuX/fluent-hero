import { upsertUserProgress } from '@/actions/user-progress';
import { FeedWrapper } from '@/components/feed-wrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import { UnitBanner } from '@/components/unit-banner';
import { Button } from '@/components/ui/button';
import { getUnits, getUserProgress, getCourses } from '@/db/queries';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function LearnPage() {
  const userProgress = await getUserProgress();
  const units = await getUnits();
  const courses = await getCourses();
  
  const englishCourse = courses.find(c => c.slug === 'angielski-pl-en');

  // SCENARIUSZ 1: Brak kursu
  if (!userProgress || !userProgress.activeCourse) {
    if (!englishCourse) {
       return <div className="p-4">Błąd: Brak kursów w bazie. Uruchom "npm run db:seed"</div>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-3xl font-bold">Witaj w Fluent-Hero!</h1>
        <p className="text-muted-foreground text-lg text-center max-w-md">
          Wygląda na to, że nie masz jeszcze aktywnego kursu.
        </p>
        
        <form action={async () => {
          'use server';
          await upsertUserProgress(englishCourse.id);
        }}>
          <Button size="lg" className="w-full">
            Rozpocznij kurs: {englishCourse.title}
          </Button>
        </form>
      </div>
    );
  }

  // SCENARIUSZ 2: Główny widok
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.xp}
          hasActiveSubscription={false}
          lastHeartRefill={userProgress.lastHeartRefill} // Przekazujemy czas odnowienia
        />
      </StickyWrapper>

      <FeedWrapper>
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <UnitBanner 
              title={unit.title} 
              description={unit.description} 
            />

            <div className="flex flex-col items-center gap-4">
              {unit.lessons.map((lesson, index) => {
                const isCompleted = lesson.isCompleted;
                
                // LOGIKA BLOKOWANIA: Blokuj tylko jeśli brak serc I lekcja nieukończona
                const isLockedByHearts = !isCompleted && userProgress.hearts === 0;

                return (
                  <div key={lesson.id} className="relative">
                    {/* Linia łącząca */}
                    {index < unit.lessons.length - 1 && (
                      <div className="absolute left-1/2 bottom-[-20px] w-1 h-8 bg-slate-200 -z-10" />
                    )}
                    
                    {/* WARUNEK: Zablokowane vs Odblokowane */}
                    {isLockedByHearts ? (
                      <div>
                        <Button
                          variant="locked" 
                          className="h-16 w-16 rounded-full border-b-4 bg-slate-200 border-slate-400 text-slate-500 cursor-not-allowed"
                          disabled
                        >
                           💔 
                        </Button>
                        <div className="text-center mt-1 text-xs text-rose-500 font-bold">
                           Brak serc
                        </div>
                      </div>
                    ) : (
                      <Link href={`/lesson/${lesson.id}`}>
                        <Button
                          variant={lesson.isCompleted ? "default" : "secondary"}
                          className="h-16 w-16 rounded-full border-b-4 active:border-b-0 text-xl"
                        >
                          {lesson.isCompleted ? "✓" : index + 1}
                        </Button>
                      </Link>
                    )}

                    {/* Tytuł lekcji (tylko dla niezablokowanych, żeby nie dublować tekstu "Brak serc") */}
                    {!isLockedByHearts && (
                        <div className="text-center mt-1 text-xs text-muted-foreground font-bold">
                            {lesson.title}
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
}