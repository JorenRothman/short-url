import { env } from '@/env';
import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
    schema: './src/schema.ts',
    out: './drizzle',
    driver: 'mysql2',
    dbCredentials: {
        uri: env.DB_CONNECTION_URI,
    },
} satisfies Config;
