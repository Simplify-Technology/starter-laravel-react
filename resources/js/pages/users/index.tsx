import { AddPermissionDialog } from '@/components/add-permission-dialog';
import AssignRoleUser from '@/components/assign-role-user';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { EmptyState } from '@/components/empty-state';
import { InfoFeatureList, InfoSection } from '@/components/page-info';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterPanel } from '@/components/users/filter-panel';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Role, type SharedData, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Table } from '@radix-ui/themes';
import {
    CheckCircle,
    Edit,
    Eye,
    EyeOff,
    Filter,
    Info,
    Mail,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Shield,
    SlidersHorizontal,
    Sparkles,
    Trash2,
    User2,
    UserCheck,
    UserCog,
    UserPlus,
    Users as UsersIcon,
    UserX,
    X,
    Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Usuários', href: '/users' }];

type UsersProps = {
    users: User[];
    roles: Role[];
    assignableRoles?: Role[];
    filters?: {
        search?: string;
        role_id?: number;
        is_active?: boolean | string;
        sort_by?: string;
        sort_order?: string;
    };
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ users, roles, assignableRoles = [], filters = {}, pagination }: UsersProps) {
    const { auth } = usePage<SharedData>().props;
    useFlashMessages();

    // State
    const [showFilters, setShowFilters] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAddPermissionDialog, setShowAddPermissionDialog] = useState(false);
    const [showAssignRoleDialog, setShowAssignRoleDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { hasPermission } = usePermissions();

    // Local search state for debounced input
    const [localSearch, setLocalSearch] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialMount = useRef(true);

    // Sync localSearch with filters.search when it changes from backend (but not on initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Only sync if the filter changed externally (from backend) and we're not currently searching
        if (filters.search !== localSearch && !isSearching) {
            setLocalSearch(filters.search || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    // Debounced search effect - only triggers when user types
    useEffect(() => {
        // Skip initial mount and if search matches current filter
        if (isInitialMount.current || localSearch === (filters.search || '')) {
            return;
        }

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(() => {
            const params: Record<string, string | number | boolean | undefined> = {};

            // Copy existing filters but only if they have values
            if (filters.role_id) params.role_id = filters.role_id;
            if (filters.is_active !== undefined && filters.is_active !== '' && filters.is_active !== null) {
                params.is_active = filters.is_active;
            }
            if (filters.sort_by) params.sort_by = filters.sort_by;
            if (filters.sort_order) params.sort_order = filters.sort_order;

            // Add search if it has a value
            if (localSearch.trim()) {
                params.search = localSearch.trim();
            }

            router.get(route('users.index'), params, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            });
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localSearch]);

    const handleFilterChange = useCallback(
        (key: string, value: string | number | boolean | undefined) => {
            const params: Record<string, string | number | boolean | undefined> = {};

            // Copy existing filters but only if they have values AND are not the filter being changed
            if (key !== 'search' && filters.search) params.search = filters.search;
            if (key !== 'role_id' && filters.role_id) params.role_id = filters.role_id;
            if (key !== 'is_active' && filters.is_active !== undefined && filters.is_active !== '') {
                params.is_active = filters.is_active;
            }
            if (key !== 'sort_by' && filters.sort_by) params.sort_by = filters.sort_by;
            if (key !== 'sort_order' && filters.sort_order) params.sort_order = filters.sort_order;

            // Update the changed filter (only add if it has a valid value)
            if (value !== 'all' && value !== '' && value !== undefined && value !== null) {
                params[key] = value;
            }
            // If value is undefined/null/empty and it's being cleared, it won't be added to params

            router.get(route('users.index'), params, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [filters],
    );

    const clearFilters = useCallback(() => {
        router.get(
            route('users.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
        setLocalSearch('');
    }, []);

    const clearSingleFilter = useCallback(
        (key: string) => {
            handleFilterChange(key, undefined);
        },
        [handleFilterChange],
    );

    // Ref for the search container
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Focus the search input when the search icon is clicked
    const focusSearchInput = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        const inputElement = searchContainerRef.current?.querySelector('input');
        if (inputElement) {
            inputElement.focus();
        }
    }, []);

    // Handle Escape key to clear the search input
    const handleSearchKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Escape' && localSearch) {
                e.preventDefault();
                setLocalSearch('');
                handleFilterChange('search', '');
            }
        },
        [localSearch, handleFilterChange],
    );

    const handleDelete = useCallback(() => {
        if (!userToDelete) return;

        setIsDeleting(true);
        router.delete(route('users.destroy', userToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteDialog(false);
                setUserToDelete(null);
            },
            onError: () => {
                setIsDeleting(false);
            },
            onFinish: () => setIsDeleting(false),
        });
    }, [userToDelete]);

    const canDeleteUser = useCallback(
        (user: User) => {
            // Cannot delete super_user
            if (user.role?.name === 'super_user') {
                return false;
            }
            // Cannot delete self
            if (user.id === auth.user.id) {
                return false;
            }
            return true;
        },
        [auth.user.id],
    );

    const handleToggleActive = useCallback((user: User) => {
        router.patch(
            route('users.toggle-active', user.id),
            {},
            {
                preserveScroll: true,
            },
        );
    }, []);

    const handleImpersonate = useCallback((user: User) => {
        router.post(route('users.impersonate', user.id), {});
    }, []);

    const handleAddPermission = useCallback((user: User) => {
        setSelectedUser(user);
        setShowAddPermissionDialog(true);
    }, []);

    const handleAssignRole = useCallback((user: User) => {
        setSelectedUser(user);
        setShowAssignRoleDialog(true);
    }, []);

    const handleRevokeRole = useCallback((user: User) => {
        if (!confirm('Tem certeza que deseja remover o cargo deste usuário?')) {
            return;
        }

        router.delete(route('user.revoke-role', user.id), {
            preserveScroll: true,
        });
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            const params: Record<string, string | number | boolean | undefined> = {};

            // Copy existing filters but only if they have values
            if (filters.search) params.search = filters.search;
            if (filters.role_id) params.role_id = filters.role_id;
            if (filters.is_active !== undefined && filters.is_active !== '' && filters.is_active !== null) {
                params.is_active = filters.is_active;
            }
            if (filters.sort_by) params.sort_by = filters.sort_by;
            if (filters.sort_order) params.sort_order = filters.sort_order;

            params.page = page;

            router.get(route('users.index'), params, {
                preserveState: true,
                preserveScroll: false,
            });
        },
        [filters],
    );

    // Memoized user initials
    const getUserInitials = useCallback((name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gerenciamento de Usuários" />
            <div className="flex h-full flex-1 flex-col gap-3 p-4 md:gap-4 md:p-6">
                {/* Data Table with Integrated Filters */}
                <div className="bg-card border-secondary-foreground/15 rounded-lg border shadow-sm">
                    {/* Table Header with Search and Filter Toggle */}
                    <div className="bg-muted/30 border-secondary-foreground/15 border-b">
                        <div className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <UserPlus className="h-3.5 w-3.5 text-cyan-600" />
                                <h2 className="text-sm font-semibold">Usuários</h2>
                                <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-accent/50 dark:hover:bg-accent/20 hover:text-primary dark:hover:text-primary/90 h-6 w-6 cursor-pointer transition-colors"
                                        >
                                            <Info className="text-muted-foreground dark:text-muted-foreground/80 h-3.5 w-3.5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                                                    <UsersIcon className="h-5 w-5 text-white" />
                                                </div>
                                                Informações sobre Usuários
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <InfoSection title="Visão Geral" icon={UsersIcon} iconColor="text-cyan-600">
                                                <p>
                                                    O módulo de Usuários centraliza o gerenciamento de todas as contas da plataforma, permitindo
                                                    cadastro, edição, vinculação com cargos e controle de permissões.
                                                </p>
                                            </InfoSection>
                                            <InfoSection title="Funcionalidades Principais" icon={Sparkles} iconColor="text-purple-600">
                                                <InfoFeatureList
                                                    features={[
                                                        { label: 'Cadastro individual de usuários com dados completos' },
                                                        { label: 'Gestão de perfis de acesso e permissões' },
                                                        { label: 'Ativação/desativação de contas' },
                                                        { label: 'Histórico de atividades e auditoria', badge: 'Auditoria' },
                                                        { label: 'Busca e filtros avançados' },
                                                        { label: 'Paginação eficiente para grandes volumes' },
                                                    ]}
                                                />
                                            </InfoSection>
                                            <InfoSection title="Filtros e Busca" icon={Filter} iconColor="text-orange-600">
                                                <InfoFeatureList
                                                    features={[
                                                        { label: 'Busca textual - Pesquise por nome ou email' },
                                                        { label: 'Filtro por Cargo - Visualize usuários por perfil' },
                                                        { label: 'Filtro por Status - Ativo ou Inativo' },
                                                        { label: 'Ordenação por colunas' },
                                                    ]}
                                                />
                                            </InfoSection>
                                            <InfoSection title="Perfis de Acesso" icon={Shield} iconColor="text-red-600">
                                                <InfoFeatureList
                                                    features={[
                                                        { label: 'Super User - Acesso total ao sistema', badge: 'Máximo' },
                                                        { label: 'Admin - Gerencia usuários e configurações', badge: 'Gestão' },
                                                        { label: 'Manager - Acesso intermediário', badge: 'Intermediário' },
                                                        { label: 'Outros perfis - Permissões customizadas', badge: 'Customizado' },
                                                    ]}
                                                />
                                            </InfoSection>
                                            <InfoSection title="Dicas de Uso" icon={Zap} iconColor="text-yellow-600">
                                                <ul className="space-y-1.5 text-sm">
                                                    <li>• A busca é instantânea e procura em nome e email simultaneamente</li>
                                                    <li>• Combine filtros de cargo e status para segmentar usuários</li>
                                                    <li>• Ao editar, você pode alterar cargo e permissões vinculadas</li>
                                                    <li>• Usuários inativos não conseguem fazer login na plataforma</li>
                                                    <li>• Use os ícones de ação rápida na tabela para operações frequentes</li>
                                                </ul>
                                            </InfoSection>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <span className="text-muted-foreground text-xs">• {pagination.total.toLocaleString('pt-BR')} registros</span>
                                {/* Search Input - Always Visible */}
                                <div ref={searchContainerRef} className="relative ms-4 flex-1 sm:w-64">
                                    <Input
                                        id="search"
                                        type="search"
                                        placeholder="Buscar nome ou email"
                                        className="border-secondary-foreground/20 h-8 pr-8 pl-9 text-xs"
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        aria-label="Pesquisar usuários"
                                    />
                                    <div
                                        className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer"
                                        onClick={focusSearchInput}
                                        role="button"
                                        aria-label="Focar busca"
                                    >
                                        <Search className="text-muted-foreground h-3.5 w-3.5" />
                                    </div>
                                    {localSearch && (
                                        <button
                                            type="button"
                                            className="hover:bg-muted absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-0.5 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setLocalSearch('');
                                                clearSingleFilter('search');
                                            }}
                                            aria-label="Limpar busca"
                                        >
                                            <X className="text-muted-foreground hover:text-foreground h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    {isSearching && !localSearch && (
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                            <div className="border-primary h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Filter Toggle Button */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all',
                                        showFilters
                                            ? 'bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/40 dark:hover:bg-primary/50 dark:text-white dark:shadow-sm'
                                            : 'text-foreground/70 hover:bg-muted/60 hover:text-foreground dark:text-foreground/90 dark:hover:bg-muted/60 dark:border-border/50 dark:border dark:hover:text-white',
                                    )}
                                    aria-label="Filtros avançados"
                                    aria-pressed={showFilters}
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    {showFilters ? 'Ocultar' : 'Filtros'}
                                </button>

                                {/* New User Button */}
                                <Link href={route('users.create')}>
                                    <Button
                                        size="sm"
                                        className={cn(
                                            'h-8 gap-1.5',
                                            'dark:bg-primary dark:text-white dark:shadow-lg',
                                            'dark:hover:bg-primary/80 dark:hover:shadow-xl',
                                            'dark:border-0',
                                        )}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Novo Usuário
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {/* Advanced Filters Panel - Collapsible */}
                        {showFilters && (
                            <div className="animate-in fade-in-50 duration-200">
                                <FilterPanel
                                    filters={filters}
                                    roles={roles}
                                    isSearching={isSearching}
                                    onFilterChange={handleFilterChange}
                                    onClearFilters={clearFilters}
                                    onClearSingleFilter={clearSingleFilter}
                                />
                            </div>
                        )}
                    </div>

                    {/* Table Content */}
                    <div className="p-3">
                <Table.Root variant="surface">
                    <Table.Header>
                                <Table.Row className="bg-muted/30">
                                    <Table.ColumnHeaderCell className="text-xs font-semibold">
                                        <div className="flex items-center gap-1.5">
                                            <User2 className="h-4 w-4 text-blue-600" />
                                            Nome
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="text-xs font-semibold">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="h-4 w-4 text-purple-600" />
                                            Email
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="text-xs font-semibold">
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-4 w-4 text-green-600" />
                                            Celular
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="text-xs font-semibold">
                                        <div className="flex items-center gap-1.5">
                                            <Shield className="h-4 w-4 text-orange-600" />
                                            Cargo
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="text-xs font-semibold">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            Status
                                        </div>
                                    </Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="text-end text-xs font-semibold">Ações</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <Table.Row
                                            key={user.id}
                                            className={cn(
                                                'hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors',
                                                index % 2 === 0 && 'bg-muted/5 dark:bg-muted/5',
                                            )}
                                        >
                                            <Table.RowHeaderCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-semibold text-white shadow-sm">
                                                        {getUserInitials(user.name)}
                                                    </div>
                                                    <div className="text-sm font-medium">{user.name}</div>
                                                </div>
                                            </Table.RowHeaderCell>
                                            <Table.Cell>
                                                <div className="text-sm">{user.email}</div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="text-sm">{user.mobile || '-'}</div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="text-sm">{user.role?.label || user.role?.name || '-'}</div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.is_active ? (
                                                    <Badge
                                                        variant="default"
                                                        className="bg-green-100 text-green-900 dark:bg-green-400/10 dark:text-green-300"
                                                    >
                                                        <Eye className="mr-1 h-3 w-3" />
                                                        Ativo
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                                        <EyeOff className="mr-1 h-3 w-3" />
                                                        Inativo
                                                    </Badge>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Ver Detalhes - Botão visível (ação mais utilizada) */}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={route('users.show', user.id)}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    aria-label="Ver detalhes"
                                                                    className="hover:bg-muted/60 hover:text-primary dark:hover:bg-muted/40 dark:hover:text-primary [&_svg]:text-muted-foreground dark:[&_svg]:text-muted-foreground/70 hover:[&_svg]:text-primary dark:hover:[&_svg]:text-secondary-foreground/80 transition-colors"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Detalhes</TooltipContent>
                                                    </Tooltip>

                                                    {/* Dropdown Menu - Ações menos utilizadas */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                aria-label="Mais opções"
                                                                className="hover:bg-muted/60 hover:text-primary dark:hover:bg-muted/40 dark:hover:text-primary [&_svg]:text-muted-foreground dark:[&_svg]:text-muted-foreground/70 hover:[&_svg]:text-primary dark:hover:[&_svg]:text-secondary-foreground/80 transition-colors"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('users.show', user.id)} className="cursor-pointer">
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Detalhes
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            {hasPermission('manage_users') && (
                                                                <>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={route('users.edit', user.id)} className="cursor-pointer">
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            Editar
                                                                        </Link>
                                                                    </DropdownMenuItem>

                                                                    {hasPermission('manage_users') && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleAddPermission(user)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Plus className="mr-2 h-4 w-4" />
                                                                            Adicionar Permissão
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    <DropdownMenuSeparator />

                                                                    {hasPermission('assign_roles') && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleAssignRole(user)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                                            Atribuir Cargo
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {hasPermission('assign_roles') && auth.user.id !== user.id && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleRevokeRole(user)}
                                                                            className="cursor-pointer text-destructive focus:text-destructive"
                                                                        >
                                                                            <UserX className="mr-2 h-4 w-4" />
                                                                            Remover Cargo
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    <DropdownMenuSeparator />

                                                                    {(user as User & { can_impersonate?: boolean }).can_impersonate && (
                                                                        <DropdownMenuItem
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleImpersonate(user);
                                                                            }}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <UserCog className="mr-2 h-4 w-4" />
                                                                            Personificar
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {hasPermission('manage_users') && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleToggleActive(user)}
                                                                            className={cn(
                                                                                'cursor-pointer',
                                                                                user.is_active ? 'text-red-600 focus:text-red-600' : 'text-green-600 focus:text-green-600'
                                                                            )}
                                                                        >
                                                                            {user.is_active ? (
                                                                                <>
                                                                                    <UserX className="mr-2 h-4 w-4" />
                                                                                    Desativar
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                                    Ativar
                                                                                </>
                                                                            )}
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {hasPermission('manage_users') && canDeleteUser(user) && (
                                                                        <>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setUserToDelete(user);
                                                                                    setShowDeleteDialog(true);
                                                                                }}
                                                                                disabled={isDeleting}
                                                                                className="cursor-pointer text-destructive focus:text-destructive disabled:opacity-50"
                                                                            >
                                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                                Excluir
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                                    <Table.Row>
                                        <Table.Cell colSpan={6}>
                                            <div className="flex items-center justify-center py-12">
                                                <EmptyState
                                                    title={
                                                        filters.search || filters.role_id !== undefined || filters.is_active !== undefined
                                                            ? 'Nenhum usuário encontrado com os filtros aplicados'
                                                            : 'Nenhum usuário encontrado'
                                                    }
                                                    description={
                                                        filters.search || filters.role_id !== undefined || filters.is_active !== undefined
                                                            ? 'Tente ajustar os critérios de busca ou limpar os filtros'
                                                            : 'Não há usuários cadastrados no sistema'
                                                    }
                                                    icon={User2}
                                                    type={'row'}
                                                />
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                        )}
                    </Table.Body>
                </Table.Root>
            </div>
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Mostrando {((pagination.current_page - 1) * pagination.per_page + 1).toLocaleString('pt-BR')} até{' '}
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total).toLocaleString('pt-BR')} de{' '}
                            {pagination.total.toLocaleString('pt-BR')} usuários
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                            >
                                Anterior
                            </Button>
                            <span className="flex items-center px-4 text-sm">
                                Página {pagination.current_page} de {pagination.last_page}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                            >
                                Próxima
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDelete}
                title="Excluir Usuário"
                description="Tem certeza que deseja remover este usuário permanentemente da plataforma?"
                itemName={userToDelete?.name}
                itemType="Usuário"
                icon={User2}
                details={
                    userToDelete
                        ? [
                              { label: 'Email', value: userToDelete.email, icon: Mail },
                              { label: 'Cargo', value: userToDelete.role?.label || 'Não definido', icon: Shield },
                          ]
                        : []
                }
                warnings={[
                    {
                        message: 'Todo o histórico de atividades deste usuário será permanentemente removido.',
                        severity: 'danger',
                    },
                    {
                        message: 'O usuário perderá acesso imediato à plataforma e não poderá fazer login.',
                        severity: 'warning',
                    },
                ]}
                variant="danger"
                processing={isDeleting}
            />

            {/* Add Permission Dialog */}
            {selectedUser && (
                <AddPermissionDialog
                    open={showAddPermissionDialog}
                    onOpenChange={(open) => {
                        setShowAddPermissionDialog(open);
                        if (!open) {
                            setSelectedUser(null);
                        }
                    }}
                    user={{
                        id: selectedUser.id,
                        name: selectedUser.name,
                        custom_permissions_list: (selectedUser as User & { custom_permissions_list?: Array<{ name: string; label: string; meta?: { can_impersonate_any?: boolean } }> }).custom_permissions_list || [],
                    }}
                />
            )}

            {/* Assign Role Dialog */}
            {selectedUser && showAssignRoleDialog && (
                <AssignRoleUser
                    userId={selectedUser.id}
                    roles={assignableRoles.length > 0 ? assignableRoles : roles}
                    currentRole={selectedUser.role?.name || undefined}
                    currentRoleLabel={selectedUser.role?.label || undefined}
                    onClose={() => {
                        setShowAssignRoleDialog(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </AppLayout>
    );
}
