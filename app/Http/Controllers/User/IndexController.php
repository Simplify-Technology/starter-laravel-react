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

final class IndexController extends Controller
{
    public function __construct(
        private readonly RoleFilterService $roleFilterService
    ) {
    }

    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $query = User::query()->with(['role', 'permissions']);

        // Busca por nome ou email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por role
        if ($request->filled('role_id')) {
            $roleId = is_numeric($request->role_id) ? (int) $request->role_id : null;

            if ($roleId) {
                $query->where('role_id', $roleId);
            }
        }

        // Filtro por status ativo
        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        // Ordenação
        $sortBy    = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortFields = ['name', 'email', 'created_at', 'updated_at'];

        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Paginação
        $perPage = $request->get('per_page', 15);
        $users   = $query->paginate($perPage)->withQueryString();

        // Para o filtro, usa roles visíveis baseado no usuário atual da sessão
        // Isso fornece UX realista durante impersonação
        $visibleRoles = $this->roleFilterService->getVisibleRolesForCurrentSession($request->user());

        // Usa roles visíveis para o filtro (pode incluir o próprio role do usuário)
        $roles = RoleResource::toArrayCollection($visibleRoles, $request);

        // Build filters array only with non-empty values
        $filters = [
            'sort_by'    => $sortBy,
            'sort_order' => $sortOrder,
        ];

        if ($request->filled('search')) {
            $filters['search'] = $request->search;
        }

        if ($request->filled('role_id') && is_numeric($request->role_id)) {
            $filters['role_id'] = (int) $request->role_id;
        }

        if ($request->filled('is_active')) {
            $isActive = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

            if ($isActive !== null) {
                $filters['is_active'] = $isActive;
            }
        }

        return Inertia::render('users/index', [
            'users'      => UserResource::collection($users->items())->toArray($request),
            'roles'      => $roles,
            'filters'    => $filters,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ]);
    }
}
