<?php

declare(strict_types = 1);

namespace App\Http\Controllers\PermissionRole;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Response;

final class IndividualPermissionsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('managePermissions', User::class);

        $users = UserResource::collection(
            User::with(['role', 'permissions'])
                ->where('is_active', true)
                ->get()
        );

        return inertia('permission-role/individual', [
            'users' => $users->toArray($request),
        ]);
    }
}
