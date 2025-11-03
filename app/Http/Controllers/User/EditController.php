<?php

declare(strict_types = 1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\RoleFilterService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class EditController extends Controller
{
    public function __construct(
        private readonly RoleFilterService $roleFilterService
    ) {
    }

    public function __invoke(Request $request, User $user): Response
    {
        $this->authorize('update', $user);

        $user->load(['role', 'permissions']);

        // Filtra roles disponíveis para atribuição baseado no usuário atual da sessão
        // Usa getAssignableRolesForCurrentSession() para fornecer UX realista durante impersonação
        $assignableRoles = $this->roleFilterService->getAssignableRolesForCurrentSession($request->user());

        return Inertia::render('users/edit', [
            'user'  => new UserResource($user),
            'roles' => RoleResource::toArrayCollection($assignableRoles, $request),
        ]);
    }
}
