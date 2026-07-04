import { FeedWrapper } from "@/components/feed-wrapper";
import { getUserProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { QUESTS } from "@/lib/quests";

export default async function QuestsPage() {
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-0">
      <FeedWrapper>
        <div className="w-full flex flex-col items-center px-4">
          <Image
            src="/quests.svg"
            alt="Quests"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-[#111827] text-2xl my-6">
            Zadania
          </h1>
          <p className="text-[#64748B] text-center text-base mb-6">
            Wykonuj zadania, by zdobywać punkty!
          </p>
          
          <ul className="w-full">
            {QUESTS.map((quest) => {
              const progress = (userProgress.xp / quest.value) * 100;
              const normalizedProgress = Math.min(progress, 100); 

              return (
                <div
                  className="flex items-center w-full p-4 gap-x-4 border-t border-[#E2E8F0] first:border-t-0"
                  key={quest.title}
                >
                  <div className="text-4xl shrink-0">🎯</div> 

                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-[#111827] text-base font-bold">
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