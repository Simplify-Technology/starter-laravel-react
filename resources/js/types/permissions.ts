import { Permission, Role, User } from './index';

/**
 * Tipos relacionados ao módulo de Permissões
 */

export type RoleData = {
    id: number;
    label: string;
    permissions: Record<string, string>; // permission name -> permission label
    users: User[] | Record<number, User>; // Array ou objeto keyed por id
};

export type RolesData = Record<string, RoleData>; // role name -> role data

export type PermissionCardProps = {
    permission: Permission;
    isChecked: boolean;
    onToggle: (permissionName: string, checked: boolean) => void;
};

export type RoleUsersTableProps = {
    users: User[];
    roleLabel: string;
    assignableRoles?: Role[];
    onRevokeRole: (user: User) => void;
    canAssignRoles: boolean;
};

export type RoleInfoDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export type PermissionsPageProps = {
    roles: RolesData;
    assignableRoles?: Role[];
    permissions: Permission[];
};

export type PermissionActionHandlers = {
    onSavePermissions: (roleName: string, permissionNames: string[]) => Promise<void>;
    onAssignRole: (userId: number) => Promise<void>;
    onRevokeRole: (userId: number) => Promise<void>;
};
