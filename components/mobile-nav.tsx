"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Repeat,
  Target,
  User,
} from "lucide-react";

const navItems = [
  {
    label: "Nauka",
    href: "/learn",
    icon: BookOpen,
  },
  {
    label: "Powtórki",
    href: "/reviews",
    icon: Repeat,
  },
  {
    label: "Misje",
    href: "/quests",
    icon: Target,
  },
  {
    label: "Profil",
    href: "/profile",
    icon: User,
  },
];

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] lg:hidden"
      aria-label="Nawigacja mobilna"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5",
                "min-w-[48px] min-h-[48px] h-[56px]",
                "px-3 py-1 rounded-lg transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2",
                isActive
                  ? "text-[#7C3AED]"
                  : "text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive && "fill-current"
                )}
              />
              <span className="text-[10px] font-semibold leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
