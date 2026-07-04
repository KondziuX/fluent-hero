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
    <main className="min-h-screen bg-[#F6F8FC] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-5 blur-[120px]"></div>
      <div className="absolute right-0 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-[#2563EB] opacity-5 blur-[100px]"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 font-bold text-xl tracking-tight text-[#111827]">
          <div className="bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] p-1.5 rounded-lg shadow-sm">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span>Fluent-Hero</span>
        </div>
        <SignInButton mode="modal" forceRedirectUrl="/learn">
          <Button variant="ghost" className="text-[#475569] hover:text-[#111827] hover:bg-[#F1F5F9] transition-colors duration-200">
            Zaloguj się
          </Button>
        </SignInButton>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-5xl mx-auto pt-20 animate-fade-in-up">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111827] mb-6">
          Opanuj dowolny język. Szybko.
        </h1>

        {/* Subtext */}
        <p className="text-base md:text-lg text-[#475569] max-w-2xl mx-auto mb-10 leading-relaxed">
          Kompleksowa platforma do nauki. Śledź postępy, rywalizuj w rankingach i realizuj codzienne cele w jednym miejscu.
        </p>

        {/* CTA */}
        <SignInButton mode="modal" forceRedirectUrl="/learn">
          <Button size="lg" className="bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] text-white font-semibold px-8 h-14 text-lg rounded-full shadow-sm transition-all duration-300 hover:opacity-90 hover:scale-105">
            Rozpocznij naukę
          </Button>
        </SignInButton>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 w-full text-center text-[#94A3B8] text-sm z-10">
        &copy; {new Date().getFullYear()} Fluent-Hero. Wszelkie prawa zastrzeżone.
      </footer>
    </main>
  );
}
