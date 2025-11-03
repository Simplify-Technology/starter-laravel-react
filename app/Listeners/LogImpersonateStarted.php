<?php

declare(strict_types = 1);

namespace App\Listeners;

use App\Events\ImpersonateStarted;
use App\Models\User;
use OwenIt\Auditing\Models\Audit;

final class LogImpersonateStarted
{
    public function handle(ImpersonateStarted $event): void
    {
        Audit::create([
            'user_id'        => $event->impersonator->id,
            'event'          => 'impersonate_started',
            'auditable_id'   => $event->targetUser->id,
            'auditable_type' => User::class,
            'old_values'     => [],
            'new_values'     => [
                'impersonator_id'   => $event->impersonator->id,
                'impersonator_name' => $event->impersonator->name,
                'target_user_id'    => $event->targetUser->id,
                'target_user_name'  => $event->targetUser->name,
            ],
            'url'        => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'tags'       => 'impersonation,start',
        ]);
    }
}
