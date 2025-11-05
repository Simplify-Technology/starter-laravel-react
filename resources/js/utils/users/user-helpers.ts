import { User } from '@/types';

/**
 * Utilitários específicos para manipulação de dados de usuários
 */

/**
 * Obtém as iniciais de um nome
 * Usa o hook useInitials quando disponível, senão usa função utilitária
 */
export function getUserInitials(name: string): string {
    const names = name.trim().split(' ');

    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();

    const firstInitial = names[0].charAt(0);
    const lastInitial = names[names.length - 1].charAt(0);

    return `${firstInitial}${lastInitial}`.toUpperCase();
}

/**
 * Valida se um usuário tem dados mínimos necessários
 */
export function isValidUser(user: User | null | undefined): user is User {
    return user !== null && user !== undefined && !!user.id && !!user.name;
}

/**
 * Formata dados de usuário para exibição
 */
export function formatUserDisplayName(user: User): string {
    return user.name || user.email || 'Usuário sem nome';
}

/**
 * Verifica se um usuário tem cargo atribuído
 */
export function hasRole(user: User): boolean {
    return !!user.role && !!user.role.name;
}

/**
 * Obtém o label do cargo do usuário ou retorna fallback
 */
export function getUserRoleLabel(user: User, fallback: string = 'Sem cargo'): string {
    return user.role?.label || user.role?.name || fallback;
}

/**
 * Verifica se um usuário está ativo
 */
export function isUserActive(user: User): boolean {
    return user.is_active === true;
}

/**
 * Obtém email do usuário ou retorna fallback
 */
export function getUserEmail(user: User, fallback: string = '-'): string {
    return user.email || fallback;
}

/**
 * Obtém telefone/celular do usuário ou retorna fallback
 */
export function getUserPhone(user: User, fallback: string = '-'): string {
    return user.mobile || user.phone || fallback;
}

/**
 * Verifica se o usuário tem permissões customizadas
 */
export function hasCustomPermissions(user: User): boolean {
    const userWithPermissions = user as User & {
        custom_permissions_list?: Array<{ name: string; label: string }>;
    };
    return !!userWithPermissions.custom_permissions_list?.length;
}

/**
 * Obtém lista de permissões customizadas do usuário
 */
export function getCustomPermissions(user: User): Array<{ name: string; label: string }> {
    const userWithPermissions = user as User & {
        custom_permissions_list?: Array<{ name: string; label: string }>;
    };
    return userWithPermissions.custom_permissions_list || [];
}
