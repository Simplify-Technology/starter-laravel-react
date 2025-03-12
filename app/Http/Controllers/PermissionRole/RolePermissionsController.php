<?php

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\Role;

class RolePermissionsController extends Controller
{
    public function __invoke($role)
    {
        $roles = Role::with('permissions')->get()->mapWithKeys(function($role) {
            return [
                $role->name => [
                    'label'       => $role->label ?? $role->name,
                    'permissions' => $role->permissions->pluck('label', 'name'),
                ],
            ];
        });

        $role = Role::where('name', $role)
            ->with('permissions')
            ->first();

        return inertia('permission-role/roles', [
            'roles' => $roles,
            'role'  => RoleResource::make($role)->toArray(request()),
        ]);
    }
}
