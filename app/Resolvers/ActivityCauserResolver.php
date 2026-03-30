<?php

declare(strict_types = 1);

namespace App\Resolvers;

use App\Services\ImpersonationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Throwable;

final class ActivityCauserResolver
{
    public static function resolve(): ?Model
    {
        $originalUser = app(ImpersonationService::class)->getOriginalUser();

        if ($originalUser !== null) {
            return $originalUser;
        }

        $guards = array_values(array_unique(array_filter(
            config('activitylog.causer_guards', [config('auth.defaults.guard')]),
            static fn(mixed $guard): bool => is_string($guard) && $guard !== ''
        )));

        foreach ($guards as $guard) {
            try {
                $user = Auth::guard($guard)->user();
            } catch (Throwable) {
                continue;
            }

            if ($user instanceof Model) {
                return $user;
            }
        }

        return null;
    }
}
