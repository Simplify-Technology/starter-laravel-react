import { type BreadcrumbItem, Role } from '@/types';
import { Head } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Box, CheckboxCards, Flex, Text } from '@radix-ui/themes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Funções e Permissões ',
        href: '/permission-roles',
    },
];

interface PermissionRoleProps {
    roles: Role[];
}

export default function Roles({ roles }: PermissionRoleProps) {
    // const { auth } = usePage<SharedData>().props;

    // const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
    //     name: auth.user.name,
    //     email: auth.user.email,
    // });
    //
    // const submit: FormEventHandler = (e) => {
    //     e.preventDefault();
    //
    //     patch(route('profile.update'), {
    //         preserveScroll: true,
    //     });
    // };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />

            <SettingsLayout roles={roles}>
                <div className="space-y-6">
                    <HeadingSmall title="Permissões vinculadas" description="Essas são as permissões vinculadas a essa função." />

                    {/* permissions related to selected role*/}
                    <Box maxWidth="600px">
                        <CheckboxCards.Root defaultValue={['1']} columns={{ initial: '1', sm: '3' }}>
                            <CheckboxCards.Item value="1">
                                <Flex direction="column" width="100%">
                                    <Text weight="bold">A1 Keyboard</Text>
                                    <Text>US Layout</Text>
                                </Flex>
                            </CheckboxCards.Item>
                            <CheckboxCards.Item value="2">
                                <Flex direction="column" width="100%">
                                    <Text weight="bold">Pro Mouse</Text>
                                    <Text>Zero-lag wireless</Text>
                                </Flex>
                            </CheckboxCards.Item>
                            <CheckboxCards.Item value="3">
                                <Flex direction="column" width="100%">
                                    <Text weight="bold">Lightning Mat</Text>
                                    <Text>Wireless charging</Text>
                                </Flex>
                            </CheckboxCards.Item>
                        </CheckboxCards.Root>
                    </Box>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
