"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  label: string;
  iconSrc: string; // Na razie użyjemy ścieżek do obrazków, nawet jak ich nie ma (obsłużymy to)
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
      variant={active ? "sidebarOutline" : "sidebar"}
      className="justify-start h-[52px]"
      asChild
    >
      <Link href={href}>
        {/* Tymczasowo, jeśli nie masz ikonek, wyświetlimy sam tekst lub placeholder */}
        {/* <Image src={iconSrc} alt={label} className="mr-5" height={32} width={32} /> */}
        <span className="mr-5 text-xl">
            {/* Prosty hack: mapowanie nazwy na emoji dla MVP */}
            {label === "Nauka" && "🏠"}
            {label === "Ranking" && "🏆"}
            {label === "Zadania" && "🎯"}
            {label === "Sklep" && "🛍️"}
        </span>
        
        {label}
      </Link>
    </Button>
  );
};