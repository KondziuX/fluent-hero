"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Volume2, ArrowLeft } from "lucide-react";
import { LESSON_1_FLASHCARDS } from "@/data/flashcards";
import type { Flashcard, FlashcardStatus } from "@/data/flashcards";
import { saveFlashcardProgress } from "@/actions/flashcard-progress";
import { FlashcardSummary } from "./flashcard-summary";

interface FlashcardLessonProps {
  lessonId: number;
}

export const FlashcardLesson = ({ lessonId }: FlashcardLessonProps) => {
  const router = useRouter();
  const flashcards = LESSON_1_FLASHCARDS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<Map<string, FlashcardStatus>>(new Map());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Session timing
  const [startTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  const currentCard: Flashcard | undefined = flashcards[currentIndex];
  const totalCards = flashcards.length;
  const evaluatedCount = results.size;

  // Reset flip when moving to next card
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  }, [isFlipped]);

  const handleEvaluate = useCallback(
    async (status: FlashcardStatus) => {
      if (!currentCard) return;

      const newResults = new Map(results);
      newResults.set(currentCard.id, status);
      setResults(newResults);

      // If this was the last card
      if (currentIndex >= totalCards - 1) {
        const now = new Date();
        setEndTime(now);
        setIsCompleted(true);

        // Save progress
        const knownCount = Array.from(newResults.values()).filter(
          (s) => s === "known"
        ).length;
        const learningCount = Array.from(newResults.values()).filter(
          (s) => s === "learning"
        ).length;
        const hardCount = Array.from(newResults.values()).filter(
          (s) => s === "hard"
        ).length;
        const durationSeconds = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );

        setIsPending(true);
        try {
          await saveFlashcardProgress({
            lessonId,
            totalCards,
            knownCount,
            learningCount,
            hardCount,
            durationSeconds,
          });
        } catch (error) {
          console.error("Failed to save flashcard progress:", error);
        } finally {
          setIsPending(false);
        }
      } else {
        // Move to next card (flip will reset via useEffect)
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentCard, currentIndex, results, totalCards, lessonId, startTime]
  );

  // --- SUMMARY SCREEN ---
  if (isCompleted && endTime) {
    const knownCount = Array.from(results.values()).filter(
      (s) => s === "known"
    ).length;
    const learningCount = Array.from(results.values()).filter(
      (s) => s === "learning"
    ).length;
    const hardCount = Array.from(results.values()).filter(
      (s) => s === "hard"
    ).length;
    const durationSeconds = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000
    );

    return (
      <FlashcardSummary
        totalCards={totalCards}
        knownCount={knownCount}
        learningCount={learningCount}
        hardCount={hardCount}
        durationSeconds={durationSeconds}
        isPending={isPending}
      />
    );
  }

  // --- SAFEGUARD (no card) ---
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Brak fiszek</h1>
        <Button onClick={() => router.push("/learn")} className="mt-4">
          Wróć do mapy
        </Button>
      </div>
    );
  }

  const progressPercent = totalCards > 0 ? (evaluatedCount / totalCards) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* --- GRADIENT HEADER --- */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white px-6 pt-8 pb-16 rounded-b-[2rem] shadow-lg">
        <div className="max-w-lg mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.push("/learn")}
            className="mb-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors"
            aria-label="Powrót do mapy"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Przerwij sesję</span>
          </button>

          {/* Label */}
          <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Metoda 10 minut dziennie
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-1">
            Start rozmowy: najbezpieczniejsze powitania
          </h1>

          {/* Description */}
          <p className="text-white/80 text-sm">
            Opanuj 8 uniwersalnych angielskich powitań na każdą sytuację.
          </p>
        </div>
      </div>

      {/* --- SESSION INFO --- */}
      <div className="max-w-lg mx-auto w-full px-6 -mt-8 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/learn")}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Przerwij sesję
          </button>
          <span className="text-sm font-semibold text-slate-700">
            Karta {evaluatedCount + 1} z {totalCards}
          </span>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <Progress value={progressPercent} className="h-2 bg-slate-200" />
        </div>
      </div>

      {/* --- FLASHCARD --- */}
      <div className="flex-1 flex flex-col items-center px-6 max-w-lg mx-auto w-full">
        <div
          className="flip-card w-full aspect-[3/4] max-h-[420px] cursor-pointer mb-6"
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleFlip();
            }
          }}
          aria-label={
            isFlipped
              ? "Odwróć fiszkę, aby zobaczyć polski opis"
              : "Kliknij, aby odwrócić fiszkę"
          }
        >
          <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
            {/* --- FRONT (Polish) --- */}
            <div className="flip-card-front bg-white shadow-xl border border-slate-100">
              <div className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-4">
                Polski
              </div>
              <p className="text-xl md:text-2xl font-semibold text-slate-800 text-center leading-relaxed">
                {currentCard.front}
              </p>
              {!isFlipped && (
                <p className="text-xs text-slate-400 mt-6">
                  Kliknij kartę, aby zobaczyć tłumaczenie
                </p>
              )}
            </div>

            {/* --- BACK (English) --- */}
            <div className="flip-card-back bg-slate-900 shadow-xl border border-slate-700">
              {/* Speaker icon - disabled, English side only */}
              <button
                className="absolute top-4 right-4 text-white/30 cursor-not-allowed"
                aria-disabled="true"
                aria-label="Odtwarzanie audio (niedostępne)"
                disabled
                tabIndex={-1}
              >
                <Volume2 className="h-6 w-6" />
              </button>

              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-4">
                Angielski
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white text-center leading-relaxed">
                {currentCard.back}
              </p>
              <p className="text-xs text-slate-500 mt-6">
                Kliknij, aby powrócić
              </p>
            </div>
          </div>
        </div>

        {/* --- FLIP BUTTON (visible only when not flipped) --- */}
        {!isFlipped && (
          <Button
            size="lg"
            variant="outline"
            className="w-full mb-4 border-2 border-violet-300 text-violet-700 hover:bg-violet-50"
            onClick={handleFlip}
          >
            ODWRÓĆ FISZKĘ
          </Button>
        )}

        {/* --- EVALUATION BUTTONS (visible only when flipped) --- */}
        {isFlipped && (
          <div className="w-full flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold py-6"
              onClick={() => handleEvaluate("hard")}
              aria-label="Oceń jako trudne"
            >
              Słabo / Trudne
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-2 border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700 font-semibold py-6"
              onClick={() => handleEvaluate("learning")}
              aria-label="Oceń jako do nauki"
            >
              Tak sobie / Uczę się
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-6"
              onClick={() => handleEvaluate("known")}
              aria-label="Oceń jako opanowane"
            >
              Super / Znam!
            </Button>
          </div>
        )}

        {/* Spacer for bottom area */}
        <div className="h-8" />
      </div>
    </div>
  );
};
