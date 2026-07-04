import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  console.log('🔄 Adding lesson 6 (Boss fight: Mini-dialogi końcowe)...');

  try {
    // Check if lesson 6 already exists
    const existing = await db
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.slug, 'mini-dialogi-koncowe'))
      .limit(1);

    if (existing.length > 0) {
      console.log('✅ Lesson 6 already exists (ID: ' + existing[0].id + '), updating...');
      await db
        .update(schema.lessons)
        .set({
          title: 'Mini-dialogi końcowe',
          slug: 'mini-dialogi-koncowe',
          order: 6,
          isReview: false,
          theoryMarkdown: `# Boss fight: Mini-dialogi końcowe

  W tej lekcji sprawdzisz swoje umiejętności w praktyce – prowadząc mini-dialogi po angielsku.

  ## Zasady
  - System pokazuje wypowiedź rozmówcy,
  - Ty wpisujesz odpowiedź po angielsku,
  - Odpowiedź musi pasować do jednej z zaakceptowanych wersji,
  - Możesz skorzystać z podpowiedzi lub pominąć pytanie.

  Powodzenia!`.trim(),
        })
        .where(eq(schema.lessons.slug, 'mini-dialogi-koncowe'));
      console.log('✅ Lesson 6 updated');
    } else {
      console.log('Inserting Lesson 6...');
      const [lesson6] = await db
        .insert(schema.lessons)
        .values({
          unitId: 1,
          slug: 'mini-dialogi-koncowe',
          title: 'Mini-dialogi końcowe',
          order: 6,
          isReview: false,
          theoryMarkdown: `# Boss fight: Mini-dialogi końcowe

  W tej lekcji sprawdzisz swoje umiejętności w praktyce – prowadząc mini-dialogi po angielsku.

  ## Zasady
  - System pokazuje wypowiedź rozmówcy,
  - Ty wpisujesz odpowiedź po angielsku,
  - Odpowiedź musi pasować do jednej z zaakceptowanych wersji,
  - Możesz skorzystać z podpowiedzi lub pominąć pytanie.

  Powodzenia!`.trim(),
        })
        .returning();
      console.log(`✅ Lesson 6 inserted (ID: ${lesson6.id})`);
    }

    console.log('✅ All updates completed successfully!');
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
};

main();
