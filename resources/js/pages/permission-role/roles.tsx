import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import PermissionsLayout from '@/layouts/permissions/layout';
import { type BreadcrumbItem, Permission } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Box, CheckboxCards, Flex, Tabs, Text } from '@radix-ui/themes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gerenciar Permissões',
        href: '/permission-roles',
    },
];

interface PermissionRoleProps {
    roles: Record<string, { label: string; permissions: Record<string, string> }>; // ⬅️ Corrigido
    permissions: Permission[];
}

export default function Roles({ permissions, roles }: PermissionRoleProps) {
    // Corrigido: Ajuste para o formato de roles
    const { data, setData, put, processing } = useForm({
        rolePermissions: Object.entries(roles).reduce(
            (acc, [roleName, roleData]) => {
                acc[roleName] = Object.keys(roleData.permissions); // ⬅️ Extrai os nomes das permissões
                return acc;
            },
            {} as Record<string, string[]>,
        ),
    });

    const savePermissions = (roleName: string) => {
        put(route('roles-permissions.update', { role: roleName, permissions: data.rolePermissions[roleName] }), {
            preserveScroll: true,
            onSuccess: () => console.log('Permissões enviadas com sucesso!'),
            onError: (errors) => console.error('Erro ao enviar permissões:', errors),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciar Permissões" />

            <PermissionsLayout roles={roles}>
                {Object.entries(roles).map(([roleName, roleData]) => (
                    <Tabs.Content value={roleName} key={roleName}>
                        <HeadingSmall
                            title="Permissões vinculadas"
                            description={`Essas são as permissões vinculadas à função de ${roleData.label}.`}
                        />

                        <Box width={'100%'} pt={'4'}>
                            <CheckboxCards.Root
                                columns={{ initial: '1', sm: '1', md: '3' }}
                                value={data.rolePermissions[roleName]}
                                onValueChange={(newValues) =>
                                    setData('rolePermissions', {
                                        ...data.rolePermissions,
                                        [roleName]: newValues,
                                    })
                                }
                            >
                                {permissions.map((permission) => (
                                    <CheckboxCards.Item key={permission.name} value={permission.name}>
                                        <Flex direction="column" width="100%">
                                            <Text weight="bold">{permission.label}</Text>
                                        </Flex>
                                    </CheckboxCards.Item>
                                ))}
                            </CheckboxCards.Root>
                        </Box>

                        <button
                            className="bg-secondary mt-4 cursor-pointer rounded px-4 py-2 text-white"
                            onClick={() => savePermissions(roleName)}
                            disabled={processing}
                        >
                            {processing ? 'Salvando...' : 'Salvar Permissões'}
                        </button>
                    </Tabs.Content>
                ))}
            </PermissionsLayout>
        </AppLayout>
    );
}
