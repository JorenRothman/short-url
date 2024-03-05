"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/server/auth/methods";

export default function Logout() {
    async function onClick() {
        await logout();
    }

    return <Button onClick={onClick}>Logout</Button>;
}
