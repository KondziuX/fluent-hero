import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { StatusBar } from "@/components/status-bar";
import { getUserProgress } from "@/db/queries";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  const userProgress = await getUserProgress();

  return (
    <div className="min-h-screen bg-[#F6F8FC] relative">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile bottom navigation — hidden on desktop */}
      <MobileNav />

      {/* Status bar — compact on mobile, full on desktop */}
      {userProgress?.activeCourse && (
        <StatusBar
          courseTitle={userProgress.activeCourse.title}
          hearts={userProgress.hearts}
          xp={userProgress.xp}
          streak={0}
          hasActiveSubscription={false}
          className="lg:pl-[256px]"
        />
      )}

      {/* Main content area */}
      <main className="lg:pl-[256px] h-full pt-0 lg:pt-0 relative z-10">
        <div className="h-full w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-10 max-w-[960px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;