import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@radix-ui/themes';
import { ArrowLeft, Edit, UserCheck, UserX } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuários', href: '/users' },
    { title: 'Detalhes do Usuário', href: '#' },
];

type ShowUserProps = {
    user: User;
    roles: Role[];
};

export default function Show({ user }: ShowUserProps) {
    useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Usuário - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('users.index')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <Link href={route('users.edit', user.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                            <CardDescription>Dados básicos do usuário</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Nome</p>
                                <p className="text-base">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Email</p>
                                <p className="text-base">{user.email}</p>
                            </div>
                            {user.cpf_cnpj && (
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">CPF/CNPJ</p>
                                    <p className="text-base">{user.cpf_cnpj}</p>
                                </div>
                            )}
                            {user.phone && (
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Telefone</p>
                                    <p className="text-base">{user.phone}</p>
                                </div>
                            )}
                            {user.mobile && (
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Celular</p>
                                    <p className="text-base">{user.mobile}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Sistema</CardTitle>
                            <CardDescription>Configurações e permissões</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Status</p>
                                <Badge color={user.is_active ? 'green' : 'gray'} className="mt-1 inline-flex items-center gap-1">
                                    {user.is_active ? (
                                        <>
                                            <UserCheck className="h-3 w-3" />
                                            Ativo
                                        </>
                                    ) : (
                                        <>
                                            <UserX className="h-3 w-3" />
                                            Inativo
                                        </>
                                    )}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Cargo</p>
                                <p className="text-base">{user.role?.label || user.role?.name || 'Sem cargo'}</p>
                            </div>
                            {user.email_verified_at ? (
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Email Verificado</p>
                                    <p className="text-base">{new Date(user.email_verified_at).toLocaleDateString('pt-BR')}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Email Verificado</p>
                                    <p className="text-muted-foreground text-base">Não verificado</p>
                                </div>
                            )}
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Criado em</p>
                                <p className="text-base">{user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Última atualização</p>
                                <p className="text-base">{user.updated_at ? new Date(user.updated_at).toLocaleDateString('pt-BR') : '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {user.user_notes && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Notas</CardTitle>
                                <CardDescription>Informações adicionais sobre o usuário</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-base whitespace-pre-wrap">{user.user_notes}</p>
                            </CardContent>
                        </Card>
                    )}

                    {user.permissions && user.permissions.length > 0 && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Permissões Diretas</CardTitle>
                                <CardDescription>Permissões atribuídas diretamente ao usuário (além das do cargo)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {user.permissions.map((permission) => (
                                        <Badge key={permission.name} variant="soft">
                                            {permission.label || permission.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
