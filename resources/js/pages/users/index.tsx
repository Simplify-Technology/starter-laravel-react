import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Usuários', href: '/users' }];

type UsersProps = {
    users: User[];
};

export default function Index({ users }: UsersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciamento de Usuários" />
        </AppLayout>
    );
}
