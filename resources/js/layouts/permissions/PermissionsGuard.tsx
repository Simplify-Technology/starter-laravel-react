import { usePermissions } from '@/hooks/use-permissions';
import { PermissionGuardProps } from '@/types';

export function PermissionGuard({ permission = '', role = '', children }: PermissionGuardProps) {
    const { hasPermission, hasRole } = usePermissions();

    if (permission && !hasPermission(permission)) return null;
    if (role && !hasRole(role)) return null;

    return <>{children}</>;
}
