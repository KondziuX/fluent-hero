"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Zap, MessageSquare, CheckCircle2, Lightbulb, SkipForward } from "lucide-react";

interface DialogSummaryProps {
  totalDialogs: number;
  completedDialogs: number;
  correctAnswers: number;
  hintsUsed: number;
  skippedCount: number;
  xpEarned: number;
  durationSeconds: number;
  isPending: boolean;
}

export const DialogSummary = ({
  totalDialogs,
  completedDialogs,
  correctAnswers,
  hintsUsed,
  skippedCount,
  xpEarned,
  durationSeconds,
  isPending,
}: DialogSummaryProps) => {
  const router = useRouter();

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
          <h1 className="text-3xl font-bold mb-2">Boss fight ukończony!</h1>
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

        {/* Completed dialogs */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#EDE9FE] p-3 rounded-full">
            <MessageSquare className="h-6 w-6 text-[#7C3AED]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Ukończone dialogi</p>
            <p className="text-2xl font-bold text-[#7C3AED]">
              {completedDialogs} / {totalDialogs}
            </p>
          </div>
        </div>

        {/* Correct answers */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#DCFCE7] p-3 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-[#16A34A]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Poprawne odpowiedzi</p>
            <p className="text-2xl font-bold text-[#16A34A]">{correctAnswers}</p>
          </div>
        </div>

        {/* Hints used */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#FEF3C7] p-3 rounded-full">
            <Lightbulb className="h-6 w-6 text-[#F59E0B]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Użyte podpowiedzi</p>
            <p className="text-2xl font-bold text-[#D97706]">{hintsUsed}</p>
          </div>
        </div>

        {/* Skipped */}
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-5 flex items-center gap-4">
          <div className="bg-[#E0F2FE] p-3 rounded-full">
            <SkipForward className="h-6 w-6 text-[#2563EB]" />
          </div>
          <div>
            <p className="label-text text-[#64748B]">Pominięte</p>
            <p className="text-2xl font-bold text-[#2563EB]">{skippedCount}</p>
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
