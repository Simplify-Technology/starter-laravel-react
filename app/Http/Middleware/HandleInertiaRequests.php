<?php

namespace App\Http\Middleware;

use App\Services\ImpersonationService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $impersonationService = app(ImpersonationService::class);

        $isImpersonating = $impersonationService->isImpersonating();

        $user        = $request->user();
        $permissions = [];
        $roles       = [];

        if ($user) {
            $permissions = $user->getAllPermissions()->pluck('name')->toArray();
            $roles       = $user->role ? [$user->role->name] : [];
        }

        return [
            ...parent::share($request),
            'name'  => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth'  => [
                'user'          => $user,
                'permissions'   => $permissions,
                'roles'         => $roles,
                'impersonating' => [
                    'active'           => $isImpersonating,
                    'originalUserName' => $impersonationService->getOriginalUserName(),
                    // Nome do usuário que está sendo impersonado (usuário atual durante a impersonação)
                    'impersonatedUserName' => $isImpersonating && $user
                        ? $user->name
                        : null,
                ],
            ],
            'flash' => [
                'success' => $request->session()->pull('success'),
                'error'   => $request->session()->pull('error'),
                'warning' => $request->session()->pull('warning'),
                'info'    => $request->session()->pull('info'),
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy())->toArray(),
                'location' => $request->url(),
            ]
        ];
    }
}
