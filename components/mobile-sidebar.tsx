import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { Menu } from "lucide-react";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white w-6 h-6 hover:text-indigo-400 transition" />
      </SheetTrigger>
      <SheetContent className="p-0 z-[100] bg-slate-950 border-r border-slate-800 w-[256px]" side="left">
        <SheetTitle className="hidden">Menu nawigacji</SheetTitle>
        <Sidebar className="h-full border-none" />
      </SheetContent>
    </Sheet>
  );
};