"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { courses } from "@/db/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Zap } from "lucide-react"; // <--- Import ikon kodu

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
  lastHeartRefill?: Date | null;
};

export const UserProgress = ({
  activeCourse,
  points,
  hearts,
  hasActiveSubscription,
  lastHeartRefill,
}: Props) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Jeśli mamy full serc LUB brak daty odnowienia -> nie liczymy
    if (hearts >= 5 || !lastHeartRefill) {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const lastRefillTime = new Date(lastHeartRefill).getTime();
      const nextHeartAt = lastRefillTime + (3 * 60 * 1000); 
      const distance = nextHeartAt - now;

      if (distance < 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
        router.refresh(); // Odśwież stronę, gdy czas minie
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [hearts, lastHeartRefill, router]);

  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <Link href="/courses">
        <Button variant="ghost">
          {/* Używamy standardowego obrazka flagi lub emotki */}
          <span className="mr-2 text-xl">🇬🇧</span> 
          {activeCourse.title}
        </Button>
      </Link>

      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          {/* Ikona Pioruna z Lucide */}
          <Zap className="h-5 w-5 mr-2 fill-current" />
          {points}
        </Button>
      </Link>

      <Link href="/shop">
        <Button 
          variant="ghost" 
          className="text-rose-500 group relative"
        >
          {/* Ikona Serca z Lucide - skaluje się idealnie */}
          <Heart className="h-5 w-5 mr-2 fill-current" />
          
          {hasActiveSubscription ? "∞" : hearts}

          {!hasActiveSubscription && hearts < 5 && timeLeft && (
            <div className="absolute top-12 right-0 bg-slate-800 text-white text-xs rounded-md py-2 px-3 z-50 hidden group-hover:flex whitespace-nowrap shadow-lg border border-slate-700">
               +1 ❤️ za: <span className="font-mono ml-1">{timeLeft}</span>
            </div>
          )}
        </Button>
      </Link>
    </div>
  );
};