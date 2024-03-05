"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { deleteURL } from "@/server/short-url/method";
import type { URL } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const columns: ColumnDef<URL>[] = [
    {
        accessorKey: "url",
        header: "Original URL",
    },
    {
        accessorKey: "slug",
        header: "Short URL",
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
        accessorKey: "count",
        header: "Clicks",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { original } = row;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { toast } = useToast();

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const queryClient = useQueryClient();

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const mutation = useMutation({
                mutationFn: () => deleteURL(original.slug),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["urls"] });

                    toast({
                        title: "Success",
                        description: "Short URL deleted",
                    });
                },
                onError: (error) => {
                    toast({
                        title: "Error",
                        description: error.message,
                    });
                },
            });

            return (
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-500">
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete short url.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    variant="destructive"
                                    onClick={() => mutation.mutate()}
                                >
                                    Delete
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];
