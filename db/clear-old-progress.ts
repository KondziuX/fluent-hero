import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq, inArray } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  console.log('🧹 Clearing old challenge progress for lessons 1 and 3...');

  try {
    // Find all challenges belonging to lessons 1 and 3
    const challengesToDelete = await db
      .select({ id: schema.challenges.id })
      .from(schema.challenges)
      .where(
        inArray(schema.challenges.lessonId, [1, 3])
      );

    console.log(`Found ${challengesToDelete.length} challenges in lessons 1 and 3`);

    if (challengesToDelete.length > 0) {
      const challengeIds = challengesToDelete.map(c => c.id);

      // Delete challenge progress for these challenges
      const deletedProgress = await db
        .delete(schema.challengeProgress)
        .where(
          inArray(schema.challengeProgress.challengeId, challengeIds)
        )
        .returning();

      console.log(`✅ Deleted ${deletedProgress.length} challenge progress records`);
    } else {
      console.log('No challenges found for lessons 1 and 3 - nothing to clear');
    }

    console.log('✅ Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
};

main();
