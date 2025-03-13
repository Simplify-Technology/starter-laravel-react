import { EmptyState } from '@/components/EmptyState';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';
import { Table } from '@radix-ui/themes';
import { User2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Usuários', href: '/users' }];

type UsersProps = {
    users: User[];
};

export default function Index({ users }: UsersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciamento de Usuários" />

            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Celular</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <Table.Row>
                                <Table.RowHeaderCell>{user.name}</Table.RowHeaderCell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{user.mobile}</Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <EmptyState title={'Nenhum usuário encontrado'} icon={User2} type={'row'} />
                    )}
                </Table.Body>
            </Table.Root>
        </AppLayout>
    );
}
