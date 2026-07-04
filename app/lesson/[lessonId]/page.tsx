import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";
import { FlashcardLesson } from "../flashcard-lesson";
import { DialogLesson } from "../dialog-lesson";

// Lessons 1-5 use flashcard mode, lesson 6 uses dialog mode
const FLASHCARD_LESSON_IDS = [1, 2, 3, 4, 5];
const DIALOG_LESSON_IDS = [6];

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const id = Number(lessonId);

  // Lessons 1-5 use flashcard mode
  if (FLASHCARD_LESSON_IDS.includes(id)) {
    return <FlashcardLesson lessonId={id} />;
  }

  // Lesson 6 uses dialog mode (boss fight)
  if (DIALOG_LESSON_IDS.includes(id)) {
    return <DialogLesson lessonId={id} />;
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
