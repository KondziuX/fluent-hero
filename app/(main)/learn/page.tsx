import { upsertUserProgress } from '@/actions/user-progress';
import { FeedWrapper } from '@/components/feed-wrapper';
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
  const HORIZONTAL_OFFSET = 70;
  const LESSON_HEIGHT = 64;
  const GAP_HEIGHT = 100;
  const TOTAL_DY = GAP_HEIGHT + LESSON_HEIGHT;

  if (!userProgress || !userProgress.activeCourse) {
    if (!englishCourse) {
       return <div className="p-4 text-[#475569]">Błąd: Brak kursów w bazie. Uruchom "npm run db:seed"</div>;
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <h1 className="h1-mobile text-center">Witaj w Fluent-Hero!</h1>
        <p className="text-[#475569] text-center">Rozpocznij swoją przygodę z nauką angielskiego.</p>
        <form action={async () => {
          'use server';
          await upsertUserProgress(englishCourse.id);
        }}>
          <Button size="lg" className="w-full rounded-full">Rozpocznij kurs</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-0">
      <FeedWrapper>
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <UnitBanner title={unit.title} description={unit.description} />

            <div className="flex flex-col items-center relative pb-20">
              {unit.lessons.map((lesson, index) => {
                const isCompleted = lesson.isCompleted;
                const isLockedByHearts = !isCompleted && userProgress.hearts === 0;
                
                // --- LOGIKA BLOKOWANIA LEKCJI ---
                let isLockedByPrevious = false;
                if (index > 0) {
                  for (let i = index - 1; i >= 0; i--) {
                    const prevLesson = unit.lessons[i];
                    const prevIsIntro = (prevLesson as any).type === "intro";
                    if (!prevIsIntro) {
                      isLockedByPrevious = !prevLesson.isCompleted;
                      break;
                    }
                  }
                }

                // --- NUMERACJA LEKCJI ---
                let lessonNumber = 0;
                for (let i = 0; i <= index; i++) {
                  if ((unit.lessons[i] as any).type !== "intro") {
                    lessonNumber++;
                  }
                }

                // --- LOGIKA POZYCJONOWANIA ---
                const getOffset = (idx: number) => {
                    const isFirst = idx === 0;
                    const isLast = idx === unit.lessons.length - 1;

                    if (isFirst || isLast) {
                        return 0;
                    }

                    const isOdd = idx % 2 !== 0;
                    return isOdd ? -HORIZONTAL_OFFSET : HORIZONTAL_OFFSET;
                };

                const currentOffset = getOffset(index);
                const nextOffset = getOffset(index + 1);
                
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
                            variant="outline"
                            className="h-16 w-16 rounded-full text-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border-[#E2E8F0] text-[#7C3AED]"
                            >
                            📋
                            </Button>
                        </Link>
                        ) : (
                        <Link href={`/lesson/${lesson.id}`}>
                            <Button
                            variant={lesson.isCompleted ? "completed" : "outline"}
                            className="h-16 w-16 rounded-full text-xl"
                            >
                            {lesson.isCompleted ? "✓" : lessonNumber}
                            </Button>
                        </Link>
                        )}
                        
                        {/* Dymek z tytułem (tooltip) */}
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-max text-center z-20 transition-opacity opacity-100">
                            <div className="text-sm font-bold text-[#111827] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
                                {lesson.title}
                                {isLockedByHearts && (
                                  <div className="text-xs text-[#E11D48] font-normal mt-0.5">Brak serc</div>
                                )}
                                {lesson.isCompleted && (lesson as any).percentage !== undefined && (
                                  <span className="block text-xs text-[#16A34A] font-normal mt-0.5">
                                    {(lesson as any).percentage}% opanowane
                                  </span>
                                )}
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-[#E2E8F0] rotate-45" />
                            </div>
                        </div>
                    </div>

                    {/* --- LINIA (SVG) --- */}
                    {!isLast && (
                      <div
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
                              className="opacity-40 stroke-[#CBD5E1]"
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