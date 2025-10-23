<?php

declare(strict_types = 1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

final class ShowUserPermissionsController extends Controller
{
    public function __invoke(User $user): JsonResponse
    {
        Gate::authorize('managePermissions', $user);

        return response()->json([
            'user_id'     => $user->id,
            'user_name'   => $user->name,
            'permissions' => $user->getCustomPermissionsList(),
        ]);
    }
}
