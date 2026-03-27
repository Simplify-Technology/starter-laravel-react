<?php

declare(strict_types = 1);

namespace App\Listeners;

use App\Events\ImpersonateStarted;

final class LogImpersonateStarted
{
    public function handle(ImpersonateStarted $event): void
    {
        activity('security')
            ->performedOn($event->targetUser)
            ->causedBy($event->impersonator)
            ->event('impersonate_started')
            ->withProperties([
                'type'    => 'impersonation',
                'scope'   => 'security',
                'request' => [
                    'url'        => request()->fullUrl(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ],
                'impersonation' => [
                    'impersonator' => [
                        'id'   => $event->impersonator->id,
                        'name' => $event->impersonator->name,
                    ],
                    'target_user' => [
                        'id'   => $event->targetUser->id,
                        'name' => $event->targetUser->name,
                    ],
                ],
            ])
            ->log('impersonate_started');
    }
}
