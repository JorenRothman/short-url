'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { loginUser } from '@/server/auth/methods';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
    const { toast } = useToast();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = await loginUser(username, password);

        if (!result.success) {
            return toast({
                title: 'Error',
                description: result.error,
            });
        }

        toast({
            title: 'Success',
            description: 'You are logged in',
        });

        router.push('/');
    }

    return (
        <div className="max-w-xl mx-auto w-full flex flex-col items-center">
            <form
                onSubmit={onSubmit}
                className="flex flex-col gap-4 w-full p-12"
            >
                <h1 className="text-2xl">Login</h1>
                <Input
                    type="text"
                    placeholder="Username"
                    min={6}
                    required
                    onChange={(event) => setUsername(event.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    min={6}
                    required
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button>Login</Button>
            </form>
            <p>
                No account?{' '}
                <Link className="underline" href="/register">
                    Register here
                </Link>
            </p>
        </div>
    );
}
