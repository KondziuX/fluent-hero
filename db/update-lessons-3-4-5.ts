import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  console.log('🔄 Updating lessons 3, 4 and adding lesson 5...');

  try {
    // === UPDATE LESSON 3 (id=3) ===
    console.log('Updating Lesson 3...');
    await db
      .update(schema.lessons)
      .set({
        title: 'Luźne powitania ze znajomymi',
        slug: 'luzne-powitania-ze-znajomymi',
        theoryMarkdown: `# Luźne powitania ze znajomymi

  W tej lekcji poznasz nieformalne angielskie powitania, których używasz w codziennych rozmowach ze znajomymi.

  ## Swobodne powitania
  - **Hey!** – "Hej!"
  - **What's up?** – "Co tam?"
  - **How's it going?** – "Jak leci?"
  - **How are you doing?** – "Jak się masz?"
  - **How you doing?** – krótsza, mówiona wersja

  ## Odpowiedzi
  - **Not much.** – "Nic szczególnego."

  ## Bardzo nieformalne
  - **Alright?** – brytyjskie/australijskie, lepiej rozpoznawać niż używać
  - **Hey, how's life?** – "Hej, jak życie?"`.trim(),
      })
      .where(eq(schema.lessons.id, 3));
    console.log('✅ Lesson 3 updated');

    // === UPDATE LESSON 4 (id=4) ===
    console.log('Updating Lesson 4...');
    await db
      .update(schema.lessons)
      .set({
        title: 'Jak się masz? jako uprzejmość',
        slug: 'jak-sie-masz-jako-uprzejmosc',
        theoryMarkdown: `# Jak się masz? jako uprzejmość

  W tej lekcji poznasz angielskie zwroty pytające o samopoczucie – od formalnych po bardzo codzienne.

  ## Podstawowe pytania
  - **How are you?** – "Jak się masz?" (uniwersalne)
  - **How are you doing?** – "Jak się miewasz?" (bardziej naturalne)
  - **How's it going?** – "Jak leci?" (luźne)

  ## Gdy dawno się nie widzieliście
  - **How have you been?** – "Co u ciebie słychać?"

  ## Pytania o konkretne sytuacje
  - **How was it?** – "Jak było?"
  - **How was your weekend?** – "Jak minął weekend?"
  - **How was your trip?** – "Jak minęła podróż?"

  ## Odwzajemnienie pytania
  - **And you?** – "A ty?"`.trim(),
      })
      .where(eq(schema.lessons.id, 4));
    console.log('✅ Lesson 4 updated');

    // === INSERT LESSON 5 ===
    console.log('Inserting Lesson 5...');
    const [lesson5] = await db
      .insert(schema.lessons)
      .values({
        unitId: 1,
        slug: 'pierwsze-spotkanie',
        title: 'Pierwsze spotkanie',
        order: 5,
        isReview: false,
        theoryMarkdown: `# Pierwsze spotkanie

  W tej lekcji poznasz zwroty przydatne podczas pierwszego spotkania z nową osobą.

  ## Przedstawianie się
  - **Hi, I'm Anna.** – "Cześć, jestem Anna."
  - **Hello, I'm Anna.** – "Dzień dobry, jestem Anna."

  ## Rozpoznawanie osoby
  - **You must be Tom.** – "Ty pewnie jesteś Tom."

  ## Reakcje na poznanie
  - **Nice to meet you.** – "Miło cię poznać."
  - **Nice to meet you too.** – "Miło mi też cię poznać."
  - **You too.** – "Ciebie też."

  ## Przedstawianie kogoś
  - **This is Anna.** – "To jest Anna."

  ## Powitanie w grupie
  - **Welcome.** – "Witaj."`.trim(),
      })
      .returning();
    console.log(`✅ Lesson 5 inserted (ID: ${lesson5.id})`);

    console.log('✅ All updates completed successfully!');
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
};

main();
