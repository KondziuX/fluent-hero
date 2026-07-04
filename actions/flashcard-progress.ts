'use server';

import db from '@/db';
import { userProgress, lessonProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Saves flashcard session results and awards XP for "known" cards.
 * XP value: 10 per "known" card (same as upsertChallengeProgress).
 * Also saves lesson progress with completion percentage.
 * A lesson is considered completed when >= 80% of cards are "known".
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

  // Calculate completion percentage (known cards / total cards)
  const percentage = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0;
  const isCompleted = percentage >= 80;

  // Save lesson progress
  await db.insert(lessonProgress).values({
    userId,
    lessonId,
    completed: isCompleted,
    percentage,
    knownCount,
    totalCount: totalCards,
  }).onConflictDoUpdate({
    target: [lessonProgress.userId, lessonProgress.lessonId],
    set: {
      completed: isCompleted,
      percentage,
      knownCount,
      totalCount: totalCards,
      lastAttemptAt: new Date(),
    },
  });

  revalidatePath('/learn');
  revalidatePath('/lesson');

  return { xpEarned, percentage, isCompleted };
};
