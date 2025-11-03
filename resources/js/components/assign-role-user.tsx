import { Role } from '@/types';
import { useForm } from '@inertiajs/react';
import { Button, Dialog, Flex, Select, Text } from '@radix-ui/themes';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

type AssignRoleUserProps = {
    userId: number;
    roles: Record<string, Role> | Role[];
    currentRole?: string;
    onClose: () => void;
};

export default function AssignRoleUser({ userId, roles, onClose, currentRole }: AssignRoleUserProps) {
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
                                {Array.isArray(roles)
                                    ? roles.map((role) => (
                                          <Select.Item key={role.name || ''} value={role.name || ''}>
                                              {role.label || role.name}
                                          </Select.Item>
                                      ))
                                    : Object.entries(roles).map(([key, role]) => (
                                          <Select.Item key={key} value={key}>
                                              {role.label || role.name}
                                          </Select.Item>
                                      ))}
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
