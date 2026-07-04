import { cache } from 'react';
import db from '@/db';
import { eq, asc } from 'drizzle-orm';
import { courses, units, lessons, challengeProgress, userProgress, lessonProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';

// Stała: Czas odnawiania jednego serca w milisekundach (3 minuty)
const HEART_REFILL_TIME = 3 * 60 * 1000;

// Próg zaliczenia lekcji: 80%
const LESSON_COMPLETION_THRESHOLD = 80;

// Używamy cache z React, aby nie męczyć bazy przy każdym odświeżeniu
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  if (!data) return null;

  // --- LOGIKA ODNAWIANIA SERC (Tego brakowało!) ---
  // Sprawdzamy czy user ma mniej niż 5 serc i czy mamy datę ostatniego odnowienia
  if (data.hearts < 5 && data.lastHeartRefill) {
    const now = Date.now();
    const lastRefill = new Date(data.lastHeartRefill).getTime();
    
    // Obliczamy ile czasu minęło od ostatniego zapisanego momentu
    const timePassed = now - lastRefill;

    // Ile pełnych cykli (3 min) minęło w tym czasie?
    const heartsToAdd = Math.floor(timePassed / HEART_REFILL_TIME);

    // Jeśli minął co najmniej jeden cykl, dodajemy serca
    if (heartsToAdd > 0) {
      // Obliczamy nową liczbę serc (nie więcej niż 5)
      const newHearts = Math.min(data.hearts + heartsToAdd, 5);
      
      // Obliczamy nowy czas "startu" odliczania.
      // Nie ustawiamy "teraz", tylko "kiedy powinno wpaść ostatnie serce",
      // żeby zachować "resztki" czasu na kolejne serce.
      const newLastHeartRefill = newHearts === 5
        ? null // Jak pełne, to zerujemy licznik
        : new Date(lastRefill + (heartsToAdd * HEART_REFILL_TIME));

      // Aktualizujemy bazę danych
      await db.update(userProgress).set({
        hearts: newHearts,
        lastHeartRefill: newLastHeartRefill,
      }).where(eq(userProgress.userId, userId));

      // Zwracamy zaktualizowane dane lokalnie (żeby user widział efekt od razu)
      return {
        ...data,
        hearts: newHearts,
        lastHeartRefill: newLastHeartRefill
      };
    }
  }
  // -----------------------------

  return data;
});

export const getUnits = cache(async () => {
  const userProgressData = await getUserProgress();

  if (!userProgressData?.activeCourseId) {
    return [];
  }

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgressData.activeCourseId),
    orderBy: [asc(units.order)],
    with: {
      lessons: {
        orderBy: [asc(lessons.order)],
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userProgressData.userId || 'placeholder'),
              }
            }
          }
        },
      },
    },
  });

  // Fetch lesson progress for the user (flashcard and dialog lessons)
  const lessonProgressData = await db.query.lessonProgress.findMany({
    where: eq(lessonProgress.userId, userProgressData.userId || 'placeholder'),
  });

  const lessonProgressMap = new Map(
    lessonProgressData.map(lp => [lp.lessonId, lp])
  );

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      // Check if this lesson has lessonProgress (flashcard/dialog mode)
      const lp = lessonProgressMap.get(lesson.id);

      if (lp) {
        // Use lessonProgress data: completed if percentage >= 80%
        return {
          ...lesson,
          isCompleted: lp.completed,
          percentage: lp.percentage,
        };
      }

      // For quiz-based lessons (with DB challenges), check challenge progress
      const allChallenges = lesson.challenges;
      const completedChallenges = allChallenges.filter((challenge) => {
        return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress[0].isCompleted;
      });

      // 80% threshold: lesson is completed if at least 80% of challenges are completed
      const percentage = allChallenges.length > 0
        ? Math.round((completedChallenges.length / allChallenges.length) * 100)
        : 0;
      const isCompleted = allChallenges.length > 0 && percentage >= LESSON_COMPLETION_THRESHOLD;

      return { ...lesson, isCompleted, percentage };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getLesson = cache(async (id: number) => {
    const { userId } = await auth();
  
    if (!userId) {
      return null;
    }
  
    const courseProgress = await getUserProgress();
  
    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
      with: {
        challenges: {
          orderBy: (challenges, { asc }) => [asc(challenges.order)],
          with: {
            challengeOptions: true,
            challengeProgress: {
              where: eq(challengeProgress.userId, userId),
            },
          },
        },
      },
    });
  
    if (!data || !courseProgress) {
      return null;
    }
  
    const normalizedChallenges = data.challenges.map((challenge) => {
      const isCompleted = challenge.challengeProgress 
        && challenge.challengeProgress.length > 0 
        && challenge.challengeProgress[0].isCompleted;
  
      return { ...challenge, isCompleted };
    });
  
    return { ...data, challenges: normalizedChallenges };
});

export const getTopTenUsers = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.xp)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImage: true,
      xp: true,
    },
  });

  return data;
});