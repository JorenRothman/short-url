"use server";
import { users } from "@/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";
import { cache } from "react";
import z from "zod";
import { lucia } from "@/server/auth/config";

export async function createUser(iUsername: string, iPassword: string) {
    const username = z.string().min(6).max(32).safeParse(iUsername);

    if (!username.success) {
        return {
            success: false,
            error: "Username must be between 6 and 32 characters",
        };
    }

    const password = z.string().min(6).safeParse(iPassword);

    if (!password.success) {
        return {
            success: false,
            error: "Password must be at least 6 characters",
        };
    }

    const hashedPassword = await new Argon2id().hash(password.data);

    const userID = generateId(16);

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
        if (error.code === "ER_DUP_ENTRY") {
            return {
                success: false,
                error: "Username already exists",
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
            error: "Invalid username or password",
        };
    }

    const validPassword = await new Argon2id().verify(user.password, password);

    if (!validPassword) {
        return {
            success: false,
            error: "Invalid username or password",
        };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return {
        success: true,
    };
}

export const getUser = cache(async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) return null;
    const { user, session } = await lucia.validateSession(sessionId);
    try {
        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes,
            );
        }
        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes,
            );
        }
    } catch {
        // Next.js throws error when attempting to set cookies when rendering page
    }
    return user;
});

export async function logout() {
    const cookieHeader = cookies().get(lucia.sessionCookieName)?.name;
    const sessionID = cookies().get(lucia.sessionCookieName)?.value;

    if (sessionID) {
        await lucia.invalidateSession(sessionID);
    }

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );
}
