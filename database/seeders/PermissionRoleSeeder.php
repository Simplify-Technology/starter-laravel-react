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
            Roles::ADMIN->value      => array_filter($allPermissions, fn($perm) => $perm !== Permissions::IMPERSONATE_USERS->value),
            Roles::OWNER->value      => [
                Permissions::MANAGE_USERS->value,
                Permissions::MANAGE_ROLES->value,
                Permissions::MANAGE_PERMISSIONS->value,
                Permissions::ASSIGN_ROLES->value,
            ],
            Roles::MANAGER->value => [
                Permissions::MANAGE_USERS->value,
                Permissions::ASSIGN_ROLES->value,
            ],
            Roles::EDITOR->value => [
                Permissions::MANAGE_USERS->value,
            ],
            Roles::VIEWER->value  => [],
            Roles::VISITOR->value => [],
        ];

        // Vincula permissões às roles
        foreach ($rolePermissions as $role => $perms) {
            $roles[$role]
                ->permissions()
                ->sync(array_map(fn($perm) => $permissions[$perm]->id, $perms));
        }
    }
}
