<?php

declare(strict_types = 1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\User;
use App\Services\PermissionManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

final class RevokePermissionController extends Controller
{
    public function __construct(
        private readonly PermissionManagementService $permissionManagementService
    ) {
    }

    public function __invoke(User $user, Permission $permission): RedirectResponse
    {
        Gate::authorize('managePermissions', $user);

        $this->permissionManagementService->revokePermissionFromUser(
            user: $user,
            permissionName: $permission->name
        );

        return back()->with('success', 'Permissão revogada com sucesso.');
    }
}
