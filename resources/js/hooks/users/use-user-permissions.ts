import { usePermissions } from '@/hooks/use-permissions';
import type { SharedData } from '@/types';
import type { User, UserPermissionChecks } from '@/types/users';
import { getUserPermissionChecks } from '@/utils/users/permissions';
import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';

/**
 * Hook para verificações de permissões específicas de usuários
 * Centraliza lógica de segurança e validações
 */
export function useUserPermissions() {
    const { auth } = usePage<SharedData>().props;
    const { hasPermission, hasRole } = usePermissions();

    const currentUserId = auth.user.id;

    const canDeleteUser = useCallback(
        (user: User) => {
            if (!hasPermission('manage_users')) {
                return false;
            }
            // Não pode deletar super_user
            if (user.role?.name === 'super_user') {
                return false;
            }
            // Não pode deletar a si mesmo
            if (user.id === auth.user.id) {
                return false;
            }
            return true;
        },
        [hasPermission, auth.user.id],
    );

    const canEdit = useCallback(() => {
        return hasPermission('manage_users');
    }, [hasPermission]);

    const canImpersonate = useCallback(
        (user: User) => {
            if (!hasPermission('impersonate_users')) {
                return false;
            }
            const userWithImpersonate = user as User & { can_impersonate?: boolean };
            if (!userWithImpersonate.can_impersonate) {
                return false;
            }
            if (user.id === auth.user.id) {
                return false;
            }
            return true;
        },
        [hasPermission, auth.user.id],
    );

    const canManagePermissions = useCallback(() => {
        return hasPermission('manage_users');
    }, [hasPermission]);

    const canAssignRoles = useCallback(() => {
        return hasPermission('assign_roles');
    }, [hasPermission]);

    const canView = useCallback(() => {
        return hasPermission('viewAny');
    }, [hasPermission]);

    const getUserChecks = useCallback(
        (user: User): UserPermissionChecks => {
            return getUserPermissionChecks(user, {
                currentUserId,
                hasPermission,
                hasRole,
            });
        },
        [currentUserId, hasPermission, hasRole],
    );

    return {
        canDeleteUser,
        canEdit,
        canImpersonate,
        canManagePermissions,
        canAssignRoles,
        canView,
        getUserChecks,
    };
}
