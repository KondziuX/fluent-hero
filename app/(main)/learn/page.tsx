import { upsertUserProgress } from '@/actions/user-progress';
import { FeedWrapper } from '@/components/feed-wrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import { UnitBanner } from '@/components/unit-banner';
import { Button } from '@/components/ui/button';
import { LockedLessonButton } from '@/components/locked-lesson-button';
import { getUnits, getUserProgress, getCourses } from '@/db/queries';
import Link from 'next/link';

// Próg zaliczenia lekcji: 80%
const LESSON_COMPLETION_THRESHOLD = 80;

export default async function LearnPage() {
  const userProgress = await getUserProgress();
  const units = await getUnits();
  const courses = await getCourses();
  
  const englishCourse = courses.find(c => c.slug === 'angielski-pl-en');

  // --- KONFIGURACJA GEOMETRII ---
  const HORIZONTAL_OFFSET = 70; // Rozrzut na boki (px)
  const LESSON_HEIGHT = 64;     // Wysokość przycisku (h-16 = 64px)
  const GAP_HEIGHT = 100;       // Odstęp między kafelkami w pionie
  // Całkowity skok w pionie między środkami kafelków
  const TOTAL_DY = GAP_HEIGHT + LESSON_HEIGHT;

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
                
                // --- LOGIKA BLOKOWANIA LEKCJI ---
                // Lekcja jest zablokowana jeśli poprzednia lekcja (non-intro) nie jest zaliczona w >= 80%
                let isLockedByPrevious = false;
                if (index > 0) {
                  // Find the previous non-intro lesson
                  for (let i = index - 1; i >= 0; i--) {
                    const prevLesson = unit.lessons[i];
                    const prevIsIntro = (prevLesson as any).type === "intro";
                    if (!prevIsIntro) {
                      // Previous real lesson found - check if it's completed
                      isLockedByPrevious = !prevLesson.isCompleted;
                      break;
                    }
                  }
                }

                // --- NUMERACJA LEKCJI (pomijając intro) ---
                // Liczymy tylko non-intro lekcje do wyświetlenia numeru
                let lessonNumber = 0;
                for (let i = 0; i <= index; i++) {
                  if ((unit.lessons[i] as any).type !== "intro") {
                    lessonNumber++;
                  }
                }

                // --- LOGIKA POZYCJONOWANIA (Twoje wytyczne) ---
                const getOffset = (idx: number) => {
                    const isFirst = idx === 0;
                    const isLast = idx === unit.lessons.length - 1;

                    // 1. Pierwsza i ostatnia lekcja -> ZAWSZE ŚRODEK
                    if (isFirst || isLast) {
                        return 0;
                    }

                    // 2. Reszta naprzemiennie:
                    // Indeks 1 (Lekcja 2) -> nieparzysty -> LEWO (-OFFSET)
                    // Indeks 2 (Lekcja 3) -> parzysty    -> PRAWO (+OFFSET)
                    const isOdd = idx % 2 !== 0;
                    return isOdd ? -HORIZONTAL_OFFSET : HORIZONTAL_OFFSET;
                };

                const currentOffset = getOffset(index);
                const nextOffset = getOffset(index + 1);
                
                // Delta X do następnego kafelka (dla rysowania linii)
                const deltaX = nextOffset - currentOffset;
                const isLast = index === unit.lessons.length - 1;

                const isIntroLesson = (lesson as any).type === "intro";

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center"
                    style={{
                      transform: `translateX(${currentOffset}px)`,
                      marginBottom: isLast ? 0 : `${GAP_HEIGHT}px`
                    }}
                  >
                    {/* --- KAFELEK LEKCJI --- */}
                    <div className="relative z-10">
                        {isLockedByHearts ? (
                        <LockedLessonButton type="hearts" />
                        ) : isLockedByPrevious ? (
                        <LockedLessonButton type="previous" />
                        ) : isIntroLesson ? (
                        <Link href={`/intro/${lesson.id}`}>
                            <Button
                            variant="secondary"
                            className="h-16 w-16 rounded-full border-b-4 active:border-b-0 text-xl bg-violet-100 hover:bg-violet-200 border-violet-300 text-violet-700"
                            >
                            📋
                            </Button>
                        </Link>
                        ) : (
                        <Link href={`/lesson/${lesson.id}`}>
                            <Button
                            variant={lesson.isCompleted ? "completed" : "secondary"}
                            className="h-16 w-16 rounded-full border-b-4 active:border-b-0 text-xl"
                            >
                            {lesson.isCompleted ? "✓" : lessonNumber}
                            </Button>
                        </Link>
                        )}
                        
                        {/* Dymek z tytułem (tooltip) - zawsze pokazuje tytuł lekcji */}
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-max text-center z-20 transition-opacity opacity-100">
                            <div className="text-sm font-bold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 px-3 py-1 rounded-xl shadow-sm">
                                {lesson.title}
                                {isLockedByHearts && (
                                  <div className="text-xs text-rose-500 font-normal mt-0.5">Brak serc</div>
                                )}
                                {lesson.isCompleted && (lesson as any).percentage !== undefined && (
                                  <span className="block text-xs text-green-600 font-normal mt-0.5">
                                    {(lesson as any).percentage}% opanowane
                                  </span>
                                )}
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-t-2 border-l-2 border-slate-100 dark:border-slate-800 rotate-45" />
                            </div>
                        </div>
                    </div>

                    {/* --- LINIA (SVG) --- */}
                    {!isLast && (
                      <div
                        // Fix SVG: width 1px + overflow-visible + centrowanie absolutne
                        className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none -z-10"
                        style={{
                            width: '1px',
                            height: `${TOTAL_DY}px`,
                        }}
                      >
                         <svg
                            className="overflow-visible"
                            width="100%"
                            height="100%"
                         >
                            {/* Rysujemy od (0,0) czyli środka obecnego kafelka */}
                            {/* do (deltaX, TOTAL_DY) czyli środka następnego kafelka */}
                            <path
                              d={`
                                M 0 0
                                C 0 ${TOTAL_DY * 0.5},
                                  ${deltaX} ${TOTAL_DY * 0.5},
                                  ${deltaX} ${TOTAL_DY}
                              `}
                              strokeWidth="10"
                              fill="none"
                              strokeDasharray="10 12"
                              strokeLinecap="round"
                              className="opacity-50 stroke-slate-300 dark:stroke-slate-700"
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