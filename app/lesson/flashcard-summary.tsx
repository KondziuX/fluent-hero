"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Zap, CheckCircle2, BookOpen, AlertTriangle } from "lucide-react";

interface FlashcardSummaryProps {
  totalCards: number;
  knownCount: number;
  learningCount: number;
  hardCount: number;
  durationSeconds: number;
  isPending: boolean;
}

export const FlashcardSummary = ({
  totalCards,
  knownCount,
  learningCount,
  hardCount,
  durationSeconds,
  isPending,
}: FlashcardSummaryProps) => {
  const router = useRouter();

  const trainedCount = totalCards; // All cards were evaluated
  const knownPercent = trainedCount > 0 ? Math.round((knownCount / trainedCount) * 100) : 0;
  const learningPercent = trainedCount > 0 ? Math.round((learningCount / trainedCount) * 100) : 0;
  const hardPercent = trainedCount > 0 ? Math.round((hardCount / trainedCount) * 100) : 0;

  // XP: 10 per known card (same value as in upsertChallengeProgress)
  const xpEarned = knownCount * 10;

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white px-6 pt-12 pb-16 rounded-b-[2rem] shadow-lg">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Lekcja ukończona!</h1>
          <p className="text-white/80 text-lg">Świetna robota! Oto Twoje wyniki.</p>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="max-w-lg mx-auto w-full px-6 -mt-8 space-y-4">
        {/* XP Card */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-orange-400">
          <div className="bg-orange-100 p-3 rounded-full">
            <Zap className="h-6 w-6 text-orange-500 fill-current" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Zdobyte XP</p>
            <p className="text-2xl font-bold text-orange-600">+{xpEarned}</p>
          </div>
        </div>

        {/* Trained cards */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-violet-400">
          <div className="bg-violet-100 p-3 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Przetrenowane fiszki</p>
            <p className="text-2xl font-bold text-violet-700">
              {trainedCount} / {totalCards}
            </p>
          </div>
        </div>

        {/* Known cards */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-green-400">
          <div className="bg-green-100 p-3 rounded-full">
            <Trophy className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Opanowane</p>
            <p className="text-2xl font-bold text-green-600">
              {knownCount} ({knownPercent}%)
            </p>
          </div>
        </div>

        {/* Learning cards */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-amber-400">
          <div className="bg-amber-100 p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Do nauki</p>
            <p className="text-2xl font-bold text-amber-600">
              {learningCount} ({learningPercent}%)
            </p>
          </div>
        </div>

        {/* Hard cards */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-red-400">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Trudne</p>
            <p className="text-2xl font-bold text-red-600">
              {hardCount} ({hardPercent}%)
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-sky-400">
          <div className="bg-sky-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Czas trwania</p>
            <p className="text-2xl font-bold text-sky-600">{formattedTime}</p>
          </div>
        </div>
      </div>

      {/* --- CONTINUE BUTTON --- */}
      <div className="max-w-lg mx-auto w-full px-6 mt-8 mb-12">
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold py-6 text-lg"
          onClick={() => router.push("/learn")}
          disabled={isPending}
        >
          {isPending ? "Zapisywanie..." : "Kontynuuj"}
        </Button>
      </div>
    </div>
  );
};
