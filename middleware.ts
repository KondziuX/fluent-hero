import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Definiujemy trasy publiczne (dostępne bez logowania)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/uploadthing(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/learn', req.url));
  }

  // Standardowa ochrona pozostałych tras
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Blokuj wszystko poza plikami statycznymi (_next, images, css...)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Zawsze uruchamiaj dla tras API
    '/(api|trpc)(.*)',
  ],
};