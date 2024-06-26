import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { users, sessions } from "@/schema";
import { db } from "@/server/db";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        // this sets cookies with super long expiration
        // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
        expires: false,
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
        };
    },
});

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            username: string;
        };
    }
}
