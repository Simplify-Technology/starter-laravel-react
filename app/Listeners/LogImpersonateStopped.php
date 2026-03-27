<?php

declare(strict_types = 1);

namespace App\Listeners;

use App\Events\ImpersonateStopped;

final class LogImpersonateStopped
{
    public function handle(ImpersonateStopped $event): void
    {
        activity('security')
            ->performedOn($event->impersonatedUser)
            ->causedBy($event->originalUser)
            ->event('impersonate_stopped')
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
                        'id'   => $event->originalUser->id,
                        'name' => $event->originalUser->name,
                    ],
                    'target_user' => [
                        'id'   => $event->impersonatedUser->id,
                        'name' => $event->impersonatedUser->name,
                    ],
                ],
            ])
            ->log('impersonate_stopped');
    }
}
