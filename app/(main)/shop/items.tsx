"use client";

import { refillHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  hearts,
  points,
  hasActiveSubscription,
}: Props) => {
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < 50) {
      return;
    }

    startTransition(() => {
      refillHearts()
        .then(() => toast.success("Serca odnowione!"))
        .catch(() => toast.error("Coś poszło nie tak"));
    });
  };

  return (
    <ul className="w-full">
      <div className="flex items-center w-full p-4 gap-x-4 border-t border-[#E2E8F0] first:border-t-0">
        <div className="text-4xl shrink-0">❤️</div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[#111827] text-base font-bold">
            Odnów serca
          </p>
        </div>
        
        <Button
          onClick={onRefillHearts}
          disabled={pending || hearts === 5 || points < 50}
          className="shrink-0 rounded-full"
        >
          {hearts === 5 ? (
            "Pełne"
          ) : (
            <div className="flex items-center gap-1">
              <span>⚡</span>
              <p>50</p>
            </div>
          )}
        </Button>
      </div>
    </ul>
  );
};