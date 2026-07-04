"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { ClerkLoading, ClerkLoaded, UserButton, useUser } from "@clerk/nextjs";
import { Loader, Zap } from "lucide-react";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  const { user } = useUser();

  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r border-[#E2E8F0] bg-white flex-col z-20",
      className
    )}>
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <div className="bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] p-1.5 rounded-lg shadow-sm">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <h1 className="text-xl font-bold text-[#111827] tracking-wide">
            FluentHero
          </h1>
        </div>
      </Link>
      
      <div className="flex flex-col gap-y-1 flex-1">
        <SidebarItem label="Nauka" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem label="Ranking" href="/leaderboard" iconSrc="/leaderboard.svg" />
        <SidebarItem label="Zadania" href="/quests" iconSrc="/quests.svg" />
        <SidebarItem label="Sklep" href="/shop" iconSrc="/shop.svg" />
      </div>

      <div className="p-4 pb-6 border-t border-[#E2E8F0]">
        <ClerkLoading>
          <div className="flex items-center justify-center w-full">
             <Loader className="h-5 w-5 text-[#64748B] animate-spin" />
          </div>
        </ClerkLoading>
        
        <ClerkLoaded>
          <div className="flex items-center gap-x-4">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-[48px] w-[48px] ring-2 ring-[#E2E8F0]", 
                  userButtonTrigger: "focus:shadow-none",
                }
              }}
            />
            <div className="flex flex-col pl-2">
              <p className="label-text text-[#7C3AED] mb-0.5">
                Witaj
              </p>
              <p className="text-sm font-bold text-[#111827] truncate max-w-[120px]">
                {user?.firstName || "Bohaterze"}
              </p>
            </div>
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
};