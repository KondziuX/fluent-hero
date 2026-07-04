"use client";

import { useState, useTransition, useEffect } from "react";
import { challengeOptions, challenges } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Check, X, Trophy, Target, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Challenge = typeof challenges.$inferSelect & {
  isCompleted: boolean;
  challengeOptions: (typeof challengeOptions.$inferSelect)[];
};

interface QuizProps {
  initialLessonId: number;
  initialLessonChallenges: Challenge[];
  initialHearts: number;
  initialPercentage: number;
}

export const Quiz = ({
  initialLessonChallenges,
  initialHearts,
}: QuizProps) => {
  const router = useRouter();
  const [hearts, setHearts] = useState(initialHearts);
  const [pending, startTransition] = useTransition();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const [status, setStatus] = useState<"none" | "correct" | "wrong">("none");

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const challenge = initialLessonChallenges[activeIndex];
  
  const [options, setOptions] = useState<Challenge["challengeOptions"]>([]);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    if (!challenge) return;
    setOptions([...challenge.challengeOptions].sort(() => Math.random() - 0.5));
  }, [challenge?.id]);

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onNext = () => {
    if (activeIndex === initialLessonChallenges.length - 1) {
       setEndTime(new Date());
       setIsCompleted(true);
       return;
    }
    
    setActiveIndex((current) => current + 1);
    setSelectedOption(undefined);
    setStatus("none");
    setHasFailed(false);
  };

  const onCheck = () => {
    if (!selectedOption) return;

    const correctOption = options.find((option) => option.isCorrect);

    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
        if (!hasFailed) {
            setCorrectAnswers((prev) => prev + 1);
        }

        startTransition(() => {
          upsertChallengeProgress(challenge.id)
            .then(() => {
              setStatus("correct");
            })
            .catch(() => {
              console.error("Błąd zapisu");
            });
        });
    } else {
        setHasFailed(true);

        startTransition(() => {
          reduceHearts(challenge.id)
            .then((response) => {
              if (response?.error === "hearts") {
                toast.error("Straciłeś wszystkie serca!");
                router.push("/learn");
                return;
              }
              
              setStatus("wrong");
              if (!response?.error) {
                 setHearts((prev) => Math.max(prev - 1, 0));
              }
            })
            .catch(() => toast.error("Coś poszło nie tak"));
        });
      }
  };

  // --- SUMMARY SCREEN ---
  if (isCompleted) {
    const duration = (endTime && startTime) ? endTime.getTime() - startTime.getTime() : 0;
    const minutes = Math.floor(duration / 1000 / 60);
    const seconds = Math.floor((duration / 1000) % 60);
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const xp = initialLessonChallenges.length * 10;
    const accuracy = Math.round((correctAnswers / initialLessonChallenges.length) * 100);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 max-w-lg mx-auto w-full bg-[#F6F8FC]">
            <div className="flex flex-col items-center gap-y-4 mb-4">
                <div className="bg-gradient-to-r from-[#16A34A] to-[#15803D] p-4 rounded-full animate-bounce shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                    <Trophy className="h-10 w-10 text-white" />
                </div>
                <h1 className="h1-mobile text-center">
                    Lekcja ukończona!
                </h1>
                <p className="text-[#64748B] text-center text-base">
                    Świetna robota! Oto Twoje wyniki.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.08)] flex flex-col items-center gap-2">
                    <Trophy className="h-6 w-6 text-[#F59E0B]" />
                    <div className="font-bold text-2xl text-[#D97706]">+{xp}</div>
                    <div className="label-text text-[#64748B]">XP</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.08)] flex flex-col items-center gap-2">
                    <Target className="h-6 w-6 text-[#16A34A]" />
                    <div className="font-bold text-2xl text-[#16A34A]">{accuracy}%</div>
                    <div className="label-text text-[#64748B]">Dokładność</div>
                </div>
                <div className="col-span-2 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.08)] flex flex-col items-center gap-2">
                    <Clock className="h-6 w-6 text-[#2563EB]" />
                    <div className="font-bold text-2xl text-[#2563EB]">{formattedTime}</div>
                    <div className="label-text text-[#64748B]">Czas</div>
                </div>
            </div>

            <div className="w-full mt-8">
                 <Button
                    size="lg"
                    className="w-full rounded-full"
                    onClick={() => router.push("/learn")}
                 >
                    Kontynuuj
                 </Button>
            </div>
        </div>
    );
  }

  // --- SAFEGUARD ---
  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-2xl font-bold text-[#111827]">Lekcja zakończona!</h1>
        <Button onClick={() => router.push("/learn")} className="mt-4 rounded-full">
          Wróć do mapy
        </Button>
      </div>
    );
  }

  // --- MAIN VIEW ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 max-w-lg mx-auto w-full bg-[#F6F8FC]">
      
      {/* HEADER */}
      <div className="w-full flex justify-between items-center text-[#64748B] mb-4">
        <div className="font-bold text-base">
          Pytanie {activeIndex + 1} / {initialLessonChallenges.length}
        </div>
        <div className="flex items-center gap-2 text-[#E11D48] font-bold text-lg">
           ❤️ {hearts}
        </div>
      </div>

      {/* QUESTION */}
      <h1 className="text-xl md:text-2xl font-bold text-center text-[#111827] mb-6">
        {challenge.prompt}
      </h1>

      {/* OPTIONS */}
      <div className="flex flex-col gap-3 w-full">
        {options.map((option) => {
            const isSelected = selectedOption === option.id;
            let variantClass = "bg-white border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#111827]";
            
            if (isSelected && status === "none") {
                variantClass = "bg-[#EDE9FE] border-[#7C3AED] text-[#7C3AED]";
            } else if (isSelected && status === "correct") {
                variantClass = "bg-[#F0FDF4] border-[#16A34A] text-[#16A34A]";
            } else if (isSelected && status === "wrong") {
                variantClass = "bg-[#FEF2F2] border-[#E11D48] text-[#E11D48]";
            } else if (status === "wrong" && option.isCorrect) {
                 variantClass = "bg-[#F0FDF4] border-[#16A34A] text-[#16A34A] opacity-50";
            }

            return (
              <div
                key={option.id}
                onClick={() => onSelect(option.id)}
                className={`
                  p-4 rounded-2xl cursor-pointer font-bold text-base text-center transition-all
                  ${variantClass}
                `}
              >
                {option.text}
              </div>
            );
        })}
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-lg mx-auto">
          {status === "none" && (
            <Button 
              size="lg" 
              className="w-full rounded-full" 
              onClick={onCheck} 
              disabled={!selectedOption}
            >
              Sprawdź
            </Button>
          )}
          
          {(status === "correct" || status === "wrong") && (
            <Button 
                size="lg" 
                variant={status === "correct" ? "default" : "destructive"}
                className="w-full rounded-full" 
                onClick={() => {
                if (status === "correct") {
                    onNext();
                } else {
                    setStatus("none");
                    setSelectedOption(undefined);
                }
                }}
            >
                {status === "correct" ? "Dalej" : "Spróbuj ponownie"}
            </Button>
            )}
        </div>
      </div>
      
      <div className="h-24"></div>
    </div>
  );
};
