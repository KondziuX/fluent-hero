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

/**
 * Normalizes a string for comparison: lowercases, removes punctuation,
 * normalizes apostrophes (both ’ and ' → '), and collapses multiple spaces.
 */
function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if the user's answer matches any of the accepted answers.
 */
function isAnswerCorrect(userAnswer: string, acceptedAnswers: string[]): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  return acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalizedUser);
}

export const DialogLesson = ({ lessonId }: DialogLessonProps) => {
  const router = useRouter();
  const dialogs = LESSON_6_DIALOGS;

  // Current dialog index
  const [dialogIndex, setDialogIndex] = useState(0);
  // Current turn index within the current dialog
  const [turnIndex, setTurnIndex] = useState(0);
  // All conversation bubbles so far (for the current dialog only)
  const [bubbles, setBubbles] = useState<{ speaker: "system" | "user"; text: string }[]>([]);
  // Input state
  const [inputValue, setInputValue] = useState("");
  // Feedback state: null = no feedback, "correct" = correct, "wrong" = wrong
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  // Hint state
  const [showHint, setShowHint] = useState(false);
  // Whether hint was used for the current user turn
  const [hintUsed, setHintUsed] = useState(false);
  // Completion state
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Stats tracking
  const [completedDialogs, setCompletedDialogs] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // Session timing
  const [startTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Ref for auto-scrolling to bottom
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Ref to prevent double evaluation
  const isEvaluatingRef = useRef(false);
  // Ref to track if we're currently processing a system turn auto-advance
  const isProcessingSystemRef = useRef(false);
  // Ref to track if the initial mount system bubble has been added
  const initialBubbleAddedRef = useRef(false);

  const currentDialog: Dialog | undefined = dialogs[dialogIndex];
  const currentTurn: DialogTurn | undefined =
    currentDialog && turnIndex < currentDialog.turns.length
      ? currentDialog.turns[turnIndex]
      : undefined;

  // Total number of user turns across all dialogs
  const totalUserTurns = dialogs.reduce(
    (sum, d) => sum + d.turns.filter((t) => t.speaker === "user").length,
    0
  );
  // Count of user turns completed so far (across previous dialogs)
  const completedUserTurns = dialogs
    .slice(0, dialogIndex)
    .reduce((sum, d) => sum + d.turns.filter((t) => t.speaker === "user").length, 0);

  // Auto-scroll to bottom when bubbles change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bubbles]);

  // Reset state when moving to a new dialog
  useEffect(() => {
    setShowHint(false);
    setHintUsed(false);
    setFeedback(null);
    setInputValue("");
    initialBubbleAddedRef.current = false;
    isProcessingSystemRef.current = false;
  }, [dialogIndex]);

  // Process system turns: add bubble and auto-advance
  useEffect(() => {
    // Guard: no current turn, or not a system turn, or already processing
    if (!currentTurn || currentTurn.speaker !== "system" || !currentTurn.text) return;
    if (isProcessingSystemRef.current) return;

    isProcessingSystemRef.current = true;

    // Add the system bubble
    setBubbles((prev) => [...prev, { speaker: "system", text: currentTurn.text! }]);

    // Check if this is the last turn of the dialog
    const isLastTurn = turnIndex >= (currentDialog?.turns.length ?? 0) - 1;

    if (isLastTurn) {
      // Dialog ends on a system turn → move to next dialog or finish
      const timer = setTimeout(() => {
        const newCompletedDialogs = completedDialogs + 1;
        setCompletedDialogs(newCompletedDialogs);

        if (dialogIndex >= dialogs.length - 1) {
          // All dialogs completed
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
          // Move to next dialog
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
      // Not the last turn → advance to next turn
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

    // Check if we've reached the end of the dialog
    if (!currentDialog || nextTurnIndex >= currentDialog.turns.length) {
      // Dialog completed
      const newCompletedDialogs = completedDialogs + 1;
      setCompletedDialogs(newCompletedDialogs);

      if (dialogIndex >= dialogs.length - 1) {
        // All dialogs completed
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
        // Move to next dialog
        setDialogIndex((prev) => prev + 1);
        setTurnIndex(0);
        setBubbles([]);
      }
    } else {
      // Move to next turn within the same dialog
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
      // Add user bubble
      setBubbles((prev) => [...prev, { speaker: "user", text: answer }]);
      setCorrectAnswers((prev) => prev + 1);

      // XP: full XP if no hint was used
      if (!hintUsed) {
        setXpEarned((prev) => prev + 10);
      }

      // Advance to next turn after a brief delay
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Brak dialogów</h1>
        <Button onClick={() => router.push("/learn")} className="mt-4">
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* --- GRADIENT HEADER --- */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white px-6 pt-8 pb-16 rounded-b-[2rem] shadow-lg">
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
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/learn")}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Przerwij sesję
          </button>
          <span className="text-sm font-semibold text-slate-700">
            {currentDialog.title}
          </span>
          <div className="w-16" />
        </div>

        <div className="mt-3">
          <Progress value={progressPercent} className="h-2 bg-slate-200" />
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
                    ? "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                    : "bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-br-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{bubble.text}</p>
              </div>
            </div>
          ))}

          {/* Feedback message */}
          {feedback === "wrong" && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4" />
                <span>Niepoprawna odpowiedź. Spróbuj ponownie.</span>
              </div>
            </div>
          )}

          {isFeedbackCorrect && (
            <div className="flex justify-center">
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Poprawnie!</span>
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && currentTurn?.hint && (
            <div className="flex justify-center">
              <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4" />
                <span>{currentTurn.hint}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* --- INPUT AREA (only for user turns) --- */}
        {isUserTurn && !isFeedbackCorrect && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-8 space-y-3">
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
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
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
                className="text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                <Lightbulb className="h-4 w-4 mr-1" />
                Pokaż podpowiedź
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="text-slate-500 border-slate-300 hover:bg-slate-50"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Pomiń
              </Button>
            </div>
          </div>
        )}

        {/* Spacer when waiting for system or showing correct feedback */}
        {(!isUserTurn || isFeedbackCorrect) && (
          <div className="h-32" />
        )}
      </div>
    </div>
  );
};
