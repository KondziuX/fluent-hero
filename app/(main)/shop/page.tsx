import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Items } from "./items";

export default async function ShopPage() {
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
            src="/shop.svg" // Upewnij się, że masz ten plik lub użyj innego
            alt="Shop"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 dark:text-neutral-200 text-2xl my-6">
            Sklep
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Wydawaj punkty na fajne rzeczy!
          </p>
          
          <div className="bg-white dark:bg-slate-900 p-4 w-full rounded-xl shadow-sm border dark:border-slate-800">
            <Items
                hearts={userProgress.hearts}
                points={userProgress.xp}
                hasActiveSubscription={false}
            />
            </div>
        </div>
      </FeedWrapper>
    </div>
  );
}