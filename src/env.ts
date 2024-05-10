import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

console.log(process.env.DB_CONNECTION_URI);

export const env = createEnv({
    server: {
        DB_CONNECTION_URI: z.string(),
    },
    clientPrefix: "PUBLIC_",
    client: {},
    runtimeEnv: process.env,
});
