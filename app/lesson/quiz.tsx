"use client";
import { useState, useTransition, useEffect } from "react";
import { challengeOptions, challenges } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react"; // Ikony (opcjonalne)
import { useRouter } from "next/navigation";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { toast } from "sonner";

// Typy danych, które dostajemy z bazy
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
  const [activeIndex, setActiveIndex] = useState(0); // Które pytanie wyświetlamy?
  
  // Stan wybranej odpowiedzi
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const [status, setStatus] = useState<"none" | "correct" | "wrong">("none");

  const challenge = initialLessonChallenges[activeIndex];
  
  // Zamiast useMemo używamy State, żeby "zamrozić" odpowiedzi
  const [options, setOptions] = useState<Challenge["challengeOptions"]>([]);

  useEffect(() => {
    if (!challenge) return;

    // To wykona się TYLKO raz dla danego ID pytania
    // Nawet jak strona się odświeży w tle przez revalidatePath, 
    // ten efekt nie ruszy, bo ID jest to samo.
    setOptions([...challenge.challengeOptions].sort(() => Math.random() - 0.5));
  }, [challenge?.id]);

  // 1. Funkcja wyboru opcji
  const onSelect = (id: number) => {
    if (status !== "none") return; // Blokada zmiany po sprawdzeniu
    setSelectedOption(id);
  };

  // 2. Funkcja przejścia dalej
  const onNext = () => {
    // Jeśli to ostatnie pytanie -> wracamy do mapy (MVP)
    if (activeIndex === initialLessonChallenges.length - 1) {
       router.push("/learn");
       return;
    }
    
    // Resetujemy stan i idziemy do następnego
    setActiveIndex((current) => current + 1);
    setSelectedOption(undefined);
    setStatus("none");
  };

  // 3. Funkcja sprawdzania odpowiedzi
  const onCheck = () => {
    if (!selectedOption) return;

    const correctOption = options.find((option) => option.isCorrect);

    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
        // URUCHAMIAMY ZAPIS DO BAZY
        startTransition(() => {
          upsertChallengeProgress(challenge.id)
            .then(() => {
              setStatus("correct"); // Dopiero jak zapisze, pokazujemy zielone
            })
            .catch(() => {
              // Tu można dodać toast z błędem, na razie tylko log
              console.error("Błąd zapisu");
            });
        });
    } else {
        // BŁĘDNA ODPOWIEDŹ
        startTransition(() => {
          reduceHearts(challenge.id)
            .then((response) => {
              if (response?.error === "hearts") {
                toast.error("Straciłeś wszystkie serca!");
                router.push("/learn"); // Wyrzucamy do menu głównego
                return;
              }
              // ----------------------------------
              
              setStatus("wrong");
              if (!response?.error) {
                 setHearts((prev) => Math.max(prev - 1, 0));
              }
            })
            .catch(() => toast.error("Coś poszło nie tak"));
        });
      }
  };

  // --- EKRAN KOŃCOWY (zabezpieczenie) ---
  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Lekcja zakończona!</h1>
        <Button onClick={() => router.push("/learn")} className="mt-4">
          Wróć do mapy
        </Button>
      </div>
    );
  }

  // --- WIDOK GŁÓWNY ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 max-w-lg mx-auto w-full">
      
      {/* NAGŁÓWEK */}
      <div className="w-full flex justify-between items-center text-slate-500 mb-4">
        <div className="font-bold text-lg">
          Pytanie {activeIndex + 1} / {initialLessonChallenges.length}
        </div>
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xl">
           ❤️ {hearts}
        </div>
      </div>

      {/* PYTANIE */}
      <h1 className="text-2xl font-bold text-center mb-6">
        {challenge.prompt}
      </h1>

      {/* OPCJE ODPOWIEDZI */}
      <div className="flex flex-col gap-3 w-full">
        {options.map((option) => {
            // Logika kolorowania przycisków
            const isSelected = selectedOption === option.id;
            let variantClass = "bg-white border-2 border-slate-200 hover:bg-slate-100";
            
            if (isSelected && status === "none") {
                variantClass = "bg-sky-100 border-sky-400 text-sky-700";
            } else if (isSelected && status === "correct") {
                variantClass = "bg-green-100 border-green-500 text-green-700";
            } else if (isSelected && status === "wrong") {
                variantClass = "bg-rose-100 border-rose-500 text-rose-700";
            } else if (status === "wrong" && option.isCorrect) {
                // Pokazujemy poprawną odpowiedź, gdy user się pomylił
                 variantClass = "bg-green-100 border-green-500 text-green-700 opacity-50";
            }

            return (
              <div
                key={option.id}
                onClick={() => onSelect(option.id)}
                className={`
                  p-4 rounded-xl cursor-pointer font-bold text-lg text-center transition-all
                  ${variantClass}
                `}
              >
                {option.text}
              </div>
            );
        })}
      </div>

      {/* FOOTER (PRZYCISK SPRAWDŹ) */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white border-t footer-area">
        <div className="max-w-lg mx-auto">
          {status === "none" && (
            <Button 
              size="lg" 
              className="w-full" 
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
                className="w-full" 
                onClick={() => {
                if (status === "correct") {
                    onNext(); // Jak dobrze -> idź dalej
                } else {
                    setStatus("none"); // Jak źle -> zresetuj, żeby spróbować jeszcze raz
                    setSelectedOption(undefined);
                }
                }}
            >
                {status === "correct" ? "Dalej" : "Spróbuj ponownie"}
            </Button>
            )}
        </div>
      </div>
      
      {/* Margines na dole, żeby footer nie zasłaniał treści */}
      <div className="h-24"></div>
    </div>
  );
};