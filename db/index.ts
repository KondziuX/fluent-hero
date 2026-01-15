import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // <--- 1. Importujemy schemat

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
// 2. Przekazujemy schemat do Drizzle, żeby wiedział o tabelach
const db = drizzle(sql, { schema });

export default db;