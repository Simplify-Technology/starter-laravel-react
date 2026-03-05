<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

test('updating a role permissions invalidates per-user permission caches', function() {
    Cache::flush();

    $manageUsers = Permission::create([
        'name'  => 'manage_users',
        'label' => 'Manage Users',
    ]);

    $manageRoles = Permission::create([
        'name'  => 'manage_roles',
        'label' => 'Manage Roles',
    ]);

    $role = Role::create([
        'name'     => 'finance_manager',
        'label'    => 'Finance Manager',
        'priority' => 10,
    ]);

    $role->permissions()->attach($manageUsers->id);

    $adminRole = Role::create([
        'name'     => 'admin_for_test',
        'label'    => 'Admin (Test)',
        'priority' => 99,
    ]);

    $adminRole->permissions()->attach($manageRoles->id);

    $user = User::factory()->create([
        'role_id'   => $role->id,
        'is_active' => true,
    ]);

    $admin = User::factory()->create([
        'role_id'   => $adminRole->id,
        'is_active' => true,
    ]);

    expect($user->hasPermissionTo('manage_users'))->toBeTrue();
    expect(Cache::has("user:{$user->id}:permissions"))->toBeTrue();

    $this->actingAs($admin)
        ->put(route('roles-permissions.update', [
            'role' => $role->name,
        ]), [
            'permissions' => [],
        ])
        ->assertRedirect();

    expect(Cache::has("user:{$user->id}:permissions"))->toBeFalse();

    $freshUser = User::query()->findOrFail($user->id);

    expect($freshUser->hasPermissionTo('manage_users'))->toBeFalse();
});
