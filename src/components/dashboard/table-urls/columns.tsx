'use client';

import { env } from '@/env';
import type { URL } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

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
    // {
    //     id: 'actions',
    //     header: 'Actions',
    //     cell: ({ row }) => {
    //         const { original } = row;

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() => deleteURL(original.slug)}
    //                     >
    //                         Delete
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];
