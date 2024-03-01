'use server';

import { urls } from '@/schema';
import { getDB } from '@/server/db';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { cache } from 'react';
import z from 'zod';

export const getAll = cache(async function () {
    const { db, connection } = getDB();

    const data = await db.select().from(urls);

    connection.end();

    return data;
});

export async function createShortURL(url: string) {
    const schema = z.string().url();
    const result = schema.safeParse(url);

    if (!result.success) {
        return {
            success: false,
            error: 'Invalid URL',
        };
    }

    const randomID = generateId(8);

    try {
        const { db, connection } = getDB();

        await db.insert(urls).values({
            url: result.data,
            slug: randomID,
        });

        connection.end();

        return {
            success: true,
            slug: randomID,
        };
    } catch {
        return {
            success: false,
            error: 'Failed to create short URL',
        };
    }
}

export async function deleteURL(slug: string) {
    try {
        const { db, connection } = getDB();

        await db.delete(urls).where(eq(urls.slug, slug));

        connection.end();

        return {
            success: true,
        };
    } catch {
        return {
            success: false,
            error: 'Failed to delete short URL',
        };
    }
}

export const findBySlug = cache(async function (slug: string) {
    const { db, connection } = getDB();

    const data = await db.select().from(urls).where(eq(urls.slug, slug));

    connection.end();

    return data[0];
});
