import AssignRoleUser from '@/components/assign-role-user';
import { EmptyState } from '@/components/empty-state';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import PermissionsLayout from '@/layouts/permissions/layout';
import { type BreadcrumbItem, Permission, Role, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Box, Button as DropdownButton, CheckboxCards, DropdownMenu, Flex, Spinner, Table, Tabs, Text } from '@radix-ui/themes';
import { UserX } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gerenciar Permissões',
        href: '/permission-roles',
    },
];

interface PermissionRoleProps {
    roles: Role[];
    users: User[];
    permissions: Permission[];
}

export default function Roles({ permissions, roles }: PermissionRoleProps) {
    const [isAssignRoleOpen, setAssignRoleOpen] = useState(false);
    const { data, setData, put, processing } = useForm({
        rolePermissions: Object.entries(roles).reduce(
            (acc, [roleName, roleData]) => {
                acc[roleName] = Object.keys(roleData.permissions);
                return acc;
            },
            {} as Record<string, string[]>,
        ),
    });

    const savePermissions = async (roleName: string) => {
        await toast.promise(
            new Promise((resolve, reject) => {
                put(
                    route('roles-permissions.update', {
                        permissions: data.rolePermissions[roleName],
                        role: roleName,
                    }),
                    {
                        preserveScroll: true,
                        onSuccess: () => resolve('Permissões atualizadas com sucesso!'),
                        onError: () => reject('Erro ao atualizar permissões!'),
                    },
                );
            }),
            {
                loading: 'Salvando permissões...',
                success: 'Permissões salvas com sucesso!',
                error: 'Erro ao salvar permissões. Por favor, tente novamente.',
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciar Permissões" />

            <PermissionsLayout roles={roles}>
                {Object.entries(roles).map(([roleName, roleData]) => (
                    <Tabs.Content
                        value={roleName}
                        key={roleName}
                        className={'flex w-full grow flex-col space-y-8 gap-x-8 lg:justify-between xl:flex-row xl:space-y-0'}
                    >
                        <Flex direction={'column'}>
                            <HeadingSmall
                                title="Permissões vinculadas"
                                description={`Essas são as permissões vinculadas à função de ${roleData.label}.`}
                            />

                            <Box width={'100%'} mt={'6'}>
                                <CheckboxCards.Root
                                    columns={{ initial: '1', sm: '2', xl: '3' }}
                                    value={data.rolePermissions[roleName]}
                                    onValueChange={(newValues) =>
                                        setData('rolePermissions', {
                                            ...data.rolePermissions,
                                            [roleName]: newValues,
                                        })
                                    }
                                >
                                    {permissions.map((permission) => (
                                        <CheckboxCards.Item className="grow" key={permission.name} value={permission.name}>
                                            <Flex direction="column">
                                                <Text weight="bold" className={'min-w-max'}>
                                                    {permission.label}
                                                </Text>
                                            </Flex>
                                        </CheckboxCards.Item>
                                    ))}
                                </CheckboxCards.Root>
                            </Box>

                            <Button
                                className={'mt-4 max-w-max cursor-pointer'}
                                variant={'secondary'}
                                onClick={() => savePermissions(roleName)}
                                disabled={processing}
                            >
                                {processing ? <Spinner mr={'2'} /> : null}
                                {processing ? 'Salvando...' : 'Salvar Permissões'}
                            </Button>
                        </Flex>

                        <Flex direction={'column'} className={'w-full flex-1'}>
                            <HeadingSmall
                                title="Usuários com essa função"
                                description={`Esses são os usuários que possuem a função de ${roleData.label}.`}
                            />

                            <Table.Root variant="surface" mt={'6'}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {roleData.users.length > 0 ? (
                                        roleData.users.map((user) => (
                                            <>
                                                <Table.Row key={user.id}>
                                                    <Table.RowHeaderCell>{user.name} </Table.RowHeaderCell>
                                                    <Table.Cell>{user.email}</Table.Cell>
                                                    <Table.Cell>
                                                        <DropdownMenu.Root>
                                                            <DropdownMenu.Trigger>
                                                                <DropdownButton color={'gray'} variant={'surface'} size={'1'}>
                                                                    Ações
                                                                    <DropdownMenu.TriggerIcon />
                                                                </DropdownButton>
                                                            </DropdownMenu.Trigger>
                                                            <DropdownMenu.Content size="1">
                                                                <DropdownMenu.Item shortcut="⌘ E">Detalhes</DropdownMenu.Item>
                                                                <DropdownMenu.Item shortcut="⌘ D">Adicionar Permissão</DropdownMenu.Item>
                                                                <DropdownMenu.Separator />
                                                                <DropdownMenu.Item onClick={() => setAssignRoleOpen(true)} shortcut="⌘ N">
                                                                    Atribuir Cargo
                                                                </DropdownMenu.Item>

                                                                <DropdownMenu.Separator />
                                                                <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
                                                                    Remover Cargo
                                                                </DropdownMenu.Item>
                                                            </DropdownMenu.Content>
                                                        </DropdownMenu.Root>
                                                    </Table.Cell>
                                                </Table.Row>
                                                {isAssignRoleOpen && (
                                                    <AssignRoleUser userId={user.id} roles={roles} onClose={() => setAssignRoleOpen(false)} />
                                                )}
                                            </>
                                        ))
                                    ) : (
                                        <EmptyState
                                            icon={UserX}
                                            type={'row'}
                                            title="Nenhum usuário encontrado"
                                            description="Nenhum usuário foi encontrado com essa função."
                                        />
                                    )}
                                </Table.Body>
                            </Table.Root>
                        </Flex>
                    </Tabs.Content>
                ))}
            </PermissionsLayout>
        </AppLayout>
    );
}
