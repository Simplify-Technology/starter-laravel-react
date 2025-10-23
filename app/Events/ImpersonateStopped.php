<?php

declare(strict_types = 1);

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class ImpersonateStopped
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(
        public readonly User $originalUser,
        public readonly User $impersonatedUser,
    ) {
    }
}
