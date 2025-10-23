import { AddPermissionDialog } from '@/components/add-permission-dialog';
import { EmptyState } from '@/components/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { UserDetailsDialog } from '@/components/user-details-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Shield,
    User2,
    UserCheck
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Usuários', href: '/users' }];

type UsersProps = {
    users: User[];
    can_manage_permissions: boolean;
};

export default function Index({ users, can_manage_permissions }: UsersProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showAddPermission, setShowAddPermission] = useState(false);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setShowUserDetails(true);
    };

    const handleAddPermission = (user: User) => {
        setSelectedUser(user);
        setShowAddPermission(true);
    };

    const handleImpersonate = (user: User) => {
        router.post(route('users.impersonate', user.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciamento de Usuários" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header with Search and Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
                        <p className="text-muted-foreground">Gerencie usuários e suas permissões</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar usuários..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filtros
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                            <User2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.filter(u => u.is_active).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Com Permissões Especiais</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.filter(u => u.custom_permissions_count > 0).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Usuários</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Papel</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Permissões</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div className="font-semibold">{user.name}</div>
                                                        {user.cpf_cnpj && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {user.cpf_cnpj}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    {user.role ? (
                                                        <Badge variant="outline">
                                                            {user.role.label}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">Sem papel</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.is_active ? "default" : "secondary"}>
                                                        {user.is_active ? "Ativo" : "Inativo"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {user.custom_permissions_count > 0 ? (
                                                            <Badge variant="secondary">
                                                                {user.custom_permissions_count} especial{user.custom_permissions_count > 1 ? 'is' : ''}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">Apenas papel</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {/* Quick Action - View Details */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(user)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>

                                                        {/* Overflow Menu */}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Ver Detalhes
                                                                </DropdownMenuItem>

                                                                {user.can_impersonate && (
                                                                    <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                                                                        <UserCheck className="h-4 w-4 mr-2" />
                                                                        Personificar
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {can_manage_permissions && (
                                                                    <DropdownMenuItem onClick={() => handleAddPermission(user)}>
                                                                        <Plus className="h-4 w-4 mr-2" />
                                                                        Adicionar Permissão
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <EmptyState
                                                    title="Nenhum usuário encontrado"
                                                    icon={User2}
                                                    type="row"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Dialogs */}
                {selectedUser && (
                    <>
                        <UserDetailsDialog
                            open={showUserDetails}
                            onOpenChange={setShowUserDetails}
                            user={selectedUser}
                            canManagePermissions={can_manage_permissions}
                        />

                        <AddPermissionDialog
                            open={showAddPermission}
                            onOpenChange={setShowAddPermission}
                            user={selectedUser}
                        />
                    </>
                )}
            </div>
        </AppLayout>
    );
}
