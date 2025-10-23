<?php

declare(strict_types = 1);

namespace App\Services;

use App\Enum\Permissions;
use App\Models\User;

final class PermissionManagementService
{
    public function grantPermissionToUser(User $user, string $permissionName, bool $canImpersonateAny = false): void
    {
        $meta = [];

        if ($permissionName === Permissions::IMPERSONATE_USERS->value) {
            $meta['can_impersonate_any'] = $canImpersonateAny;
        }
        $user->givePermissionTo($permissionName, $meta);
    }

    public function revokePermissionFromUser(User $user, string $permissionName): void
    {
        $user->revokePermissionTo($permissionName);
    }
}
