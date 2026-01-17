import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/learn');
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 overflow-hidden selection:bg-indigo-500/30">
      {/* Background Gradients/Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center max-w-3xl px-6 animate-fade-in-up">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-sm text-slate-400 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          Language Mastery Awaits
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 drop-shadow-sm">
          Witaj w Fluent-Hero
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Opanuj języki obce efektywnie. Zarządzaj postępami, wyzwaniami i codzienną passą w jednym miejscu.
        </p>

        {/* CTA Button */}
        <SignInButton mode="modal" forceRedirectUrl="/learn">
          <Button
            size="lg"
            className="bg-white text-slate-950 hover:bg-slate-200 font-semibold px-8 h-12 rounded-lg shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] transition-all duration-300"
          >
            Rozpocznij naukę
          </Button>
        </SignInButton>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-slate-600 text-sm z-10">
        &copy; {new Date().getFullYear()} Fluent-Hero. All rights reserved.
      </footer>
    </main>
  );
}
