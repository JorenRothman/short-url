import Create from "@/components/dashboard/create";
import Table from "@/components/dashboard/table";
import { getUser } from "@/server/auth/methods";
import { getAll } from "@/server/short-url/method";
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["urls"],
        queryFn: getAll,
    });

    return (
        <main className="container mx-auto py-24">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Table />
            </HydrationBoundary>
            <Create />
        </main>
    );
}
