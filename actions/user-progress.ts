'use server';

import db from '@/db';
import { userProgress } from '@/db/schema';
import { getUserProgress } from '@/db/queries'; // <--- TO BYŁ BRAKUJĄCY ELEMENT!
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
  const existingUserProgress = await getUserProgress();

  // Pobieramy dane z Clerk
  const userName = user.firstName || "User"; 
  const userImage = user.imageUrl || "/mascot.svg";

  // Jeśli tak - aktualizujemy aktywny kurs
  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName,
      userImage,
    }).where(eq(userProgress.userId, userId));
  } else {
    // Jeśli nie - tworzymy nowy wpis
    await db.insert(userProgress).values({
      userId,
      activeCourseId: courseId,
      userName,
      userImage,
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

  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  // Jeśli user ma 0 serc, nic nie robimy
  if (currentUserProgress.hearts === 0) {
    return { error: "hearts" };
  }

  await db.update(userProgress).set({
    hearts: Math.max(currentUserProgress.hearts - 1, 0),
    lastHeartRefill: currentUserProgress.hearts === 5 ? new Date() : undefined,
  }).where(eq(userProgress.userId, userId));

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  if (currentUserProgress.hearts === 5) {
    throw new Error("Hearts are already full");
  }

  if (currentUserProgress.xp < 50) {
    throw new Error("Not enough points");
  }

  await db.update(userProgress).set({
    hearts: 5, // Odnawiamy na max
    xp: currentUserProgress.xp - 50, // Pobieramy opłatę
  }).where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/lesson");
};