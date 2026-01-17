import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Zap } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/learn");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Spotlight Effect */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full backdrop-blur-sm bg-slate-950/50 border-b border-slate-800/50">
        <div className="flex items-center space-x-2 font-bold text-xl tracking-tight text-white">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span>Fluent-Hero</span>
        </div>
        <SignInButton mode="modal" forceRedirectUrl="/learn">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200">
            Login
          </Button>
        </SignInButton>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-5xl mx-auto pt-20 animate-fade-in-up">
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 drop-shadow-2xl">
          Master any language. Fast.
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide">
          The all-in-one platform for language learning. Track progress, compete in leaderboards, and complete daily quests.
        </p>

        {/* CTA */}
        <SignInButton mode="modal" forceRedirectUrl="/learn">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 h-14 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.6)] hover:scale-105 border border-indigo-500/20">
            Get Started
          </Button>
        </SignInButton>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 w-full text-center text-slate-600 text-sm z-10">
        &copy; {new Date().getFullYear()} Fluent-Hero. All rights reserved.
      </footer>
    </main>
  );
}
