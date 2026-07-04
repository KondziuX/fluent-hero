"use client";

import { cn } from "@/lib/utils";
import { Heart, Zap, Flame } from "lucide-react";
import Link from "next/link";

type Props = {
  courseTitle: string;
  hearts: number;
  xp: number;
  streak?: number;
  hasActiveSubscription?: boolean;
  className?: string;
};

export const StatusBar = ({
  courseTitle,
  hearts,
  xp,
  streak = 0,
  hasActiveSubscription = false,
  className,
}: Props) => {
  return (
    <div className={cn(
      "flex items-center justify-between gap-x-1 w-full bg-white border-b border-[#E2E8F0] px-4 py-2.5 lg:px-6",
      className
    )}>
      {/* Course / Language — po lewej */}
      <Link
        href="/learn"
        className="flex items-center gap-1.5 min-w-[48px] min-h-[48px] px-2 rounded-lg hover:bg-[#F1F5F9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
      >
        <span className="text-lg" role="img" aria-label="Flaga">
          🇬🇧
        </span>
        <span className="text-sm font-bold text-[#111827]">
          {courseTitle}
        </span>
      </Link>

      {/* Stats row — po prawej */}
      <div className="flex items-center gap-x-1 sm:gap-x-2">
        {/* Streak */}
        <div className="flex items-center gap-1 min-h-[48px] px-2 rounded-lg text-[#F59E0B]">
          <Flame className="w-5 h-5 fill-current text-[#F59E0B]" />
          <span className="text-sm font-bold">{streak}</span>
        </div>

        {/* XP */}
        <Link
          href="/shop"
          className="flex items-center gap-1 min-h-[48px] px-2 rounded-lg text-[#F59E0B] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
        >
          <Zap className="w-5 h-5 fill-current text-[#F59E0B]" />
          <span className="text-sm font-bold">{xp}</span>
        </Link>

        {/* Coins — placeholder only, no logic */}
        <div className="flex items-center gap-1 min-h-[48px] px-2 rounded-lg text-[#F59E0B]">
          <span className="text-base" role="img" aria-label="Monety">
            🪙
          </span>
          <span className="text-sm font-bold">0</span>
        </div>

        {/* Hearts */}
        <Link
          href="/shop"
          className="flex items-center gap-1 min-h-[48px] px-2 rounded-lg text-[#E11D48] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
        >
          <Heart className="w-5 h-5 fill-current text-[#E11D48]" />
          <span className="text-sm font-bold">
            {hasActiveSubscription ? "∞" : hearts}
          </span>
        </Link>
      </div>
    </div>
  );
};
