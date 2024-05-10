import { connection, migrationClient } from "@/server/db";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function migrateDB() {
    await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });

    connection.end();

    console.log("Migration completed");

    process.exit();
}

migrateDB();
