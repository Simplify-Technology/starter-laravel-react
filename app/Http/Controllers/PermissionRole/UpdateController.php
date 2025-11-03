<?php

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UpdateController extends Controller
{
    public function __invoke(Request $request, $roleName)
    {
        $this->authorize('manage_roles');
        $role = Role::where('name', $roleName)->firstOrFail();

        $role->permissions()->sync(Permission::getIdsFromNames($request->permissions));

        Cache::forget("role:$role->id:permissions");
        Cache::rememberForever("role:$role->id:permissions", fn() => $role->permissions()->pluck('name')->toArray());

        return redirect()->back()->with('success', "Permissões de {$role->label} atualizadas com sucesso!");
    }
}
