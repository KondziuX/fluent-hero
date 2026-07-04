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

  const trainedCount = totalCards;
  const knownPercent = trainedCount > 0 ? Math.round((knownCount / trainedCount) * 100) : 0;
  const learningPercent = trainedCount > 0 ? Math.round((learningCount / trainedCount) * 100) : 0;
  const hardPercent = trainedCount > 0 ? Math.round((hardCount / trainedCount) * 100) : 0;

  const xpEarned = knownCount * 10;

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FC]">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#2563EB] text-white px-6 pt-12 pb-16 rounded-b-[2rem] shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
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
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#FEF3C7] p-3 rounded-full">
            <Zap className="h-6 w-6 text-[#F59E0B] fill-current" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Zdobyte XP</p>
            <p className="text-2xl font-bold text-[#D97706]">+{xpEarned}</p>
          </div>
        </div>

        {/* Trained cards */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#EDE9FE] p-3 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-[#7C3AED]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Przetrenowane fiszki</p>
            <p className="text-2xl font-bold text-[#7C3AED]">
              {trainedCount} / {totalCards}
            </p>
          </div>
        </div>

        {/* Known cards */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#DCFCE7] p-3 rounded-full">
            <Trophy className="h-6 w-6 text-[#16A34A]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Opanowane</p>
            <p className="text-2xl font-bold text-[#16A34A]">
              {knownCount} ({knownPercent}%)
            </p>
          </div>
        </div>

        {/* Learning cards */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#FEF3C7] p-3 rounded-full">
            <BookOpen className="h-6 w-6 text-[#F59E0B]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Do nauki</p>
            <p className="text-2xl font-bold text-[#D97706]">
              {learningCount} ({learningPercent}%)
            </p>
          </div>
        </div>

        {/* Hard cards */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#FEE2E2] p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-[#E11D48]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Trudne</p>
            <p className="text-2xl font-bold text-[#E11D48]">
              {hardCount} ({hardPercent}%)
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#F1F5F9] p-3 rounded-full">
            <Clock className="h-6 w-6 text-[#64748B]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Czas trwania</p>
            <p className="text-2xl font-bold text-[#475569]">{formattedTime}</p>
          </div>
        </div>
      </div>

      {/* --- CONTINUE BUTTON --- */}
      <div className="max-w-lg mx-auto w-full px-6 mt-8 mb-12">
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] text-white font-bold py-6 text-lg rounded-full"
          onClick={() => router.push("/learn")}
          disabled={isPending}
        >
          {isPending ? "Zapisywanie..." : "Kontynuuj"}
        </Button>
      </div>
    </div>
  );
};
