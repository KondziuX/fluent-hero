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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white px-6 pt-12 pb-16 rounded-b-[2rem] shadow-lg">
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
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-orange-400">
          <div className="bg-orange-100 p-3 rounded-full">
            <Zap className="h-6 w-6 text-orange-500 fill-current" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Zdobyte XP</p>
            <p className="text-2xl font-bold text-orange-600">+{xpEarned}</p>
          </div>
        </div>

        {/* Completed dialogs */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-violet-400">
          <div className="bg-violet-100 p-3 rounded-full">
            <MessageSquare className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Ukończone dialogi</p>
            <p className="text-2xl font-bold text-violet-700">
              {completedDialogs} / {totalDialogs}
            </p>
          </div>
        </div>

        {/* Correct answers */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-green-400">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Poprawne odpowiedzi</p>
            <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
          </div>
        </div>

        {/* Hints used */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-amber-400">
          <div className="bg-amber-100 p-3 rounded-full">
            <Lightbulb className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Użyte podpowiedzi</p>
            <p className="text-2xl font-bold text-amber-600">{hintsUsed}</p>
          </div>
        </div>

        {/* Skipped */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-sky-400">
          <div className="bg-sky-100 p-3 rounded-full">
            <SkipForward className="h-6 w-6 text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Pominięte</p>
            <p className="text-2xl font-bold text-sky-600">{skippedCount}</p>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border-l-4 border-slate-400">
          <div className="bg-slate-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Czas trwania</p>
            <p className="text-2xl font-bold text-slate-600">{formattedTime}</p>
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
