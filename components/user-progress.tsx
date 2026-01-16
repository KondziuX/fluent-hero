import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { courses } from "@/db/schema";

type Props = {
  activeCourse: typeof courses.$inferSelect; // Typ pobrany prosto z bazy
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const UserProgress = ({
  activeCourse,
  points,
  hearts,
  hasActiveSubscription,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      {/* Przycisk zmiany kursu */}
      <Link href="/courses">
        <Button variant="ghost">
          {/* Tu docelowo będzie flaga kursu, na razie tekst */}
          <span className="mr-2 text-xl">🇬🇧</span> 
          {activeCourse.title}
        </Button>
      </Link>

      {/* Punkty XP */}
      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <span className="mr-2">⚡</span>
          {points}
        </Button>
      </Link>

      {/* Serca */}
      <Link href="/shop">
        <Button variant="ghost" className="text-rose-500">
          <span className="mr-2">❤️</span>
          {hasActiveSubscription ? "∞" : hearts}
        </Button>
      </Link>
    </div>
  );
};