import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { auth } = usePage<SharedData>().props;

    const user = auth?.user;

    if (!user) return { hasPermission: () => false, hasRole: () => false };

    const userRoles = new Set((user.roles || []).map((role) => role.name));
    const userPermissions = new Set((user.permissions || []).map((permission) => permission.name));

    const hasRole = (role: string) => userRoles.has(role);
    const hasPermission = (permission: string) => userPermissions.has(permission);

    return { hasRole, hasPermission };
}
