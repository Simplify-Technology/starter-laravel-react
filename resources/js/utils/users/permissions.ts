import { User } from '@/types';
import { PERMISSION_ASSIGN_ROLES, PERMISSION_MANAGE_USERS, SUPER_USER_ROLE } from './constants';

/**
 * Utilitários para verificação de permissões específicas de usuários
 * Centraliza lógica de segurança e validações
 */

export type PermissionCheckContext = {
    currentUserId: number;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
};

/**
 * Verifica se um usuário pode ser deletado
 * Regras:
 * - Não pode deletar super_user
 * - Não pode deletar a si mesmo
 */
export function canDeleteUser(user: User, context: PermissionCheckContext): boolean {
    // Não pode deletar super_user
    if (user.role?.name === SUPER_USER_ROLE) {
        return false;
    }

    // Não pode deletar a si mesmo
    if (user.id === context.currentUserId) {
        return false;
    }

    return true;
}

/**
 * Verifica se um usuário pode ser editado
 */
export function canEditUser(user: User, context: PermissionCheckContext): boolean {
    if (!context.hasPermission(PERMISSION_MANAGE_USERS)) {
        return false;
    }

    // Não pode editar super_user (proteção adicional)
    if (user.role?.name === SUPER_USER_ROLE && !context.hasRole(SUPER_USER_ROLE)) {
        return false;
    }

    return true;
}

/**
 * Verifica se pode personificar um usuário
 */
export function canImpersonateUser(user: User, context: PermissionCheckContext): boolean {
    // Verifica se tem permissão de impersonate
    if (!context.hasPermission('impersonate_users')) {
        return false;
    }

    // Verifica se o usuário tem a flag can_impersonate
    const userWithImpersonate = user as User & { can_impersonate?: boolean };
    if (!userWithImpersonate.can_impersonate) {
        return false;
    }

    // Não pode personificar a si mesmo
    if (user.id === context.currentUserId) {
        return false;
    }

    return true;
}

/**
 * Verifica se pode atribuir cargo a um usuário
 */
export function canAssignRole(user: User, context: PermissionCheckContext): boolean {
    if (!context.hasPermission(PERMISSION_ASSIGN_ROLES)) {
        return false;
    }

    // Não pode atribuir cargo a si mesmo (proteção)
    if (user.id === context.currentUserId) {
        return false;
    }

    return true;
}

/**
 * Verifica se pode remover cargo de um usuário
 */
export function canRevokeRole(user: User, context: PermissionCheckContext): boolean {
    if (!context.hasPermission(PERMISSION_ASSIGN_ROLES)) {
        return false;
    }

    // Não pode remover cargo de si mesmo
    if (user.id === context.currentUserId) {
        return false;
    }

    // Não pode remover cargo de super_user (proteção adicional)
    if (user.role?.name === SUPER_USER_ROLE && !context.hasRole(SUPER_USER_ROLE)) {
        return false;
    }

    return true;
}

/**
 * Verifica se pode gerenciar permissões de um usuário
 */
export function canManageUserPermissions(user: User, context: PermissionCheckContext): boolean {
    if (!context.hasPermission(PERMISSION_MANAGE_USERS)) {
        return false;
    }

    // Não pode gerenciar permissões de super_user (proteção adicional)
    if (user.role?.name === SUPER_USER_ROLE && !context.hasRole(SUPER_USER_ROLE)) {
        return false;
    }

    return true;
}

/**
 * Verifica se pode ativar/desativar um usuário
 */
export function canToggleUserActive(user: User, context: PermissionCheckContext): boolean {
    if (!context.hasPermission(PERMISSION_MANAGE_USERS)) {
        return false;
    }

    // Não pode desativar a si mesmo
    if (user.id === context.currentUserId && user.is_active) {
        return false;
    }

    // Não pode ativar/desativar super_user (proteção adicional)
    if (user.role?.name === SUPER_USER_ROLE && !context.hasRole(SUPER_USER_ROLE)) {
        return false;
    }

    return true;
}

/**
 * Retorna todas as verificações de permissão para um usuário
 */
export function getUserPermissionChecks(user: User, context: PermissionCheckContext) {
    return {
        canDelete: (u: User) => canDeleteUser(u, context),
        canEdit: (u: User) => canEditUser(u, context),
        canImpersonate: (u: User) => canImpersonateUser(u, context),
        canManagePermissions: canManageUserPermissions(user, context),
        canAssignRoles: canAssignRole(user, context),
        canAssignRole: (u: User) => canAssignRole(u, context),
        canRevokeRole: (u: User) => canRevokeRole(u, context),
        canToggleActive: (u: User) => canToggleUserActive(u, context),
        canView: true,
    };
}
