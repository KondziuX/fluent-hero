import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { Menu } from "lucide-react";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-[#475569] w-6 h-6 hover:text-[#7C3AED] transition" />
      </SheetTrigger>
      <SheetContent className="p-0 z-[100] bg-white border-r border-[#E2E8F0] w-[256px]" side="left">
        <SheetTitle className="hidden">Menu nawigacji</SheetTitle>
        <Sidebar className="h-full border-none" />
      </SheetContent>
    </Sheet>
  );
};