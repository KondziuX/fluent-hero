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
      className="h-16 w-16 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#94A3B8]"
      onClick={handleClick}
      type="button"
    >
      {type === "hearts" ? "💔" : "🔒"}
    </Button>
  );
};
