'use server';

import db from '@/db';
import { userProgress } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Saves dialog lesson session results and awards XP for correct answers without hints.
 * XP value: 10 per correct answer without hint (same as upsertChallengeProgress).
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

  revalidatePath('/learn');
  revalidatePath('/lesson');

  return { xpEarned };
};
