<?php

declare(strict_types = 1);

namespace App\Models;

use App\Enum\Roles as RolesEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = ['name', 'label', 'priority'];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    public function users(): hasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the priority of this role.
     * Uses database value if available, otherwise falls back to Enum.
     */
    public function getPriority(): int
    {
        if ($this->priority !== null) {
            return (int) $this->priority;
        }

        // Fallback to Enum priority
        try {
            $roleEnum = RolesEnum::from($this->name);

            return $roleEnum->priority();
        } catch (\ValueError) {
            return 0;
        }
    }

    /**
     * Check if this role is SUPER_USER.
     */
    public function isSuperUser(): bool
    {
        return $this->name === RolesEnum::SUPER_USER->value;
    }
}
