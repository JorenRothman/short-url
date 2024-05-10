import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const connection = postgres(env.DB_CONNECTION_URI, {});

export const migrationClient = postgres(env.DB_CONNECTION_URI, { max: 1 });

export const db = drizzle(connection);
