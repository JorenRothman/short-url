"use client";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createShortURL } from "@/server/short-url/method";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function Create() {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [url, setUrl] = useState("");
    const { toast } = useToast();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createShortURL,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["urls"],
            });
        },
    });

    async function onCreateClick() {
        if (!url) {
            toast({
                title: "Error",
                description: "URL is required",
            });
            return;
        }

        try {
            const result = await mutation.mutateAsync(url);

            if (result.success) {
                toast({
                    title: "Short URL Created",
                    description: "Short URL created",
                });

                closeButtonRef.current?.click();
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                });
            }
        } catch (error) {}
    }

    return (
        <div className="my-6">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button>Create a Shortened URL</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Create a new Short URL</DrawerTitle>
                        <DrawerDescription>
                            Create a new shortened URL by entering the URL.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="mb-6 p-4 pb-0">
                        <form onSubmit={onCreateClick}>
                            <Label className="mb-4 block" htmlFor="url">
                                URL
                            </Label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://google.com"
                                required
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </form>
                    </div>
                    <DrawerFooter className="flex flex-row">
                        <Button onClick={onCreateClick} className="max-w-24">
                            Create
                        </Button>
                        <DrawerClose asChild>
                            <Button
                                ref={closeButtonRef}
                                className="ml-right"
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
