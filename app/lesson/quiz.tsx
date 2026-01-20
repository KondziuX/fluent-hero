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

  // --- STATYSTYKI LEKCJI ---
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [hasFailed, setHasFailed] = useState(false); // Czy w obecnym pytaniu był błąd?
  const [isCompleted, setIsCompleted] = useState(false); // Czy lekcja zakończona?

  const challenge = initialLessonChallenges[activeIndex];
  
  // Zamiast useMemo używamy State, żeby "zamrozić" odpowiedzi
  const [options, setOptions] = useState<Challenge["challengeOptions"]>([]);

  // Inicjalizacja czasu startu
  useEffect(() => {
    setStartTime(new Date());
  }, []);

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
    // Jeśli to ostatnie pytanie -> koniec lekcji (Pokaż podsumowanie)
    if (activeIndex === initialLessonChallenges.length - 1) {
       setEndTime(new Date());
       setIsCompleted(true);
       return;
    }
    
    // Resetujemy stan i idziemy do następnego
    setActiveIndex((current) => current + 1);
    setSelectedOption(undefined);
    setStatus("none");
    setHasFailed(false); // Resetujemy flagę błędu dla nowego pytania
  };

  // 3. Funkcja sprawdzania odpowiedzi
  const onCheck = () => {
    if (!selectedOption) return;

    const correctOption = options.find((option) => option.isCorrect);

    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
        // Jeśli nie było błędu wcześniej w tym pytaniu -> zaliczamy do poprawnych (do statystyk)
        if (!hasFailed) {
            setCorrectAnswers((prev) => prev + 1);
        }

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
        setHasFailed(true); // Oznaczamy, że użytkownik się pomylił w tym pytaniu

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

  // --- EKRAN PODSUMOWANIA ---
  if (isCompleted) {
    const duration = (endTime && startTime) ? endTime.getTime() - startTime.getTime() : 0;
    const minutes = Math.floor(duration / 1000 / 60);
    const seconds = Math.floor((duration / 1000) % 60);
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // XP: Serwer daje 10 XP za każde ukończone wyzwanie (niezależnie od błędów)
    const xp = initialLessonChallenges.length * 10;

    // Dokładność: Procent poprawnych odpowiedzi (za pierwszym razem)
    const accuracy = Math.round((correctAnswers / initialLessonChallenges.length) * 100);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 max-w-lg mx-auto w-full animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-y-4 mb-4">
                <div className="bg-green-500 p-4 rounded-full animate-bounce">
                    <Trophy className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-center animate-in zoom-in duration-700">
                    Lekcja ukończona!
                </h1>
                <p className="text-slate-500 text-center text-lg">
                    Świetna robota! Oto Twoje wyniki.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 border-2 border-orange-400 bg-orange-50 rounded-xl flex flex-col items-center gap-2">
                    <Trophy className="h-6 w-6 text-orange-500" />
                    <div className="font-bold text-2xl text-orange-600">+{xp}</div>
                    <div className="text-xs text-orange-500 uppercase font-bold">XP</div>
                </div>
                <div className="p-4 border-2 border-green-400 bg-green-50 rounded-xl flex flex-col items-center gap-2">
                    <Target className="h-6 w-6 text-green-500" />
                    <div className="font-bold text-2xl text-green-600">{accuracy}%</div>
                    <div className="text-xs text-green-500 uppercase font-bold">Dokładność</div>
                </div>
                <div className="col-span-2 p-4 border-2 border-sky-400 bg-sky-50 rounded-xl flex flex-col items-center gap-2">
                    <Clock className="h-6 w-6 text-sky-500" />
                    <div className="font-bold text-2xl text-sky-600">{formattedTime}</div>
                    <div className="text-xs text-sky-500 uppercase font-bold">Czas</div>
                </div>
            </div>

            <div className="w-full mt-8">
                 <Button
                    size="lg"
                    className="w-full"
                    onClick={() => router.push("/learn")}
                 >
                    Kontynuuj
                 </Button>
            </div>
        </div>
    );
  }

  // --- EKRAN ZABEZPIECZAJĄCY (Brak pytania) ---
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

  // --- WIDOK GŁÓWNY (PYTANIE) ---
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
