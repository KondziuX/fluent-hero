"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Volume2, ArrowLeft } from "lucide-react";
import { LESSON_1_FLASHCARDS, LESSON_2_FLASHCARDS, LESSON_3_FLASHCARDS, LESSON_4_FLASHCARDS, LESSON_5_FLASHCARDS } from "@/data/flashcards";
import type { Flashcard, FlashcardStatus } from "@/data/flashcards";
import { saveFlashcardProgress } from "@/actions/flashcard-progress";
import { FlashcardSummary } from "./flashcard-summary";

interface FlashcardLessonProps {
  lessonId: number;
}

const FLASHCARD_DATA: Record<number, { cards: typeof LESSON_1_FLASHCARDS; title: string; description: string }> = {
  1: {
    cards: LESSON_1_FLASHCARDS,
    title: "Start rozmowy: najbezpieczniejsze powitania",
    description: "Opanuj 8 uniwersalnych angielskich powitań na każdą sytuację.",
  },
  2: {
    cards: LESSON_2_FLASHCARDS,
    title: "Powitania o różnych porach dnia",
    description: "Naucz się witać po angielsku o różnych porach dnia – od ranka do wieczora.",
  },
  3: {
    cards: LESSON_3_FLASHCARDS,
    title: "Luźne powitania ze znajomymi",
    description: "Poznaj nieformalne angielskie powitania używane w codziennych rozmowach ze znajomymi.",
  },
  4: {
    cards: LESSON_4_FLASHCARDS,
    title: "Jak się masz? jako uprzejmość",
    description: "Naucz się pytać o samopoczucie po angielsku – od formalnych po codzienne zwroty.",
  },
  5: {
    cards: LESSON_5_FLASHCARDS,
    title: "Pierwsze spotkanie",
    description: "Poznaj zwroty przydatne podczas pierwszego spotkania z nową osobą.",
  },
};

export const FlashcardLesson = ({ lessonId }: FlashcardLessonProps) => {
  const router = useRouter();
  const lessonData = FLASHCARD_DATA[lessonId] ?? FLASHCARD_DATA[1];
  const flashcards = lessonData.cards;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<Map<string, FlashcardStatus>>(new Map());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Use a ref to track if we're in the middle of evaluating (to prevent double-firing)
  const isEvaluatingRef = useRef(false);

  // Session timing
  const [startTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  const currentCard: Flashcard | undefined = flashcards[currentIndex];
  const totalCards = flashcards.length;
  const evaluatedCount = results.size;

  // Reset flip when moving to next card — happens BEFORE the new card renders
  // because we set isFlipped=false synchronously in handleEvaluate before setCurrentIndex
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Toggle flip both ways — unlimited flipping
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleEvaluate = useCallback(
    async (status: FlashcardStatus) => {
      if (!currentCard || isEvaluatingRef.current) return;
      isEvaluatingRef.current = true;

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
          isEvaluatingRef.current = false;
        }
      } else {
        // Reset flip FIRST, then move to next card
        // This ensures the next card starts from the front (Polish side)
        setIsFlipped(false);
        // Use setTimeout with 0 to ensure the flip reset renders before index change
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          isEvaluatingRef.current = false;
        }, 0);
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
            {lessonData.title}
          </h1>

          {/* Description */}
          <p className="text-white/80 text-sm">
            {lessonData.description}
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
        {/* key={currentCard.id} forces a complete re-mount of the card when index changes,
            ensuring the new card always starts from the front (Polish side) */}
        <div
          key={currentCard.id}
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
              <p className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-relaxed">
                {currentCard.front}
              </p>
              {currentCard.hint && (
                <p className="text-sm text-slate-500 text-center mt-4 max-w-xs leading-relaxed">
                  {currentCard.hint}
                </p>
              )}
              {!isFlipped && (
                <p className="text-xs text-slate-400 mt-6">
                  Kliknij kartę, aby zobaczyć tłumaczenie
                </p>
              )}
            </div>

            {/* --- BACK (English) --- */}
            <div className="flip-card-back bg-slate-900 shadow-xl border border-slate-700">
              {/* Speaker icon - disabled, English side only.
                  pointer-events-none ensures clicks pass through to the card flip handler. */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <button
                  className="text-white/30 cursor-not-allowed"
                  aria-disabled="true"
                  aria-label="Odtwarzanie audio (niedostępne)"
                  disabled
                  tabIndex={-1}
                >
                  <Volume2 className="h-6 w-6" />
                </button>
              </div>

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
