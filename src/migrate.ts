import { db, connection } from "@/server/db";
import { migrate } from "drizzle-orm/mysql2/migrator";

async function migrateDB() {
    await migrate(db, { migrationsFolder: "./drizzle" });

    connection.end();
}

migrateDB();
