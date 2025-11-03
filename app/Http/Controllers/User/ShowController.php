<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowController extends Controller
{
    public function __invoke(Request $request, User $user): Response
    {
        $this->authorize('view', $user);

        $user->load(['role', 'permissions']);

        $roles = RoleResource::collection(Role::with(['permissions'])->get());

        return Inertia::render('users/show', [
            'user'  => new UserResource($user),
            'roles' => $roles->toArray($request),
        ]);
    }
}
