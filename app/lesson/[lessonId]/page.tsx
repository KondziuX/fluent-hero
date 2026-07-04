import { getLesson, getUserProgress, getUnits } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";
import { FlashcardLesson } from "../flashcard-lesson";
import { DialogLesson } from "../dialog-lesson";

// Lessons 1-5 use flashcard mode, lesson 6 uses dialog mode
const FLASHCARD_LESSON_IDS = [1, 2, 3, 4, 5];
const DIALOG_LESSON_IDS = [6];

/**
 * Checks if the previous non-intro lesson is completed (>= 80%).
 * If not, redirects to /learn.
 */
async function checkPreviousLessonCompleted(lessonId: number): Promise<boolean> {
  const units = await getUnits();
  
  for (const unit of units) {
    for (let i = 0; i < unit.lessons.length; i++) {
      const lesson = unit.lessons[i];
      if (lesson.id === lessonId) {
        // This is the current lesson - check previous non-intro lesson
        if (i === 0) return true; // First lesson is always accessible
        
        for (let j = i - 1; j >= 0; j--) {
          const prevLesson = unit.lessons[j];
          const prevIsIntro = (prevLesson as any).type === "intro";
          if (!prevIsIntro) {
            return prevLesson.isCompleted;
          }
        }
        return true; // No previous real lesson found
      }
    }
  }
  
  return true; // Lesson not found in any unit (shouldn't happen)
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const id = Number(lessonId);

  // Check if previous lesson is completed (for all lesson types)
  const canAccess = await checkPreviousLessonCompleted(id);
  if (!canAccess) {
    redirect("/learn");
  }

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
