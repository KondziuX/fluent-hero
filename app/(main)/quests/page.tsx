import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Progress } from "@/components/ui/progress"; // Będziemy potrzebować tego komponentu!
import { QUESTS } from "@/lib/quests";

export default async function QuestsPage() {
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.xp}
          hasActiveSubscription={false}
          lastHeartRefill={userProgress.lastHeartRefill}
        />
      </StickyWrapper>
      
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/quests.svg" // Upewnij się, że masz ten plik w /public
            alt="Quests"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Zadania
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Wykonuj zadania, by zdobywać punkty!
          </p>
          
          <ul className="w-full">
            {QUESTS.map((quest) => {
              const progress = (userProgress.xp / quest.value) * 100;
              // Zabezpieczenie, żeby pasek nie wyszedł poza 100%
              const normalizedProgress = Math.min(progress, 100); 

              return (
                <div
                  className="flex items-center w-full p-4 gap-x-4 border-t-2"
                  key={quest.title}
                >
                  {/* Ikona celu/strzały */}
                  <div className="text-4xl">🎯</div> 

                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-neutral-700 text-xl font-bold">
                      {quest.title}
                    </p>
                    
                    <Progress value={normalizedProgress} className="h-3" />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
}