import { usePermissions } from '@/hooks/use-permissions';
import { Role } from '@/types';
import { useForm } from '@inertiajs/react';
import { Button, Dialog, Flex, Select, Text } from '@radix-ui/themes';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

type AssignRoleUserProps = {
    userId: number;
    roles: Record<string, Role> | Role[];
    currentRole?: string;
    currentRoleLabel?: string;
    onClose: () => void;
};


export default function AssignRoleUser({ userId, roles, onClose, currentRole, currentRoleLabel }: AssignRoleUserProps) {
    const { hasPermission, hasRole } = usePermissions();
    const isSuperUser = hasRole('super_user');

    // Verifica se o usuário tem permissão para atribuir roles
    const canAssignRoles = hasPermission('assign_roles');

    const { data, setData, post, processing } = useForm({ role: currentRole ?? '' });
    const [open, setOpen] = useState(true);

    const handleRoleChange = useCallback(
        (value: string) => {
            if (data.role !== value) {
                setData('role', value);
            }
        },
        [data.role, setData],
    );

    const assignRole = async () => {
        if (!canAssignRoles) {
            toast.error('Você não tem permissão para atribuir cargos!');
            return;
        }

        await toast.promise(
            new Promise((resolve, reject) => {
                post(route('user.assign-role', { role: data.role, user: userId }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        resolve('Cargo atualizado com sucesso!');
                        setOpen(false);
                        onClose();
                    },
                    onError: ({ error }) => {
                        reject(error);
                        setOpen(false);
                        onClose();
                    },
                });
            }),
            {
                loading: 'Atribuindo cargo...',
                success: (message) => String(message),
                error: (error) => String(error),
            },
        );
    };

    const handleOnOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
        setOpen(!open);
    };

    // Converte roles para array se necessário
    // As roles já vêm filtradas do backend pelo RoleFilterService
    // Este filtro é apenas uma camada adicional de segurança no frontend
    const filteredRoles = useMemo(() => {
        const rolesArray = Array.isArray(roles)
            ? roles
            : Object.entries(roles).map(([key, role]) => ({
                name: key,
                label: role.label || role.name || key,
                id: (role as Role).id,
            }));

        // Proteção adicional: Remove SUPER_USER se o usuário não for SUPER_USER
        // (as roles já vêm filtradas do backend, mas isso é uma camada extra de segurança)
        let filtered = rolesArray.filter((role) => {
            if (role.name === 'super_user' && !isSuperUser) {
                return false;
            }
            return true;
        });

        // Se o cargo atual não estiver na lista, inclui ele para que apareça selecionado
        // Isso garante que o cargo atual seja exibido mesmo que não esteja na lista de roles atribuíveis
        if (currentRole && !filtered.some((role) => role.name === currentRole)) {
            // Busca o role completo na lista original (rolesArray já contém todos os roles passados)
            const originalRole = rolesArray.find((role) => role.name === currentRole);
            if (originalRole) {
                filtered.push(originalRole);
            } else {
                // Se não encontrou na lista original, tenta buscar na lista completa de roles
                // (roles pode ser um array ou objeto)
                const allRolesArray = Array.isArray(roles)
                    ? roles
                    : Object.values(roles);

                const foundRole = allRolesArray.find((role: Role) => {
                    if (typeof role !== 'object' || role === null) return false;
                    return 'name' in role && role.name === currentRole;
                });

                if (foundRole && typeof foundRole === 'object' && 'name' in foundRole) {
                    // Se encontrou, usa o role completo com label
                    filtered.push({
                        name: foundRole.name,
                        label: foundRole.label || foundRole.name,
                        id: foundRole.id || 0,
                    });
                } else {
                    // Último recurso: cria um objeto temporário
                    // Usa a label fornecida se disponível, senão formata o nome
                    const label = currentRoleLabel || currentRole
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    filtered.push({
                        name: currentRole,
                        label: label,
                        id: 0,
                    });
                }
            }
        }

        return filtered;
    }, [roles, isSuperUser, currentRole, currentRoleLabel]);

    return (
        <Dialog.Root open={open} onOpenChange={handleOnOpenChange}>
            <Dialog.Content maxWidth="400px">
                <Dialog.Title>Atribuir Novo Cargo</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Selecione o cargo que deseja atribuir a esse usuário.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Cargo
                        </Text>
                        <Select.Root value={data.role} onValueChange={handleRoleChange}>
                            <Select.Trigger placeholder="Selecione um cargo" />
                            <Select.Content position="popper">
                                {filteredRoles.length === 0 ? (
                                    <Select.Item value="" disabled>
                                        Nenhum cargo disponível
                                    </Select.Item>
                                ) : (
                                    filteredRoles.map((role) => (
                                        <Select.Item key={role.name || ''} value={role.name || ''}>
                                            {role.label || role.name}
                                        </Select.Item>
                                    ))
                                )}
                            </Select.Content>
                        </Select.Root>
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancelar
                        </Button>
                    </Dialog.Close>
                    <Button onClick={assignRole} disabled={processing}>
                        {processing ? 'Salvando...' : 'Atribuir'}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
