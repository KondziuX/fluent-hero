import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fluent-Hero',
  description: 'PWA do nauki angielskiego',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pl">
        <body className={inter.className}>
          {children}
          <Toaster /> {/* <--- Tutaj! */}
        </body>
      </html>
    </ClerkProvider>
  );
}