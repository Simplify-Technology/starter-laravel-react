<?php

declare(strict_types = 1);

namespace App\Listeners;

use App\Events\ImpersonateStopped;
use App\Models\User;
use OwenIt\Auditing\Models\Audit;

final class LogImpersonateStopped
{
    public function handle(ImpersonateStopped $event): void
    {
        Audit::create([
            'user_id'        => $event->originalUser->id,
            'event'          => 'impersonate_stopped',
            'auditable_id'   => $event->impersonatedUser->id,
            'auditable_type' => User::class,
            'old_values'     => [
                'impersonator_id'        => $event->originalUser->id,
                'impersonator_name'      => $event->originalUser->name,
                'impersonated_user_id'   => $event->impersonatedUser->id,
                'impersonated_user_name' => $event->impersonatedUser->name,
            ],
            'new_values' => [],
            'url'        => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'tags'       => 'impersonation,stop',
        ]);
    }
}
