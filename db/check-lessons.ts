import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { asc } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  const allLessons = await db.select().from(schema.lessons).orderBy(asc(schema.lessons.order));
  console.log(JSON.stringify(allLessons, null, 2));
}
main().catch(console.error);
