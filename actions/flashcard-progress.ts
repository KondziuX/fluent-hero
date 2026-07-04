'use server';

import db from '@/db';
import { userProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Saves flashcard session results and awards XP for "known" cards.
 * XP value: 10 per "known" card (same as upsertChallengeProgress).
 */
export const saveFlashcardProgress = async ({
  lessonId,
  totalCards,
  knownCount,
  learningCount,
  hardCount,
  durationSeconds,
}: {
  lessonId: number;
  totalCards: number;
  knownCount: number;
  learningCount: number;
  hardCount: number;
  durationSeconds: number;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Award XP only for "known" cards (10 XP each, matching the existing challenge XP value)
  const xpEarned = knownCount * 10;

  if (xpEarned > 0) {
    await db.update(userProgress).set({
      xp: sql`${userProgress.xp} + ${xpEarned}`,
    }).where(eq(userProgress.userId, userId));
  }

  revalidatePath('/learn');
  revalidatePath('/lesson');

  return { xpEarned };
};
