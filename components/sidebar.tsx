"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { ClerkLoading, ClerkLoaded, UserButton, useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const { user } = useUser();

  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
      className
    )}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <div className="bg-green-600 h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold">
            FH
          </div>
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            FluentHero
          </h1>
        </div>
      </Link>
      
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Nauka" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem label="Ranking" href="/leaderboard" iconSrc="/leaderboard.svg" />
        <SidebarItem label="Zadania" href="/quests" iconSrc="/quests.svg" />
        <SidebarItem label="Sklep" href="/shop" iconSrc="/shop.svg" />
      </div>

      {/* ZMIANA 1: Zmniejszony padding (pb-6), żeby panel był na dole, ale nie przyklejony do krawędzi */}
      <div className="p-4 pb-6 border-t-2 border-slate-100">
        <ClerkLoading>
          <div className="flex items-center justify-center w-full">
             <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </div>
        </ClerkLoading>
        
        <ClerkLoaded>
          <div className="flex items-center gap-x-4">
            
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  // ZMIANA 2: Utrzymujemy duży rozmiar awatara (64px)
                  userButtonAvatarBox: "h-[64px] w-[64px]", 
                  userButtonTrigger: "h-[64px] w-[64px] focus:shadow-none",
                }
              }}
            />

            <div className="flex flex-col pl-2">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Witaj,
              </p>
              {/* ZMIANA 3: Przywrócony mniejszy, standardowy rozmiar tekstu */}
              <p className="text-sm font-extrabold text-neutral-700 truncate max-w-[120px]">
                {user?.firstName || "Użytkowniku"}
              </p>
            </div>

          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
};