import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
  const userProgressData = getUserProgress();
  const topTenUsersData = getTopTenUsers();

  // Pobieramy dane równolegle (szybciej)
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
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.xp}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/leaderboard.svg" // Upewnij się, że masz ikonkę (lub użyj innej)
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Ranking
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Zobacz, jak wypadasz na tle innych!
          </p>
          
          {/* Tabela Rankingu */}
          <div className="w-full rounded-xl bg-white p-4 shadow-sm border space-y-4">
             {topTenUsers.map((user, index) => (
                <div 
                  key={user.userId}
                  className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-slate-100 transition"
                >
                  {/* Pozycja w rankingu */}
                  <p className="font-bold text-lime-700 mr-4 text-xl">
                    {index + 1}
                  </p>
                  
                  {/* Awatar Użytkownika */}
                  <div className="ml-2 mr-6 h-12 w-12 rounded-full overflow-hidden border-2 border-slate-200">
                     {/* Używamy tagu <img> zamiast <Image>, aby uniknąć problemów z domenami Clerk w next.config */}
                     <img
                        src={user.userImage}
                        alt={user.userName}
                        className="object-cover w-full h-full"
                     />
                  </div>

                  {/* Imię */}
                  <p className="font-bold text-neutral-800 flex-1 text-lg">
                     {user.userName}
                  </p>
                  
                  {/* Punkty XP */}
                  <p className="text-muted-foreground font-bold">
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