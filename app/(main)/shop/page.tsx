import { FeedWrapper } from "@/components/feed-wrapper";
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
    <div className="flex flex-row-reverse gap-[48px] px-0">
      <FeedWrapper>
        <div className="w-full flex flex-col items-center px-4">
          <Image
            src="/shop.svg"
            alt="Shop"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-[#111827] text-2xl my-6">
            Sklep
          </h1>
          <p className="text-[#64748B] text-center text-base mb-6">
            Wydawaj punkty na fajne rzeczy!
          </p>
          
          <div className="bg-white p-4 w-full rounded-[24px] shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0]">
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