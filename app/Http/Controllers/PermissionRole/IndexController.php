<?php

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function __invoke(Request $request)
    {
        //        $roles = Role::with('permissions')->get();
        $roles = Role::with('permissions')->get()->mapWithKeys(function($role) {
            return [
                $role->name => [
                    'label'       => $role->label ?? $role->name,
                    'permissions' => $role->permissions->pluck('label', 'name')
                ]
            ];
        });

        return inertia('permission-role/roles', [
            'roles' => $roles,
        ]);
    }
}
