<?php

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SyncPermissionsController extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => ['required', 'exists:permissions,name'],
        ]);

        $authUser = auth()->user();

        if (!$authUser->hasPermissionTo('manage_users')) {
            return redirect()->back()->withErrors(['error' => 'Acesso negado!']);
        }

        $permissionIds = Permission::getIdsFromNames($request->permissions ?? []);

        $user->permissions()->sync($permissionIds);

        Cache::forget("user:$user->id:permissions");

        return redirect()
            ->back()
            ->with('success', 'Permissões diretas atualizadas com sucesso!');
    }
}
