import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const urls = mysqlTable("urls", {
    slug: varchar("slug", { length: 8 }).unique().notNull().primaryKey(),
    url: varchar("url", { length: 100 }).notNull(),
    count: int("count").notNull().default(0),
    userId: varchar("user_id", { length: 16 })
        .notNull()
        .references(() => users.id),
});

export const users = mysqlTable("users", {
    id: varchar("id", {
        length: 16,
    }).primaryKey(),
    username: varchar("username", { length: 32 }).unique().notNull(),
    password: varchar("password", { length: 256 }).notNull(),
});

export const sessions = mysqlTable("sessions", {
    id: varchar("id", {
        length: 255,
    }).primaryKey(),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id),
    expiresAt: datetime("expires_at").notNull(),
});
