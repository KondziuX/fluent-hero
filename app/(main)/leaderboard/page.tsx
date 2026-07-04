import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
  const userProgressData = getUserProgress();
  const topTenUsersData = getTopTenUsers();

  const [
    userProgress,
    topTenUsers,
  ] = await Promise.all([
    userProgressData,
    topTenUsersData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-0">
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
        <div className="w-full flex flex-col items-center px-4">
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-[#111827] text-2xl my-6">
            Ranking
          </h1>
          <p className="text-[#64748B] text-center text-base mb-6">
            Zobacz, jak wypadasz na tle innych!
          </p>
          
          {/* Tabela Rankingu */}
          <div className="w-full rounded-[24px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-[#E2E8F0] space-y-4">
             {topTenUsers.map((user, index) => (
                <div 
                  key={user.userId}
                  className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-[#F8FAFC] transition"
                >
                  {/* Pozycja w rankingu */}
                  <p className="font-bold text-[#7C3AED] mr-4 text-xl min-w-[28px]">
                    {index + 1}
                  </p>
                  
                  {/* Awatar Użytkownika */}
                  <div className="ml-2 mr-4 h-12 w-12 rounded-full overflow-hidden border-2 border-[#E2E8F0] shrink-0">
                     <img
                        src={user.userImage}
                        alt={user.userName}
                        className="object-cover w-full h-full"
                     />
                  </div>

                  {/* Imię */}
                  <p className="font-bold text-[#111827] flex-1 text-base truncate">
                     {user.userName}
                  </p>
                  
                  {/* Punkty XP */}
                  <p className="text-[#64748B] font-bold text-sm shrink-0">
                     {user.xp} XP
                  </p>
                </div>
             ))}
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
}