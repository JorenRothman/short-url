'use client';

import { columns } from '@/components/dashboard/table-urls/columns';
import { DataTable } from '@/components/dashboard/table-urls/data-table';
import { deleteURL, getAll } from '@/server/short-url/method';
import type { URL } from '@/types';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';

type Props = {
    data: URL[];
};

export default function Table(props: Props) {
    const { data } = props;

    const query = useQuery({
        queryKey: ['urls'],
        queryFn: () => getAll(),
        initialData: data,
    });

    return (
        <div>
            <h1 className="text-2xl mb-6">Shortened URLs</h1>
            <DataTable columns={columns} data={query.data} />
        </div>
    );
}
