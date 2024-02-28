'use server';
import { users } from '@/schema';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { generateId, Session, type User } from 'lucia';
import { cookies } from 'next/headers';
import { Argon2id } from 'oslo/password';
import { cache } from 'react';
import z from 'zod';
import { lucia } from '@/server/auth/config';

export async function createUser(iUsername: string, iPassword: string) {
    const username = z.string().min(6).safeParse(iUsername);

    if (!username.success) {
        return {
            success: false,
            error: 'Username must be at least 6 characters',
        };
    }

    const password = z.string().min(6).safeParse(iPassword);

    if (!password.success) {
        return {
            success: false,
            error: 'Password must be at least 6 characters',
        };
    }

    const hashedPassword = await new Argon2id().hash(password.data);

    const userID = generateId(15);

    try {
        await db.insert(users).values({
            id: userID,
            username: username.data,
            password: hashedPassword,
        });

        return {
            success: true,
            userID,
        };
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                success: false,
                error: 'Username already exists',
            };
        }

        throw error;
    }
}

export async function loginUser(username: string, password: string) {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

    const user = result[0];

    if (!user) {
        return {
            success: false,
            error: 'Invalid username or password',
        };
    }

    const validPassword = await new Argon2id().verify(user.password, password);

    if (!validPassword) {
        return {
            success: false,
            error: 'Invalid username or password',
        };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );

    return {
        success: true,
    };
}

export const validateRequest = cache(
    async (): Promise<
        { user: User; session: Session } | { user: null; session: null }
    > => {
        const sessionID = cookies().get(lucia.sessionCookieName)?.value ?? null;

        if (!sessionID) {
            return {
                user: null,
                session: null,
            };
        }

        const result = await lucia.validateSession(sessionID);

        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(
                    result.session.id
                );
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );
            }
        } catch {}

        return result;
    }
);
