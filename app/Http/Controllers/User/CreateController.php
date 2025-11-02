<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreateController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('create', \App\Models\User::class);

        $roles = RoleResource::collection(Role::with(['permissions'])->get());

        return Inertia::render('users/create', [
            'roles' => $roles->toArray($request),
        ]);
    }
}
