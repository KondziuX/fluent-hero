import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { env } from './env';

// Pobiera użytkownika lub przekierowuje do logowania
export const requireUser = async () => {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }
  return user;
};

// Sprawdza czy dany email jest na liście adminów
export const isAdmin = (email?: string | null) => {
  if (!email) return false;
  // Pobieramy listę z env i dzielimy po przecinku
  const adminEmails = env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
};

// Blokada dla stron admina - wyrzuca zwykłych userów
export const requireAdmin = async () => {
  const user = await requireUser();
  const email = user.emailAddresses[0]?.emailAddress;

  if (!isAdmin(email)) {
    redirect('/'); // Zwykły user wylatuje na stronę główną
  }

  return user;
};