import { env } from '@/env';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';

export const connection = mysql.createConnection(env.DB_CONNECTION_URI);

export const db = drizzle(connection);
