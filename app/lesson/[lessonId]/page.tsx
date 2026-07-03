import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";
import { FlashcardLesson } from "../flashcard-lesson";

// Lesson 1 (ID = 1) uses the new flashcard mode
const FLASHCARD_LESSON_IDS = [1];

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const id = Number(lessonId);

  // Lesson 1 uses flashcard mode
  if (FLASHCARD_LESSON_IDS.includes(id)) {
    return <FlashcardLesson lessonId={id} />;
  }

  // Other lessons use the existing quiz mode
  const [lesson, userProgress] = await Promise.all([
    getLesson(id),
    getUserProgress(),
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  // Calculate initial progress percentage
  const initialPercentage = lesson.challenges
    .filter((challenge) => challenge.isCompleted)
    .length / lesson.challenges.length * 100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
    />
  );
}
