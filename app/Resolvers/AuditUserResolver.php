<?php

declare(strict_types = 1);

namespace App\Resolvers;

use App\Services\ImpersonationService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use OwenIt\Auditing\Contracts\UserResolver as UserResolverContract;

/**
 * Custom User Resolver for Audit logging that considers impersonation.
 *
 * During impersonation, returns the original (impersonator) user instead of the impersonated user
 * to ensure audit logs correctly record who actually performed the action.
 */
final class AuditUserResolver implements UserResolverContract
{
    /**
     * {@inheritdoc}
     *
     * Resolves the user for audit logging.
     * During impersonation, returns the original (impersonator) user instead of the impersonated user.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public static function resolve()
    {
        $service = app(ImpersonationService::class);

        // Se estiver impersonando, retorna o usuário original (impersonador)
        // Isso garante que o audit registre quem REALMENTE fez a ação
        $originalUser = $service->getOriginalUser();

        if ($originalUser !== null) {
            return $originalUser;
        }

        // Caso contrário, usa o comportamento padrão do UserResolver original
        $guards = Config::get('audit.user.guards', [
            Config::get('auth.defaults.guard'),
        ]);

        foreach ($guards as $guard) {
            try {
                $authenticated = Auth::guard($guard)->check();
            } catch (\Exception $exception) {
                continue;
            }

            if ($authenticated === true) {
                return Auth::guard($guard)->user();
            }
        }

        return null;
    }
}
