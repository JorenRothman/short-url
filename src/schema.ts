import { bigint, datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const urls = mysqlTable('urls', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    url: varchar('url', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 32 }).unique().notNull(),
});

export const users = mysqlTable('users', {
    id: varchar('id', {
        length: 255,
    }).primaryKey(),
    username: varchar('username', { length: 32 }).unique().notNull(),
    password: varchar('password', { length: 256 }).notNull(),
});

export const sessions = mysqlTable('sessions', {
    id: varchar('id', {
        length: 255,
    }).primaryKey(),
    userId: varchar('user_id', {
        length: 255,
    })
        .notNull()
        .references(() => users.id),
    expiresAt: datetime('expires_at').notNull(),
});
