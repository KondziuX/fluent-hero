import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  console.log('🔄 Updating lessons 1-4 with new titles, slugs, and theory...');

  try {
    // === UPDATE LESSON 1 (id=1) ===
    console.log('Updating Lesson 1...');
    await db
      .update(schema.lessons)
      .set({
        title: 'Najprostsze powitania',
        slug: 'najprostsze-powitania',
        theoryMarkdown: `# Najprostsze powitania

  W tej lekcji poznasz najprostsze angielskie powitania, których możesz użyć w każdej sytuacji.

  ## Bezpieczne powitania
  - **Hello** – uniwersalne, działa wszędzie
  - **Hi** – krótsze, naturalne
  - **Hey** – luźne, do znajomych
  - **Hi there** – przyjazne, cieplejsze niż samo "Hi"

  ## Rozpoczynanie rozmowy
  - **Excuse me** – grzeczne zwrócenie uwagi obcej osoby`.trim(),
      })
      .where(eq(schema.lessons.id, 1));
    console.log('✅ Lesson 1 updated');

    // === UPDATE LESSON 2 (id=2) ===
    console.log('Updating Lesson 2...');
    await db
      .update(schema.lessons)
      .set({
        title: 'Powitania według pory dnia',
        slug: 'powitania-wedlug-pory-dnia',
        theoryMarkdown: `# Powitania według pory dnia

  W tej lekcji poznasz angielskie powitania dopasowane do pory dnia.

  ## Rano
  - **Good morning** – "Dzień dobry" (rano)
  - **Morning** – krótsza, codzienna wersja

  ## Po południu
  - **Good afternoon** – "Dzień dobry" (po południu)

  ## Wieczorem
  - **Good evening** – "Dobry wieczór"
  - **Good night** – "Dobranoc" (na pożegnanie)`.trim(),
      })
      .where(eq(schema.lessons.id, 2));
    console.log('✅ Lesson 2 updated');

    // === UPDATE LESSON 3 (id=3) ===
    console.log('Updating Lesson 3...');
    await db
      .update(schema.lessons)
      .set({
        title: 'Jak się masz?',
        slug: 'jak-sie-masz',
        theoryMarkdown: `# Jak się masz?

  W tej lekcji poznasz angielskie zwroty pytające o samopoczucie – od formalnych po bardzo codzienne.

  ## Podstawowe pytania
  - **How are you?** – "Jak się masz?" (uniwersalne)
  - **How are you doing?** – "Jak się miewasz?" (bardziej naturalne)
  - **How's it going?** – "Jak leci?" (luźne)

  ## Gdy dawno się nie widzieliście
  - **How have you been?** – "Co u ciebie słychać?"

  ## Bardzo luźne
  - **What's up?** – "Co tam?"`.trim(),
      })
      .where(eq(schema.lessons.id, 3));
    console.log('✅ Lesson 3 updated');

    // === UPDATE LESSON 4 (id=4) ===
    console.log('Updating Lesson 4...');
    await db
      .update(schema.lessons)
      .set({
        title: 'Krótkie odpowiedzi',
        slug: 'krotkie-odpowiedzi',
        theoryMarkdown: `# Krótkie odpowiedzi

  W tej lekcji poznasz krótkie odpowiedzi na pytanie "How are you?" i podobne zwroty.

  ## Podstawowe odpowiedzi
  - **I'm good, thanks.** – "Mam się dobrze, dzięki."
  - **I'm fine, thanks.** – "Mam się dobrze, dzięki." (grzeczna wersja)
  - **Pretty good.** – "Całkiem dobrze."
  - **Not bad.** – "Nieźle."

  ## Odwzajemnienie pytania
  - **I'm good, thanks. And you?** – odpowiedź + pytanie
  - **And you?** – "A ty?"
  - **How about you?** – "A co u ciebie?"`.trim(),
      })
      .where(eq(schema.lessons.id, 4));
    console.log('✅ Lesson 4 updated');

    console.log('✅ All updates completed successfully!');
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
};

main();
