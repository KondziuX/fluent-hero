"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Lightbulb, SkipForward, CheckCircle2, XCircle } from "lucide-react";
import { LESSON_6_DIALOGS } from "@/data/flashcards";
import type { Dialog, DialogTurn } from "@/data/flashcards";
import { saveDialogProgress } from "@/actions/dialog-progress";
import { DialogSummary } from "./dialog-summary";

interface DialogLessonProps {
  lessonId: number;
}

function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isAnswerCorrect(userAnswer: string, acceptedAnswers: string[]): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  return acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalizedUser);
}

export const DialogLesson = ({ lessonId }: DialogLessonProps) => {
  const router = useRouter();
  const dialogs = LESSON_6_DIALOGS;

  const [dialogIndex, setDialogIndex] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [bubbles, setBubbles] = useState<{ speaker: "system" | "user"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [completedDialogs, setCompletedDialogs] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const [startTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const isEvaluatingRef = useRef(false);
  const isProcessingSystemRef = useRef(false);

  const currentDialog: Dialog | undefined = dialogs[dialogIndex];
  const currentTurn: DialogTurn | undefined =
    currentDialog && turnIndex < currentDialog.turns.length
      ? currentDialog.turns[turnIndex]
      : undefined;

  const totalUserTurns = dialogs.reduce(
    (sum, d) => sum + d.turns.filter((t) => t.speaker === "user").length,
    0
  );
  const completedUserTurns = dialogs
    .slice(0, dialogIndex)
    .reduce((sum, d) => sum + d.turns.filter((t) => t.speaker === "user").length, 0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bubbles]);

  useEffect(() => {
    setShowHint(false);
    setHintUsed(false);
    setFeedback(null);
    setInputValue("");
    isProcessingSystemRef.current = false;
  }, [dialogIndex]);

  useEffect(() => {
    if (!currentTurn || currentTurn.speaker !== "system" || !currentTurn.text) return;
    if (isProcessingSystemRef.current) return;

    isProcessingSystemRef.current = true;

    setBubbles((prev) => [...prev, { speaker: "system", text: currentTurn.text! }]);

    const isLastTurn = turnIndex >= (currentDialog?.turns.length ?? 0) - 1;

    if (isLastTurn) {
      const timer = setTimeout(() => {
        const newCompletedDialogs = completedDialogs + 1;
        setCompletedDialogs(newCompletedDialogs);

        if (dialogIndex >= dialogs.length - 1) {
          const now = new Date();
          setEndTime(now);
          setIsCompleted(true);

          setIsPending(true);
          saveDialogProgress({
            lessonId,
            completedDialogs: newCompletedDialogs,
            correctAnswers,
            hintsUsed,
            skippedCount,
            xpEarned,
            durationSeconds: Math.floor((now.getTime() - startTime.getTime()) / 1000),
          }).catch(() => {}).finally(() => setIsPending(false));
        } else {
          setDialogIndex((prev) => prev + 1);
          setTurnIndex(0);
          setBubbles([]);
        }
        isProcessingSystemRef.current = false;
      }, 1200);
      return () => {
        clearTimeout(timer);
        isProcessingSystemRef.current = false;
      };
    } else {
      const timer = setTimeout(() => {
        setTurnIndex((prev) => prev + 1);
        isProcessingSystemRef.current = false;
      }, 800);
      return () => {
        clearTimeout(timer);
        isProcessingSystemRef.current = false;
      };
    }
  }, [
    currentTurn?.speaker,
    currentTurn?.text,
    turnIndex,
    dialogIndex,
    currentDialog,
    completedDialogs,
    correctAnswers,
    hintsUsed,
    skippedCount,
    xpEarned,
    lessonId,
    dialogs.length,
    startTime,
  ]);

  const advanceToNextTurn = useCallback(() => {
    const nextTurnIndex = turnIndex + 1;

    if (!currentDialog || nextTurnIndex >= currentDialog.turns.length) {
      const newCompletedDialogs = completedDialogs + 1;
      setCompletedDialogs(newCompletedDialogs);

      if (dialogIndex >= dialogs.length - 1) {
        const now = new Date();
        setEndTime(now);
        setIsCompleted(true);

        setIsPending(true);
        saveDialogProgress({
          lessonId,
          completedDialogs: newCompletedDialogs,
          correctAnswers,
          hintsUsed,
          skippedCount,
          xpEarned,
          durationSeconds: Math.floor((now.getTime() - startTime.getTime()) / 1000),
        }).catch(() => {}).finally(() => setIsPending(false));
      } else {
        setDialogIndex((prev) => prev + 1);
        setTurnIndex(0);
        setBubbles([]);
      }
    } else {
      setTurnIndex(nextTurnIndex);
    }
  }, [
    turnIndex,
    currentDialog,
    completedDialogs,
    correctAnswers,
    hintsUsed,
    skippedCount,
    xpEarned,
    lessonId,
    dialogIndex,
    dialogs.length,
    startTime,
  ]);

  const handleSubmit = useCallback(() => {
    if (!currentTurn || currentTurn.speaker !== "user" || isEvaluatingRef.current) return;
    const answer = inputValue.trim();
    if (!answer) return;

    isEvaluatingRef.current = true;

    const accepted = currentTurn.acceptedAnswers || [];
    const correct = isAnswerCorrect(answer, accepted);

    if (correct) {
      setFeedback("correct");
      setBubbles((prev) => [...prev, { speaker: "user", text: answer }]);
      setCorrectAnswers((prev) => prev + 1);

      if (!hintUsed) {
        setXpEarned((prev) => prev + 10);
      }

      setTimeout(() => {
        setFeedback(null);
        setShowHint(false);
        setHintUsed(false);
        setInputValue("");
        advanceToNextTurn();
        isEvaluatingRef.current = false;
      }, 1000);
    } else {
      setFeedback("wrong");
      isEvaluatingRef.current = false;
    }
  }, [
    currentTurn,
    inputValue,
    hintUsed,
    advanceToNextTurn,
  ]);

  const handleSkip = useCallback(() => {
    if (!currentTurn || currentTurn.speaker !== "user" || isEvaluatingRef.current) return;
    isEvaluatingRef.current = true;

    const correctAnswer = currentTurn.expected || "(brak odpowiedzi)";
    setBubbles((prev) => [...prev, { speaker: "user", text: correctAnswer }]);
    setSkippedCount((prev) => prev + 1);
    setFeedback("correct");

    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      setHintUsed(false);
      setInputValue("");
      advanceToNextTurn();
      isEvaluatingRef.current = false;
    }, 1000);
  }, [currentTurn, advanceToNextTurn]);

  const handleShowHint = useCallback(() => {
    setShowHint(true);
    setHintUsed(true);
    setHintsUsed((prev) => prev + 1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // --- SUMMARY SCREEN ---
  if (isCompleted && endTime) {
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    return (
      <DialogSummary
        totalDialogs={dialogs.length}
        completedDialogs={completedDialogs}
        correctAnswers={correctAnswers}
        hintsUsed={hintsUsed}
        skippedCount={skippedCount}
        xpEarned={xpEarned}
        durationSeconds={durationSeconds}
        isPending={isPending}
      />
    );
  }

  // --- SAFEGUARD ---
  if (!currentDialog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold text-[#111827]">Brak dialogów</h1>
        <Button onClick={() => router.push("/learn")} className="mt-4 rounded-full">
          Wróć do mapy
        </Button>
      </div>
    );
  }

  const progressPercent =
    totalUserTurns > 0 ? ((completedUserTurns + (feedback === "correct" ? 1 : 0)) / totalUserTurns) * 100 : 0;

  const currentUserTurnIndex =
    completedUserTurns +
    currentDialog.turns.slice(0, turnIndex).filter((t) => t.speaker === "user").length +
    1;

  const isFeedbackCorrect = feedback === "correct";
  const isUserTurn = currentTurn?.speaker === "user";

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
            Boss fight
          </div>

          <h1 className="text-2xl font-bold mb-1">Mini-dialogi końcowe</h1>

          <p className="text-white/80 text-sm">
            Dialog {dialogIndex + 1} z {dialogs.length} &middot; Krok {currentUserTurnIndex} z {totalUserTurns}
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
            {currentDialog.title}
          </span>
          <div className="w-16" />
        </div>

        <div className="mt-3">
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 flex flex-col px-6 max-w-lg mx-auto w-full">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
          {bubbles.map((bubble, idx) => (
            <div
              key={idx}
              className={`flex ${bubble.speaker === "system" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  bubble.speaker === "system"
                    ? "bg-white border border-[#E2E8F0] text-[#111827] rounded-bl-sm"
                    : "bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] text-white rounded-br-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{bubble.text}</p>
              </div>
            </div>
          ))}

          {feedback === "wrong" && (
            <div className="flex justify-center">
              <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#E11D48] rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4" />
                <span>Niepoprawna odpowiedź. Spróbuj ponownie.</span>
              </div>
            </div>
          )}

          {isFeedbackCorrect && (
            <div className="flex justify-center">
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Poprawnie!</span>
              </div>
            </div>
          )}

          {showHint && currentTurn?.hint && (
            <div className="flex justify-center">
              <div className="bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4" />
                <span>{currentTurn.hint}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* --- INPUT AREA (only for user turns) --- */}
        {isUserTurn && !isFeedbackCorrect && (
          <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-4 mb-8 space-y-3">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Wpisz odpowiedź po angielsku..."
                className="flex-1"
                autoFocus
              />
              <Button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowHint}
                disabled={showHint}
                className="text-[#D97706] border-[#FDE68A] hover:bg-[#FFFBEB] rounded-full"
              >
                <Lightbulb className="h-4 w-4 mr-1" />
                Pokaż podpowiedź
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-full"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Pomiń
              </Button>
            </div>
          </div>
        )}

        {(!isUserTurn || isFeedbackCorrect) && (
          <div className="h-32" />
        )}
      </div>
    </div>
  );
};
