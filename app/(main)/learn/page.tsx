import { upsertUserProgress } from '@/actions/user-progress';
import { FeedWrapper } from '@/components/feed-wrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import { UnitBanner } from '@/components/unit-banner';
import { Button } from '@/components/ui/button';
import { getUnits, getUserProgress, getCourses } from '@/db/queries';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function LearnPage() {
  const userProgress = await getUserProgress();
  const units = await getUnits();
  const courses = await getCourses();
  
  const englishCourse = courses.find(c => c.slug === 'angielski-pl-en');

  // --- NOWA, UPROSZCZONA GEOMETRIA ---
  // Schemat: Środek (0), Lewo (-1), Środek (0), Prawo (1)
  const COLUMNS = [0, -1, 0, 1]; 
  const HORIZONTAL_OFFSET = 70; // Jak szeroko rozrzucamy (w px)
  const LESSON_HEIGHT = 64; // Wysokość przycisku
  const GAP_HEIGHT = 120; // Odstęp pionowy między przyciskami (sama przerwa)

  if (!userProgress || !userProgress.activeCourse) {
    if (!englishCourse) {
       return <div className="p-4">Błąd: Brak kursów w bazie. Uruchom "npm run db:seed"</div>;
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-3xl font-bold">Witaj w Fluent-Hero!</h1>
        <form action={async () => {
          'use server';
          await upsertUserProgress(englishCourse.id);
        }}>
          <Button size="lg" className="w-full">Rozpocznij kurs</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.xp}
          hasActiveSubscription={false}
          lastHeartRefill={userProgress.lastHeartRefill}
        />
      </StickyWrapper>

      <FeedWrapper>
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <UnitBanner title={unit.title} description={unit.description} />

            <div className="flex flex-col items-center relative pb-20">
              {unit.lessons.map((lesson, index) => {
                const isCompleted = lesson.isCompleted;
                const isLockedByHearts = !isCompleted && userProgress.hearts === 0;
                
                // Obliczamy pozycję X dla obecnego i następnego elementu
                const columnIndex = index % COLUMNS.length;
                const nextColumnIndex = (index + 1) % COLUMNS.length;
                
                const currentOffset = COLUMNS[columnIndex] * HORIZONTAL_OFFSET;
                const nextOffset = COLUMNS[nextColumnIndex] * HORIZONTAL_OFFSET;
                
                // Różnica w poziomie, którą musi pokonać linia
                const deltaX = nextOffset - currentOffset;

                const isLast = index === unit.lessons.length - 1;

                return (
                  <div 
                    key={lesson.id} 
                    className="relative flex flex-col items-center"
                    style={{
                      transform: `translateX(${currentOffset}px)`,
                      // Margines to pusta przestrzeń na linię
                      marginBottom: isLast ? 0 : `${GAP_HEIGHT}px`
                    }}
                  >
                    {/* --- PRZYCISK --- */}
                    <div className="relative z-10">
                        {isLockedByHearts ? (
                        <Button
                            variant="locked" 
                            className="h-16 w-16 rounded-full border-b-4 bg-slate-200 border-slate-400 text-slate-500 cursor-not-allowed"
                            disabled
                        >
                            💔 
                        </Button>
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
                        
                        {/* PODPIS (Dymek) - Zawsze na wierzchu (z-20) */}
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-max text-center z-20">
                            {!isLockedByHearts ? (
                                <div className="text-sm font-bold text-neutral-700 bg-white border-2 border-slate-100 px-3 py-1 rounded-xl shadow-sm">
                                    {lesson.title}
                                    {/* Mały trójkącik (strzałka) dymka w górę */}
                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t-2 border-l-2 border-slate-100 rotate-45" />
                                </div>
                            ) : (
                                <div className="text-xs text-rose-500 font-bold bg-white/90 px-2 py-1 rounded shadow-sm border border-rose-100">
                                    Brak serc
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- LINIA (SVG) --- */}
                    {/* Rysujemy ją pod spodem (z-0). Startuje od środka przycisku w dół. */}
                    {!isLast && (
                      <div 
                        className="absolute top-8 left-0 pointer-events-none -z-10"
                        style={{ 
                            width: '1px', 
                            height: `${GAP_HEIGHT + LESSON_HEIGHT}px`, // Wysokość całkowita do środka nast. przycisku
                        }}
                      >
                         <svg 
                            className="overflow-visible"
                            width="100%"
                            height="100%"
                         >
                            {/* Start (M): 0 0 (Środek obecnego przycisku - technicznie top:8 przesuwa to na jego środek)
                                Koniec: deltaX (przesunięcie w poziomie), pełna wysokość (środek nast. przycisku)
                                Używamy krzywej Beziera (Q) dla gładkiego łuku
                            */}
                            <path
                              d={`
                                M 0 0 
                                Q 0 ${GAP_HEIGHT / 2} 
                                  ${deltaX / 2} ${GAP_HEIGHT / 2 + 20}
                                T ${deltaX} ${GAP_HEIGHT + 32}
                              `}
                              // ^ T to kontynuacja krzywej gładkiej, 32 to połowa wysokości przycisku (dojazd do środka)
                              
                              stroke="#cbd5e1" // slate-300
                              strokeWidth="10"
                              fill="none"
                              strokeDasharray="10 12" // Przerywana
                              strokeLinecap="round"
                              className="opacity-60"
                            />
                         </svg>
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