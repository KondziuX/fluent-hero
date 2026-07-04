"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LockedLessonButtonProps {
  type: "hearts" | "previous";
}

export const LockedLessonButton = ({ type }: LockedLessonButtonProps) => {
  const handleClick = () => {
    if (type === "previous") {
      toast.error("Opanuj poprzednią lekcję w 80%", {
        duration: 3000,
      });
    } else if (type === "hearts") {
      toast.error("Brak serc", {
        duration: 3000,
      });
    }
  };

  return (
    <Button
      variant="locked"
      className="h-16 w-16 rounded-full border-b-4 bg-slate-200 border-slate-400 text-slate-500"
      onClick={handleClick}
      type="button"
    >
      {type === "hearts" ? "💔" : "🔒"}
    </Button>
  );
};
