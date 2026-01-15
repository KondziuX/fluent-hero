'use server';

import db from '@/db';
import { challengeProgress, userProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // 1. Zapisujemy w bazie, że to konkretne pytanie (challenge) jest zrobione
  await db.insert(challengeProgress).values({
    challengeId,
    userId,
    isCompleted: true,
  }).onConflictDoUpdate({
    target: [challengeProgress.userId, challengeProgress.challengeId],
    set: { isCompleted: true },
  });

  // 2. Dodajemy nagrodę (np. 10 XP) za poprawną odpowiedź
  // Używamy sql``, aby bezpiecznie dodać wartość do obecnego stanu
  await db.update(userProgress).set({
    xp: sql`${userProgress.xp} + 10`,
  }).where(eq(userProgress.userId, userId));

  // 3. Odświeżamy widoki, żeby użytkownik od razu widział zmiany (zielone kółko na mapie)
  revalidatePath('/learn');
  revalidatePath('/lesson');
};