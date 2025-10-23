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

        return [
            ...parent::share($request),
            'name'  => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth'  => [
                'user'          => $request->user(),
                'impersonating' => [
                    'active'           => $impersonationService->isImpersonating(),
                    'originalUserName' => $impersonationService->getOriginalUserName(),
                ],
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy())->toArray(),
                'location' => $request->url(),
            ]
        ];
    }
}
