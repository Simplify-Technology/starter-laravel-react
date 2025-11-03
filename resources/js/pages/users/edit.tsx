import HeadingSmall from '@/components/heading-small';
import UserForm from '@/components/user-form';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role, User } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuários', href: '/users' },
    { title: 'Editar Usuário', href: '#' },
];

type EditUserProps = {
    user: User;
    roles: Role[];
};

export default function Edit({ user, roles }: EditUserProps) {
    useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Usuário - ${user.name}`} />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <HeadingSmall title={`Editar Usuário: ${user.name}`} description="Atualize as informações do usuário abaixo." />
                <div className="bg-card rounded-lg border p-6">
                    <UserForm user={user} roles={roles} routeName="users.update" />
                </div>
            </div>
        </AppLayout>
    );
}
