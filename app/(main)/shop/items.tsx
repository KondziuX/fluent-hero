"use client";

import { refillHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner"; // Używamy powiadomień

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
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        {/* Ikonka serca - jeśli nie masz pliku heart.svg, użyj emoji ❤️ */}
        <div className="text-4xl">❤️</div>
        
        <div className="flex-1">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Odnów serca
          </p>
        </div>
        
        <Button
          onClick={onRefillHearts}
          disabled={pending || hearts === 5 || points < 50}
        >
          {hearts === 5 ? (
            "Pełne"
          ) : (
            <div className="flex items-center">
              <span className="mr-2">⚡</span> {/* Ikonka pioruna/XP */}
              <p>50</p>
            </div>
          )}
        </Button>
      </div>
    </ul>
  );
};