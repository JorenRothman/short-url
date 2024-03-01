import { getDB } from '@/server/db';
import { migrate } from 'drizzle-orm/mysql2/migrator';

async function migrateDB() {
    const { db, connection } = getDB();

    await migrate(db, { migrationsFolder: './drizzle' });

    await connection.end();
}

migrateDB();
