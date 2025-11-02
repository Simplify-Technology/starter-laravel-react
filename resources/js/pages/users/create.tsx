import HeadingSmall from '@/components/heading-small';
import UserForm from '@/components/user-form';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuários', href: '/users' },
    { title: 'Criar Usuário', href: '/users/create' },
];

type CreateUserProps = {
    roles: Role[];
};

export default function Create({ roles }: CreateUserProps) {
    useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criar Usuário" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <HeadingSmall title="Criar Novo Usuário" description="Preencha os dados abaixo para criar um novo usuário no sistema." />
                <div className="bg-card rounded-lg border p-6">
                    <UserForm roles={roles} routeName="users.store" />
                </div>
            </div>
        </AppLayout>
    );
}
