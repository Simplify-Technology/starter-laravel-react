<?php

namespace Database\Seeders;

use App\Enum\Permissions;
use App\Enum\Roles;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [];

        foreach (Roles::cases() as $role) {
            $roles[$role->value] = Role::updateOrCreate(
                ['name' => $role->value],
                ['label' => $role->label()]
            );
        }

        $permissions = [];

        foreach (Permissions::cases() as $permission) {
            $permissions[$permission->value] = Permission::updateOrCreate(
                ['name' => $permission->value],
                ['label' => $permission->label()]
            );
        }

        $rolePermissions = [
            Roles::SUPER_USER->value => array_keys($permissions),
            Roles::ADMIN->value      => [
                Permissions::VIEW_DASHBOARD->value,
                Permissions::MANAGE_USERS->value,
                Permissions::ASSIGN_ROLES->value,
                Permissions::MANAGE_ROLES->value,
                Permissions::GRANT_PERMISSIONS->value,
                Permissions::REVOKE_PERMISSIONS->value,
                Permissions::EDIT_SETTINGS->value,
                Permissions::UPDATE_SYSTEM->value,
                Permissions::VIEW_REPORTS->value,
                Permissions::GENERATE_REPORTS->value,
                Permissions::EXPORT_DATA->value,
                Permissions::DELETE_REPORTS->value,
                Permissions::SCHEDULE_REPORTS->value,
                Permissions::MANAGE_BILLING->value,
                Permissions::VIEW_BILLING->value,
                Permissions::MANAGE_SUPPORT->value,
                Permissions::ACCESS_LOGS->value,
                Permissions::CLEAR_CACHE->value,
            ],
            Roles::MANAGER->value => [
                Permissions::VIEW_DASHBOARD->value,
                Permissions::MANAGE_USERS->value,
                Permissions::VIEW_REPORTS->value,
                Permissions::EXPORT_DATA->value,
                Permissions::MANAGE_CLIENTS->value,
                Permissions::GENERATE_REPORTS->value,
                Permissions::SCHEDULE_REPORTS->value,
            ],
            Roles::OWNER->value => [
                Permissions::VIEW_DASHBOARD->value,
                Permissions::MANAGE_CLIENTS->value,
                Permissions::MANAGE_BILLING->value,
                Permissions::VIEW_REPORTS->value,
            ],
            Roles::EDITOR->value => [
                Permissions::VIEW_DASHBOARD->value,
            ],
            Roles::VIEWER->value => [
                Permissions::VIEW_DASHBOARD->value,
                Permissions::VIEW_REPORTS->value,
                Permissions::VIEW_CLIENTS->value,
            ],
            Roles::VISITOR->value => [
                Permissions::VIEW_DASHBOARD->value,
            ],
        ];

        foreach ($rolePermissions as $role => $perms) {
            $roles[$role]->permissions()->sync(array_map(fn($perm) => $permissions[$perm]->id, $perms));
        }
    }
}
