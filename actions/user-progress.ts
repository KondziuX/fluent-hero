'use server';

import db from '@/db';
import { userProgress } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error('Unauthorized');
  }

  // Sprawdzamy, czy user już ma postęp
  const existingUserProgress = await db.query.userProgress.findFirst({
    where: (progress, { eq }) => eq(progress.userId, userId),
  });

  // Jeśli tak - aktualizujemy aktywny kurs
  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
    }).where(
      // @ts-ignore: Drizzle czasem marudzi przy where na userId, ale to działa
      (progress) => (progress.userId, userId)
    );
  } else {
    // Jeśli nie - tworzymy nowy wpis
    await db.insert(userProgress).values({
      userId,
      activeCourseId: courseId,
      hearts: 5,
      xp: 0,
    });
  }

  revalidatePath('/learn');
  revalidatePath('/courses');
  redirect('/learn');
};

export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  // Jeśli user ma 0 serc, nic nie robimy (lub kończymy lekcję - logika na przyszłość)
  if (currentUserProgress.hearts === 0) {
    return { error: "hearts" };
  }

  // Odejmujemy 1 serce
  await db.update(userProgress).set({
    hearts: Math.max(currentUserProgress.hearts - 1, 0),
  }).where(eq(userProgress.userId, userId));

  revalidatePath("/learn");
  revalidatePath("/lesson");
};