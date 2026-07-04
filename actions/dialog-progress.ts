'use server';

import db from '@/db';
import { userProgress, lessonProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Saves dialog lesson session results and awards XP for correct answers without hints.
 * XP value: 10 per correct answer without hint (same as upsertChallengeProgress).
 * Also saves lesson progress with completion percentage.
 * A lesson is considered completed when >= 80% of answers are correct.
 */
export const saveDialogProgress = async ({
  lessonId,
  completedDialogs,
  correctAnswers,
  hintsUsed,
  skippedCount,
  xpEarned,
  durationSeconds,
}: {
  lessonId: number;
  completedDialogs: number;
  correctAnswers: number;
  hintsUsed: number;
  skippedCount: number;
  xpEarned: number;
  durationSeconds: number;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Award XP only for correct answers without hints
  if (xpEarned > 0) {
    await db.update(userProgress).set({
      xp: sql`${userProgress.xp} + ${xpEarned}`,
    }).where(eq(userProgress.userId, userId));
  }

  // Calculate completion percentage (correct answers / total user turns)
  const totalUserTurns = correctAnswers + hintsUsed + skippedCount;
  const percentage = totalUserTurns > 0 ? Math.round((correctAnswers / totalUserTurns) * 100) : 0;
  const isCompleted = percentage >= 80;

  // Save lesson progress
  await db.insert(lessonProgress).values({
    userId,
    lessonId,
    completed: isCompleted,
    percentage,
    knownCount: correctAnswers,
    totalCount: totalUserTurns,
  }).onConflictDoUpdate({
    target: [lessonProgress.userId, lessonProgress.lessonId],
    set: {
      completed: isCompleted,
      percentage,
      knownCount: correctAnswers,
      totalCount: totalUserTurns,
      lastAttemptAt: new Date(),
    },
  });

  revalidatePath('/learn');
  revalidatePath('/lesson');

  return { xpEarned, percentage, isCompleted };
};
