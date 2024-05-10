import { env } from "@/env";
import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DB_CONNECTION_URI,
    },
} satisfies Config;
