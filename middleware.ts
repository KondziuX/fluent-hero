import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Definiujemy trasy publiczne (dostępne bez logowania)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/uploadthing(.*)' // Zostawiamy furtkę na przyszłość dla obrazków
]);

export default clerkMiddleware(async (auth, req) => {
  // Jeśli trasa NIE jest publiczna, wymagaj logowania
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