"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { courses } from "@/db/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Zap } from "lucide-react";

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
        router.refresh();
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [hearts, lastHeartRefill, router]);

  return (
    <div className="flex items-center justify-between gap-x-2 w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-3">
      <Link href="/courses">
        <Button variant="ghost" className="h-[48px] min-h-[48px]">
          <span className="mr-2 text-xl">🇬🇧</span> 
          <span className="text-[#111827] font-bold">{activeCourse.title}</span>
        </Button>
      </Link>

      <Link href="/shop">
        <Button variant="ghost" className="h-[48px] min-h-[48px] text-[#F59E0B]">
          <Zap className="h-5 w-5 mr-1 fill-current text-[#F59E0B]" />
          <span className="font-bold">{points}</span>
        </Button>
      </Link>

      <Link href="/shop">
        <Button 
          variant="ghost" 
          className="h-[48px] min-h-[48px] text-[#E11D48] group relative"
        >
          <Heart className="h-5 w-5 mr-1 fill-current text-[#E11D48]" />
          
          {hasActiveSubscription ? "∞" : hearts}

          {!hasActiveSubscription && hearts < 5 && timeLeft && (
            <div className="absolute top-12 right-0 bg-white text-[#111827] text-xs rounded-xl py-2 px-3 z-50 hidden group-hover:flex whitespace-nowrap shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-[#E2E8F0]">
               +1 ❤️ za: <span className="font-mono ml-1">{timeLeft}</span>
            </div>
          )}
        </Button>
      </Link>
    </div>
  );
};