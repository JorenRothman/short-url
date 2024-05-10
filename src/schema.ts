import { pgSchema, timestamp, integer, varchar } from "drizzle-orm/pg-core";

export const schema = pgSchema("short_url");

export const urls = schema.table("urls", {
    slug: varchar("slug", { length: 8 }).unique().notNull().primaryKey(),
    url: varchar("url", { length: 100 }).notNull(),
    count: integer("count").notNull().default(0),
    userId: varchar("user_id", { length: 16 })
        .notNull()
        .references(() => users.id),
});

export const users = schema.table("users", {
    id: varchar("id", {
        length: 16,
    }).primaryKey(),
    username: varchar("username", { length: 32 }).unique().notNull(),
    password: varchar("password", { length: 256 }).notNull(),
});

export const sessions = schema.table("sessions", {
    id: varchar("id", {
        length: 255,
    }).primaryKey(),
    userId: varchar("user_id", {
        length: 255,
    })
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp("expires_at").notNull(),
});
