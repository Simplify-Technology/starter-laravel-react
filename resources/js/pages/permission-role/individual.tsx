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
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
  AlertCircle,
  Eye,
  MoreHorizontal,
  Search,
  Shield,
  User as UserIcon
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Permissões', href: '/permissions' },
  { title: 'Individuais', href: '/permissions/individual' }
];

type IndividualPermissionsProps = {
  users: User[];
};

export default function IndividualPermissions({ users }: IndividualPermissionsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRevokePermission = (userId: number, permissionName: string) => {
    if (confirm('Tem certeza que deseja revogar esta permissão?')) {
      router.delete(route('users.permissions.revoke', { user: userId, permission: permissionName }));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissões Individuais" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Permissões Individuais</h1>
            <p className="text-muted-foreground">Gerencie permissões específicas concedidas a usuários</p>
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
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários com Permissões Especiais</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Permissões Concedidas</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.reduce((total, user) => total + user.custom_permissions_count, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Impersonate</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u =>
                  u.custom_permissions_list.some(p => p.name === 'impersonate_users')
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários com Permissões Individuais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Permissões Individuais</TableHead>
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
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
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
                          <div className="flex flex-wrap gap-1">
                            {user.custom_permissions_list.length > 0 ? (
                              user.custom_permissions_list.map((permission) => (
                                <Badge
                                  key={permission.name}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {permission.label}
                                  {permission.meta?.can_impersonate_any && (
                                    <span className="ml-1 text-amber-600">(Qualquer)</span>
                                  )}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">Nenhuma</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Navigate to user details or permissions management
                                router.visit(route('users'));
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  router.visit(route('users'));
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Usuário
                                </DropdownMenuItem>

                                {user.custom_permissions_list.map((permission) => (
                                  <DropdownMenuItem
                                    key={permission.name}
                                    onClick={() => handleRevokePermission(user.id, permission.name)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Revogar {permission.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <EmptyState
                          title="Nenhum usuário com permissões individuais encontrado"
                          icon={Shield}
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
      </div>
    </AppLayout>
  );
}
