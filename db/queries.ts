import { cache } from 'react';
import db from '@/db';
import { eq, asc } from 'drizzle-orm';
import { courses, units, lessons, challengeProgress, userProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';

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

  return data;
});

export const getUnits = cache(async () => {
  const userProgress = await getUserProgress();

  // Jeśli user nie ma aktywnego kursu, zwracamy pustą tablicę
  if (!userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userProgress.userId || 'placeholder'),
              }
            }
          }
        },
      },
    },
  });

  // Normalizacja danych (opcjonalne, ale ułatwia pracę na frontendzie)
  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      // Sprawdzamy, czy wszystkie wyzwania w lekcji są ukończone
      const allChallenges = lesson.challenges;
      const completedChallenges = allChallenges.filter((challenge) => {
        return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress[0].isCompleted;
      });

      const isCompleted = allChallenges.length > 0 && allChallenges.length === completedChallenges.length;

      return { ...lesson, isCompleted };
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