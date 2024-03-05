"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createUser } from "@/server/auth/methods";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function validatePassword(password: string, confirmPassword: string) {
    return password === confirmPassword;
}

export default function RegistrationForm() {
    const { toast } = useToast();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validatePassword(password, confirmPassword)) {
            return toast({
                title: "Error",
                description: "Passwords do not match",
            });
        }

        const result = await createUser(username, password);

        if (!result.success) {
            return toast({
                title: "Error",
                description: result.error,
            });
        }

        toast({
            title: "Account created",
            description: "You can now login",
        });

        router.push("/login");
    }

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4">
            <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
                <h1 className="text-2xl">Register</h1>
                <Input
                    type="text"
                    placeholder="Username"
                    minLength={6}
                    required
                    onChange={(event) => setUsername(event.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    minLength={6}
                    required
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    minLength={6}
                    required
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />

                <Button>Register</Button>
            </form>

            <p>
                Already got an account?{" "}
                <Link className="underline" href="/login">
                    Login
                </Link>
            </p>
        </div>
    );
}
