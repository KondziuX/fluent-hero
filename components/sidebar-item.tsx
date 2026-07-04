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
      variant="sidebar"
      className={`justify-start h-[52px] text-base mb-1 transition-all duration-200 rounded-xl
        ${active 
          ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20" 
          : "text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] border border-transparent"
        }
      `}
      asChild
    >
      <Link href={href}>
        <Image 
            src={iconSrc} 
            alt={label} 
            className="mr-3 opacity-80" 
            height={24} 
            width={24} 
        />
        {label}
      </Link>
    </Button>
  );
};