'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { deleteURL } from '@/server/short-url/method';
import type { URL } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const columns: ColumnDef<URL>[] = [
    {
        accessorKey: 'url',
        header: 'Original URL',
    },
    {
        accessorKey: 'slug',
        header: 'Short URL',
        cell: ({ row }) => {
            const { original } = row;

            return (
                <Link
                    href={`/x/${original.slug}`}
                    prefetch={false}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    /x/{original.slug}
                </Link>
            );
        },
    },
    {
        accessorKey: 'count',
        header: 'Clicks',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const { original } = row;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const queryClient = useQueryClient();

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const mutation = useMutation({
                mutationFn: () => deleteURL(original.slug),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['urls'] });
                },
            });

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => mutation.mutate()}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
