<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $fillable = ['name', 'label'];

    public static function getIdsFromNames(array $permissionNames): array
    {
        return self::whereIn('name', $permissionNames)->pluck('id')->toArray();
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

}
