import Create from '@/components/dashboard/create';
import Table from '@/components/dashboard/table';
import { validateRequest } from '@/server/auth/methods';
import { getAll } from '@/server/short-url/method';
import { redirect } from 'next/navigation';

const dynamic = 'force-dynamic';

export default async function Home() {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/login');
    }

    const urls = await getAll();

    return (
        <main className="max-w-5xl w-full mx-auto my-24">
            <Table data={urls} />
            <Create />
        </main>
    );
}
