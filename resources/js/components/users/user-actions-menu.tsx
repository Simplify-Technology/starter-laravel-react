import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { UserActionsMenuProps } from '@/types/users';
import { Link } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Plus, Trash2, UserCheck, UserCog, UserX } from 'lucide-react';

/**
 * Componente de menu de ações para usuários
 * Dropdown com todas as ações possíveis baseadas em permissões
 */
export function UserActionsMenu({
    user,
    onDelete,
    onToggleActive,
    onImpersonate,
    onAssignRole,
    onRevokeRole,
    onAddPermission,
    canDelete,
    canEdit,
    canImpersonate,
    canManagePermissions,
    canAssignRoles,
    isDeleting = false,
}: UserActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Mais opções para ${user.name}`}
                    className={cn(
                        'h-8 w-8 transition-all duration-200 ease-in-out',
                        'hover:bg-muted/60 hover:text-primary hover:scale-105 active:scale-95',
                        'dark:hover:bg-muted/40 dark:hover:text-primary',
                        '[&_svg]:h-4 [&_svg]:w-4',
                        '[&_svg]:text-muted-foreground dark:[&_svg]:text-muted-foreground/70',
                        'hover:[&_svg]:text-primary dark:hover:[&_svg]:text-secondary-foreground/80',
                        '[&_svg]:transition-all [&_svg]:duration-200 hover:[&_svg]:scale-110',
                    )}
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

                {canManagePermissions && (
                    <>
                        {canEdit && (
                            <DropdownMenuItem asChild>
                                <Link href={route('users.edit', user.id)} className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Link>
                            </DropdownMenuItem>
                        )}

                        {canManagePermissions && (
                            <DropdownMenuItem onClick={() => onAddPermission?.(user)} className="cursor-pointer">
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Permissão
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        {canAssignRoles && (
                            <DropdownMenuItem onClick={() => onAssignRole?.(user)} className="cursor-pointer">
                                <UserCheck className="mr-2 h-4 w-4" />
                                Atribuir Cargo
                            </DropdownMenuItem>
                        )}

                        {canAssignRoles && onRevokeRole && (
                            <DropdownMenuItem onClick={() => onRevokeRole(user)} className="text-destructive focus:text-destructive cursor-pointer">
                                <UserX className="mr-2 h-4 w-4" />
                                Remover Cargo
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        {canImpersonate(user) && (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    onImpersonate?.(user);
                                }}
                                className="cursor-pointer"
                            >
                                <UserCog className="mr-2 h-4 w-4" />
                                Personificar
                            </DropdownMenuItem>
                        )}

                        {canManagePermissions && onToggleActive && (
                            <DropdownMenuItem
                                onClick={() => onToggleActive(user)}
                                className={cn(
                                    'cursor-pointer',
                                    user.is_active ? 'text-red-600 focus:text-red-600' : 'text-green-600 focus:text-green-600',
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

                        {canManagePermissions && canDelete(user) && onDelete && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onDelete(user);
                                    }}
                                    disabled={isDeleting}
                                    className="text-destructive focus:text-destructive cursor-pointer disabled:opacity-50"
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
    );
}
