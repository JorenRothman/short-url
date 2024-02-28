import { env } from '@/env';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';

export const connection = mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
});

export const db = drizzle(connection);
