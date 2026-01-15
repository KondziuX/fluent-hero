import { z } from 'zod';

const envSchema = z.object({
  // Baza danych (Neon)
  DATABASE_URL: z.string().url(),

  // Clerk Auth (Tutaj była różnica w nazwie!)
  CLERK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),

  // Admini
  ADMIN_EMAILS: z.string().optional(),
});

// Parsujemy process.env
export const env = envSchema.parse(process.env);