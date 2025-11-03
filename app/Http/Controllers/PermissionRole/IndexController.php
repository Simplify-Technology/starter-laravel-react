<?php

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Permission;
use App\Models\Role;

class IndexController extends Controller
{
    public function __invoke()
    {
        $this->authorize('manage_roles');
        $roles = Role::with(['permissions', 'users'])->get()->mapWithKeys(function($role) {
            return [

                $role->name => [
                    'id'          => $role->id,
                    'label'       => $role->label ?? $role->name,
                    'permissions' => $role->permissions->pluck('label', 'name'),
                    'users'       => UserResource::collection($role->users->keyBy->id),
                ],
            ];
        });

        return inertia('permission-role/roles', [
            'roles'       => $roles,
            'permissions' => Permission::all(),
        ]);
    }
}
