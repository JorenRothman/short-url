import { env } from '@/env';
import { drizzle } from 'drizzle-orm/mysql2';
import { connect } from 'http2';
import mysql from 'mysql2';

export function getDB() {
    const connection = mysql.createConnection(env.DB_CONNECTION_URI);

    const db = drizzle(connection);

    return { db, connection };
}
