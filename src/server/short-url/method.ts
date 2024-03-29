"use server";

import { urls } from "@/schema";
import { getUser } from "@/server/auth/methods";
import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cache } from "react";
import z from "zod";

export const getAll = cache(async function () {
    const user = await getUser();

    if (!user) {
        return [];
    }

    const data = await db.select().from(urls).where(eq(urls.userId, user.id));

    return data;
});

export async function createShortURL(url: string) {
    const user = await getUser();

    if (!user) {
        return {
            success: false,
            error: "User not found",
        };
    }

    const result = z.string().url().max(100).safeParse(url);

    if (!result.success) {
        return {
            success: false,
            error: "Invalid URL or URL is too long (100 characters max)",
        };
    }

    const randomID = generateId(8);

    try {
        await db.insert(urls).values({
            url: result.data,
            slug: randomID,
            userId: user.id,
        });

        return {
            success: true,
            slug: randomID,
        };
    } catch {
        return {
            success: false,
            error: "Failed to create short URL",
        };
    }
}

export async function deleteURL(slug: string) {
    const user = await getUser();

    if (!user) {
        return {
            success: false,
            error: "User not found",
        };
    }

    try {
        await db
            .delete(urls)
            .where(and(eq(urls.slug, slug), eq(urls.userId, user.id)));

        return {
            success: true,
        };
    } catch {
        return {
            success: false,
            error: "Failed to delete short URL",
        };
    }
}

export const findBySlug = cache(async function (slug: string) {
    const data = await db.select().from(urls).where(eq(urls.slug, slug));

    return data[0];
});

export const incrementCount = cache(async function (slug: string) {
    const data = await findBySlug(slug);

    await db
        .update(urls)
        .set({ count: data.count + 1 })
        .where(eq(urls.slug, slug));
});
