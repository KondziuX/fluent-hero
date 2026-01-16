import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      {/* Pasek dla telefonów (ukryty na dużych ekranach wewnątrz komponentu) */}
      <MobileHeader />
      
      {/* Sidebar dla desktopu (ukryty na małych ekranach przez CSS className) */}
      <Sidebar className="hidden lg:flex" />
      
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="h-full max-w-[1056px] mx-auto pt-6">
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayout;