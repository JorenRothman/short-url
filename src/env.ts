import { createEnv } from '@t3-oss/env-core';
import { configDotenv } from 'dotenv';
import path from 'path';
import { z } from 'zod';

configDotenv({
    path: path.resolve(__dirname, '../.env'),
});

export const env = createEnv({
    server: {
        DB_HOST: z.string(),
        DB_USER: z.string(),
        DB_PASSWORD: z.string(),
        DB_NAME: z.string(),
        DB_CONNECTION_URI: z.string(),
    },
    clientPrefix: 'PUBLIC_',
    client: {},
    runtimeEnv: process.env,
});
