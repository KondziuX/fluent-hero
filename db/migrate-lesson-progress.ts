import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

const connection = neon(process.env.DATABASE_URL!);
const db = drizzle(connection);

const main = async () => {
  console.log('🔄 Creating lesson_progress table...');

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        completed BOOLEAN NOT NULL DEFAULT false,
        percentage INTEGER NOT NULL DEFAULT 0,
        known_count INTEGER NOT NULL DEFAULT 0,
        total_count INTEGER NOT NULL DEFAULT 0,
        last_attempt_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT user_lesson_unique UNIQUE (user_id, lesson_id)
      );
    `);

    console.log('✅ lesson_progress table created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

main();
