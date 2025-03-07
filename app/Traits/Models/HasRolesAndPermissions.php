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
            $role = $role->name;
        }

        $roles = Cache::rememberForever(
            $this->getRoleCacheKey(),
            fn() => $this->roles->pluck('name')->toArray()
        );

        return in_array($role, $roles);
    }

    private function getRoleCacheKey(): string
    {
        return "user:$this->id:roles";
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
        return $this->roles->loadMissing('permissions')->pluck('permissions')->flatten()->merge($this->permissions)->unique('id');
    }

    public function assignRole(string $role): void
    {
        $role = Role::where('name', $role)->firstOrFail();
        $this->roles()->syncWithoutDetaching([$role->id]);
        $this->refreshRolesAndPermissionsCache();
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    private function refreshRolesAndPermissionsCache(): void
    {
        Cache::forget($this->getRoleCacheKey());
        Cache::rememberForever($this->getRoleCacheKey(), fn() => $this->roles->pluck('name')->toArray());

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

    public function revokeRole(string $role): void
    {
        $role = Role::where('name', $role)->first();

        if ($role) {
            $this->roles()->detach($role->id);
            $this->refreshRolesAndPermissionsCache();
        }
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
}
