<?php

declare(strict_types = 1);

namespace App\Policies;

use App\Enum\Roles;
use App\Models\User;

final class UserPolicy
{
    public function impersonate(User $user, User $targetUser): bool
    {
        return $user->canImpersonate($targetUser);
    }

    public function managePermissions(User $user): bool
    {
        return $user->hasRole(Roles::SUPER_USER);
    }

    public function viewDetails(User $user, User $targetUser): bool
    {
        return true;
    }
}
