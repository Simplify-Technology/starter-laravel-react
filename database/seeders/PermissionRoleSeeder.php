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

        // Cria/atualiza roles
        foreach (Roles::cases() as $role) {
            $roles[$role->value] = Role::updateOrCreate(
                ['name' => $role->value],
                ['label' => $role->label(), 'priority' => $role->priority()]
            );
        }

        $permissions = [];

        // Cria/atualiza permissions
        foreach (Permissions::cases() as $permission) {
            $permissions[$permission->value] = Permission::updateOrCreate(
                ['name' => $permission->value],
                ['label' => $permission->label()]
            );
        }

        $allPermissions = array_keys($permissions);

        $rolePermissions = [
            Roles::SUPER_USER->value => $allPermissions,
            Roles::ADMIN->value      => $allPermissions,

            Roles::OWNER->value => [
                Permissions::VIEW_DASHBOARD->value,
                Permissions::MANAGE_CLIENTS->value,
                Permissions::MANAGE_BILLING->value,
                Permissions::VIEW_REPORTS->value,
                Permissions::EXPORT_DATA->value,
                Permissions::GENERATE_REPORTS->value,
                Permissions::SCHEDULE_REPORTS->value,
                Permissions::ACCESS_LOGS->value,
                Permissions::CLEAR_CACHE->value,
                Permissions::EDIT_SETTINGS->value,
                Permissions::UPDATE_SYSTEM->value,
                Permissions::VIEW_CLIENTS->value,
                Permissions::VIEW_BILLING->value,
                Permissions::MANAGE_SUPPORT->value,
            ],

            Roles::MANAGER->value => [
                Permissions::VIEW_DASHBOARD->value,
                Permissions::MANAGE_USERS->value,
                Permissions::MANAGE_CLIENTS->value,
                Permissions::MANAGE_SUPPORT->value,
                Permissions::VIEW_REPORTS->value,
                Permissions::EXPORT_DATA->value,
                Permissions::GENERATE_REPORTS->value,
                Permissions::SCHEDULE_REPORTS->value,
                Permissions::VIEW_CLIENTS->value,
            ],

            Roles::EDITOR->value => [
                Permissions::VIEW_DASHBOARD->value,
                Permissions::VIEW_REPORTS->value,
                Permissions::VIEW_CLIENTS->value,
                Permissions::MANAGE_SUPPORT->value,
                Permissions::GENERATE_REPORTS->value,
                Permissions::SCHEDULE_REPORTS->value,
                Permissions::EXPORT_DATA->value,
                Permissions::VIEW_BILLING->value,
            ],

            Roles::VIEWER->value => [
                Permissions::VIEW_DASHBOARD->value,
                Permissions::VIEW_REPORTS->value,
                Permissions::VIEW_CLIENTS->value,
                Permissions::VIEW_BILLING->value,
            ],

            Roles::VISITOR->value => [
                Permissions::VIEW_DASHBOARD->value,
            ],
        ];

        // Vincula permissões às roles
        foreach ($rolePermissions as $role => $perms) {
            $roles[$role]
                ->permissions()
                ->sync(array_map(fn($perm) => $permissions[$perm]->id, $perms));
        }
    }
}
