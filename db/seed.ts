import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' }); // <--- Teraz szuka .env.local
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { MVP_SEED_CONTENT } from './seedContent';

// Łączymy się z bazą
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  console.log('🌱 Start seeding...');

  try {
    // 1. KURS
    console.log('Inserting Course...');
    const [course] = await db
      .insert(schema.courses)
      .values({
        slug: MVP_SEED_CONTENT.course.slug,
        title: MVP_SEED_CONTENT.course.title,
        baseLanguage: MVP_SEED_CONTENT.course.baseLanguage,
        targetLanguage: MVP_SEED_CONTENT.course.targetLanguage,
        imageUrl: MVP_SEED_CONTENT.course.imageUrl,
      })
      .onConflictDoUpdate({
        target: schema.courses.slug,
        set: { title: MVP_SEED_CONTENT.course.title }, // Update title if exists
      })
      .returning();

    console.log(`Course created/updated: ${course.slug} (ID: ${course.id})`);

    // 2. UNIT
    console.log('Inserting Unit...');
    const [unit] = await db
      .insert(schema.units)
      .values({
        courseId: course.id,
        slug: MVP_SEED_CONTENT.unit.slug,
        title: MVP_SEED_CONTENT.unit.title,
        order: MVP_SEED_CONTENT.unit.order,
        description: MVP_SEED_CONTENT.unit.description,
      })
      .onConflictDoUpdate({
        target: [schema.units.courseId, schema.units.slug],
        set: {
          title: MVP_SEED_CONTENT.unit.title,
          description: MVP_SEED_CONTENT.unit.description,
        },
      })
      .returning();

    console.log(`Unit created/updated: ${unit.slug} (ID: ${unit.id})`);

    // 3. LESSONS + CHALLENGES + OPTIONS
    for (const lessonData of MVP_SEED_CONTENT.lessons) {
      console.log(`Processing Lesson: ${lessonData.title}...`);

      const [lesson] = await db
        .insert(schema.lessons)
        .values({
          unitId: unit.id,
          slug: lessonData.slug,
          title: lessonData.title,
          order: lessonData.order,
          isReview: lessonData.isReview,
          theoryMarkdown: lessonData.theoryMarkdown,
        })
        .onConflictDoUpdate({
          target: [schema.lessons.unitId, schema.lessons.slug],
          set: {
            title: lessonData.title,
            isReview: lessonData.isReview,
            theoryMarkdown: lessonData.theoryMarkdown,
          },
        })
        .returning();

      // Challenges
      for (const challengeData of lessonData.challenges) {
        const [challenge] = await db
          .insert(schema.challenges)
          .values({
            lessonId: lesson.id,
            key: challengeData.key,
            type: challengeData.type as 'SELECT' | 'ASSIST',
            prompt: challengeData.prompt,
            order: challengeData.order,
          })
          .onConflictDoUpdate({
            target: [schema.challenges.lessonId, schema.challenges.key],
            set: {
              prompt: challengeData.prompt,
              order: challengeData.order,
            },
          })
          .returning();

        // Options
        for (const optionData of challengeData.options) {
          await db
            .insert(schema.challengeOptions)
            .values({
              challengeId: challenge.id,
              key: optionData.key,
              text: optionData.text,
              isCorrect: optionData.isCorrect,
              order: optionData.order,
            })
            .onConflictDoUpdate({
              target: [schema.challengeOptions.challengeId, schema.challengeOptions.key],
              set: {
                text: optionData.text,
                isCorrect: optionData.isCorrect,
                order: optionData.order,
              },
            });
        }
      }
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

main();