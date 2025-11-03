import { Permission, Role, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { auth } = usePage<SharedData>().props;

    const user = auth?.user;

    if (!user) return { hasPermission: () => false, hasRole: () => false };

    // Extrair nomes de permissions (pode ser array de strings ou objetos Permission)
    const authPermissions = auth?.permissions || [];
    const permissionsNames: string[] = authPermissions.map((p: string | Permission) => 
        typeof p === 'string' ? p : p.name
    );

    // Extrair nomes de roles (pode ser array de strings ou objetos Role)
    const authRoles = auth?.roles || [];
    const rolesNames: string[] = authRoles.map((r: string | Role) => 
        typeof r === 'string' ? r : r.name
    );

    // Fallback: se não estiver no auth, tentar do user
    const userPermissionsNames = permissionsNames.length > 0 
        ? permissionsNames 
        : (user.permissions || []).map((p: Permission) => p.name);
    
    const userRolesNames = rolesNames.length > 0 
        ? rolesNames 
        : (user.role ? [user.role.name] : []);

    const userRolesSet = new Set(userRolesNames);
    const userPermissionsSet = new Set(userPermissionsNames);

    const hasRole = (role: string) => userRolesSet.has(role);
    const hasPermission = (permission: string) => userPermissionsSet.has(permission);

    return { hasRole, hasPermission };
}
