"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({
  label,
  iconSrc,
  href,
}: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant="ghost"
      className={`justify-start h-[52px] text-lg mb-1 transition-all duration-200 
        ${active 
          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
        }
      `}
      asChild
    >
      <Link href={href}>
        <Image 
            src={iconSrc} 
            alt={label} 
            className="mr-5 opacity-90" 
            height={32} 
            width={32} 
        />
        {label}
      </Link>
    </Button>
  );
};