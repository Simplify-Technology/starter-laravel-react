<?php

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;

class IndexController extends Controller
{
    public function __invoke()
    {
        $roles = Role::with('permissions')->get()->mapWithKeys(function($role) {
            return [
                $role->name => [
                    'label'       => $role->label ?? $role->name,
                    'permissions' => $role->permissions->pluck('label', 'name'),
                ],
            ];
        });

        return inertia('permission-role/roles', [
            'roles'       => $roles,
            'permissions' => Permission::all(),
        ]);
    }
}
