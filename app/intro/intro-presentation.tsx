"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle?: string;
  goal?: string;
  count?: string;
  button?: string;
}

const SLIDES: Slide[] = [
  {
    title: "Powitania i pierwszy kontakt",
    subtitle: "Po tym rozdziale rozpoczniesz prostą rozmowę po angielsku.",
  },
  {
    title: "Lekcja 1",
    goal: "Powiesz proste „cześć”",
    count: "5 fiszek",
  },
  {
    title: "Lekcja 2",
    goal: "Dobierzesz powitanie do pory dnia",
    count: "5 fiszek",
  },
  {
    title: "Lekcja 3",
    goal: "Zapytasz „jak się masz?”",
    count: "5 fiszek",
  },
  {
    title: "Lekcja 4",
    goal: "Krótko odpowiesz na pytanie",
    count: "7 fiszek",
  },
  {
    title: "Lekcja 5",
    goal: "Poznasz nową osobę",
    count: "8 fiszek",
  },
  {
    title: "Boss fight",
    goal: "Przećwiczysz krótkie dialogi",
    count: "4 dialogi",
  },
  {
    title: "Gotowy?",
    subtitle: "Zaczynamy od najprostszych powitań.",
    button: "Rozpocznij lekcję 1",
  },
];

interface IntroPresentationProps {
  lessonId: number;
}

export const IntroPresentation = ({ lessonId }: IntroPresentationProps) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSlides = SLIDES.length;

  const goToSlide = useCallback(
    (index: number, dir: "left" | "right") => {
      if (isAnimating) return;
      if (index < 0 || index >= totalSlides) return;

      setDirection(dir);
      setIsAnimating(true);
      setCurrentSlide(index);

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    },
    [isAnimating, totalSlides]
  );

  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1, "right");
    }
  }, [currentSlide, totalSlides, goToSlide]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1, "left");
    }
  }, [currentSlide, goToSlide]);

  const handleStartLesson = useCallback(() => {
    router.push("/lesson/1");
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const slide = SLIDES[currentSlide];
  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#2563EB]">
      {/* --- Progress bar --- */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="h-1.5 bg-white/20 w-full">
          <div
            className="h-full bg-white/70 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* --- Close button --- */}
      <button
        onClick={() => router.push("/learn")}
        className="absolute top-4 right-4 z-20 text-white/60 hover:text-white transition-colors text-sm min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Zamknij prezentację"
      >
        ✕
      </button>

      {/* --- Slide counter --- */}
      <div className="absolute top-4 left-4 z-20 text-white/50 text-sm font-medium">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* --- Main content area --- */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <div
            key={currentSlide}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-10 md:p-14 shadow-2xl border border-white/10"
            style={{
              animation:
                isAnimating && direction === "right"
                  ? "slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) both"
                  : isAnimating && direction === "left"
                  ? "slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) both"
                  : undefined,
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-white text-center mb-4 animate-fade-in-up"
              style={{ animationDelay: "0.1s", animationDuration: "0.6s" }}
            >
              {slide.title}
            </h2>

            {slide.subtitle && (
              <p
                className="text-lg md:text-xl text-white/70 text-center max-w-lg mx-auto animate-fade-in-up"
                style={{ animationDelay: "0.25s", animationDuration: "0.6s" }}
              >
                {slide.subtitle}
              </p>
            )}

            {slide.goal && (
              <div
                className="flex flex-col items-center gap-2 mt-6 animate-fade-in-up"
                style={{ animationDelay: "0.25s", animationDuration: "0.6s" }}
              >
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-2xl">🎯</span>
                  <span className="text-lg md:text-xl">{slide.goal}</span>
                </div>
              </div>
            )}

            {slide.count && (
              <div
                className="flex items-center justify-center gap-2 mt-4 animate-fade-in-up"
                style={{ animationDelay: "0.4s", animationDuration: "0.6s" }}
              >
                <span className="text-white/50 text-sm">📚</span>
                <span className="text-white/60 text-sm font-medium">{slide.count}</span>
              </div>
            )}

            {slide.button && (
              <div
                className="flex justify-center mt-8 animate-fade-in-up"
                style={{ animationDelay: "0.4s", animationDuration: "0.6s" }}
              >
                <Button
                  size="lg"
                  onClick={handleStartLesson}
                  className="bg-white text-[#7C3AED] hover:bg-white/90 font-bold text-lg px-10 py-7 rounded-2xl shadow-xl hover:scale-105 transition-all duration-200"
                >
                  {slide.button}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Bottom navigation --- */}
      <div className="relative z-20 pb-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const dir = index > currentSlide ? "right" : "left";
                goToSlide(index, dir);
              }}
              className={`transition-all duration-300 rounded-full min-w-0 min-h-0 ${
                index === currentSlide
                  ? "w-8 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Przejdź do slajdu ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between px-6 max-w-md mx-auto">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1 text-sm font-medium transition-all min-w-[48px] min-h-[48px] ${
              currentSlide === 0
                ? "text-white/20 cursor-not-allowed"
                : "text-white/70 hover:text-white"
            }`}
            aria-label="Poprzedni slajd"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Wstecz</span>
          </button>

          {currentSlide < totalSlides - 1 && (
            <button
              onClick={goNext}
              className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-all min-w-[48px] min-h-[48px]"
              aria-label="Następny slajd"
            >
              <span>Dalej</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {currentSlide === totalSlides - 1 && (
            <div />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translate3d(60px, 0, 0) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translate3d(-60px, 0, 0) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
