import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, Role } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, CheckboxCards, Flex, Spinner, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gerenciar Permissões',
        href: '/permission-roles',
    },
];

interface PermissionRoleProps {
    roles: Role[];
    role: Role;
}

export default function RolePermissions({ roles, role }: PermissionRoleProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [role]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciar Permissões" />

            <SettingsLayout roles={roles}>
                <div className="w-full space-y-6">
                    <HeadingSmall title="Permissões vinculadas" description="Essas são as permissões vinculadas a essa função." />

                    {loading ? (
                        <Spinner />
                    ) : (
                        <Box width={'100%'}>
                            <CheckboxCards.Root defaultValue={['1']} columns={{ initial: '1', sm: '1', md: '3' }}>
                                {role.permissions.map((permission) => (
                                    <CheckboxCards.Item key={permission.name} value={permission.name}>
                                        <Flex direction="column" width="100%">
                                            <Text weight="bold">{permission.label}</Text>
                                        </Flex>
                                    </CheckboxCards.Item>
                                ))}
                            </CheckboxCards.Root>
                        </Box>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
