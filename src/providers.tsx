"use client";

type Props = {
    children: React.ReactNode;
};

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers(props: Props) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    );
}
