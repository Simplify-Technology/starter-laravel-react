<?php

declare(strict_types = 1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class ShowUserPermissionsController extends Controller
{
    public function __invoke(Request $request, User $user): Response
    {
        Gate::authorize('managePermissions', $user);

        $user->load(['role.permissions', 'permissions']);

        $allPermissions = Permission::all()->map(fn($perm) => [
            'id'    => $perm->id,
            'name'  => $perm->name,
            'label' => $perm->label,
        ]);

        return Inertia::render('users/permissions', [
            'user'            => new UserResource($user),
            'all_permissions' => $allPermissions,
        ]);
    }
}
