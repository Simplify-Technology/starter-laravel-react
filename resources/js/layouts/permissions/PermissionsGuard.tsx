import { usePermissions } from '@/hooks/use-permissions';
import { PermissionGuardProps } from '@/types';

export function PermissionGuard({ permission = '', role = '', children }: PermissionGuardProps) {
    const { hasPermission, hasRole } = usePermissions();

    if (!hasPermission(permission)) return null;
    if (!hasRole(role)) return null;

    return <>{children}</>;
}
