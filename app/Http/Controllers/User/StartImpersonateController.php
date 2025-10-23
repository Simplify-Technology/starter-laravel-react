<?php

declare(strict_types = 1);

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ImpersonationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

final class StartImpersonateController extends Controller
{
    public function __construct(
        private readonly ImpersonationService $impersonationService
    ) {
    }

    public function __invoke(Request $request, User $targetUser): RedirectResponse
    {
        $user = $request->user();

        // Manual user lookup since model binding is not working in tests
        $targetUser = User::findOrFail($request->route('user'));

        Gate::authorize('impersonate', $targetUser);

        $this->impersonationService->start(
            impersonator: $user,
            targetUser: $targetUser
        );

        return redirect()
            ->route('dashboard')
            ->with('success', "Você está impersonando {$targetUser->name}");
    }
}
