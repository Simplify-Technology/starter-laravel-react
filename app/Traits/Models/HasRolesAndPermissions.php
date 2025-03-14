<?php

namespace App\Traits\Models;

use App\Enum\Permissions;
use App\Enum\Roles;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\Cache;

trait HasRolesAndPermissions
{
    public function hasRole(Roles|string $role): bool
    {
        if ($role instanceof Roles) {
            $role = $role->value;
        }

        return $this->role?->name === $role;
    }

    public function hasPermissionTo(Permissions|string $permission): bool
    {
        if ($permission instanceof Permissions) {
            $permission = $permission->value;
        }

        $permissions = Cache::rememberForever(
            $this->getPermissionCacheKey(),
            fn() => $this->getAllPermissions()->pluck('name')->toArray()
        );

        return in_array($permission, $permissions);
    }

    private function getPermissionCacheKey(): string
    {
        return "user:$this->id:permissions";
    }

    public function getAllPermissions()
    {
        return $this->role?->permissions->merge($this->permissions)->unique('id') ?? collect();
    }

    public function assignRole(Roles|string $role): void
    {
        $role = Role::where('name', $role)->firstOrFail();
        $this->update(['role_id' => $role->id]);

        $this->refreshPermissionsCache();
    }

    private function refreshPermissionsCache(): void
    {
        Cache::forget($this->getPermissionCacheKey());
        Cache::rememberForever(
            $this->getPermissionCacheKey(),
            fn() => $this->getAllPermissions()->pluck('name')->toArray()
        );
    }

    public function revokeRole(): void
    {
        $visitorRole = Role::where('name', Roles::VISITOR->value)->firstOrFail();
        $this->update(['role_id' => $visitorRole->id]);

        $this->refreshPermissionsCache();
    }

    public function givePermissionTo(string $permission): void
    {
        $permission = Permission::firstOrCreate(['name' => $permission]);
        $this->permissions()->syncWithoutDetaching([$permission->id]);

        $this->refreshPermissionsCache();
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    public function revokePermissionTo(string $permission): void
    {
        $permission = Permission::where('name', $permission)->first();

        if ($permission) {
            $this->permissions()->detach($permission->id);
            $this->refreshPermissionsCache();
        }
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
