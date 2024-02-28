import { env } from '@/env';
import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './src/schema.ts',
    out: './drizzle',
    driver: 'mysql2',
    dbCredentials: {
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        port: env.DB_PORT,
    },
} satisfies Config;
