import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden selection:bg-indigo-500/30">
      {/* --- TŁO --- */}
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      
      {/* Spotlight Effect */}
      <div className="fixed left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500 opacity-10 blur-[120px]"></div>
      
      {/* --- UI --- */}
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0 relative z-10">
        <div className="h-full max-w-[1056px] mx-auto pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;