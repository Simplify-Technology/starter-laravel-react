<?php

declare(strict_types = 1);

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

final class SyncPermissionsController extends Controller
{
    public function __invoke(Request $request, User $user): RedirectResponse
    {
        Gate::authorize('managePermissions', $user);

        $request->validate([
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => ['required', 'exists:permissions,name'],
        ]);

        $permissionIds = Permission::getIdsFromNames($request->permissions ?? []);

        // Sync permissions (preserva metadados existentes via syncWithPivotValues se necessário)
        $user->permissions()->sync($permissionIds);

        Cache::forget("user:$user->id:permissions");

        return redirect()
            ->back()
            ->with('success', 'Permissões individuais atualizadas com sucesso!');
    }
}
