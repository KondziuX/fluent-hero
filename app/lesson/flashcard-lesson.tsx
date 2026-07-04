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

  const isEvaluatingRef = useRef(false);

  const [startTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  const currentCard: Flashcard | undefined = flashcards[currentIndex];
  const totalCards = flashcards.length;
  const evaluatedCount = results.size;

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

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

      if (currentIndex >= totalCards - 1) {
        const now = new Date();
        setEndTime(now);
        setIsCompleted(true);

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
        setIsFlipped(false);
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
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold text-[#111827]">Brak fiszek</h1>
        <Button onClick={() => router.push("/learn")} className="mt-4 rounded-full">
          Wróć do mapy
        </Button>
      </div>
    );
  }

  const progressPercent = totalCards > 0 ? (evaluatedCount / totalCards) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FC]">
      {/* --- GRADIENT HEADER --- */}
      <div className="bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#2563EB] text-white px-6 pt-8 pb-16 rounded-b-[2rem] shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => router.push("/learn")}
            className="mb-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors"
            aria-label="Powrót do mapy"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Przerwij sesję</span>
          </button>

          <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Metoda 10 minut dziennie
          </div>

          <h1 className="text-2xl font-bold mb-1">
            {lessonData.title}
          </h1>

          <p className="text-white/80 text-sm">
            {lessonData.description}
          </p>
        </div>
      </div>

      {/* --- SESSION INFO --- */}
      <div className="max-w-lg mx-auto w-full px-6 -mt-8 mb-6">
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/learn")}
            className="text-sm text-[#64748B] hover:text-[#111827] transition-colors"
          >
            Przerwij sesję
          </button>
          <span className="text-sm font-semibold text-[#475569]">
            Karta {evaluatedCount + 1} z {totalCards}
          </span>
          <div className="w-16" />
        </div>

        <div className="mt-3">
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* --- FLASHCARD --- */}
      <div className="flex-1 flex flex-col items-center px-6 max-w-lg mx-auto w-full">
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
            <div className="flip-card-front bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0]">
              <div className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-4">
                Polski
              </div>
              <p className="text-2xl md:text-3xl font-bold text-[#111827] text-center leading-relaxed">
                {currentCard.front}
              </p>
              {currentCard.hint && (
                <p className="text-sm text-[#64748B] text-center mt-4 max-w-xs leading-relaxed">
                  {currentCard.hint}
                </p>
              )}
              {!isFlipped && (
                <p className="text-xs text-[#94A3B8] mt-6">
                  Kliknij kartę, aby zobaczyć tłumaczenie
                </p>
              )}
            </div>

            {/* --- BACK (English) --- */}
            <div className="flip-card-back bg-gradient-to-br from-[#1E293B] to-[#0F172A] shadow-xl border border-[#334155]">
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

              <div className="text-xs font-bold text-[#93C5FD] uppercase tracking-wider mb-4">
                Angielski
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white text-center leading-relaxed">
                {currentCard.back}
              </p>
              <p className="text-xs text-[#64748B] mt-6">
                Kliknij, aby powrócić
              </p>
            </div>
          </div>
        </div>

        {/* --- EVALUATION BUTTONS --- */}
        {isFlipped && (
          <div className="w-full flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-2 border-[#FECACA] text-[#E11D48] hover:bg-[#FEF2F2] hover:text-[#BE123C] font-semibold py-6 rounded-full"
              onClick={() => handleEvaluate("hard")}
              aria-label="Oceń jako trudne"
            >
              Słabo / Trudne
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-2 border-[#FDE68A] text-[#D97706] hover:bg-[#FFFBEB] hover:text-[#B45309] font-semibold py-6 rounded-full"
              onClick={() => handleEvaluate("learning")}
              aria-label="Oceń jako do nauki"
            >
              Tak sobie / Uczę się
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:opacity-90 text-white font-semibold py-6 rounded-full"
              onClick={() => handleEvaluate("known")}
              aria-label="Oceń jako opanowane"
            >
              Super / Znam!
            </Button>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
};
