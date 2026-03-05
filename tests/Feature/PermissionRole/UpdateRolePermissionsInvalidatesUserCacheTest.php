<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

/*
 * Contract: `roles-permissions.update` expects `permissions` as an array of permission **names**.
 * These tests cover real-world updates (clear + swap to another non-empty set) and ensure only
 * users of the affected role have their per-user permission cache invalidated.
 */

test('updating a role permissions invalidates only affected users permission caches (clear + swap)', function() {
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

    expect($admin->hasPermissionTo('manage_roles'))->toBeTrue();
    expect(Cache::has("user:{$admin->id}:permissions"))->toBeTrue();

    $this->actingAs($admin)
        ->put(route('roles-permissions.update', [
            'role' => $role->name,
        ]), [
            'permissions' => [],
        ])
        ->assertRedirect();

    expect(Cache::has("user:{$user->id}:permissions"))->toBeFalse();
    expect(Cache::has("user:{$admin->id}:permissions"))->toBeTrue();

    $freshUser = User::query()->findOrFail($user->id);

    expect($freshUser->hasPermissionTo('manage_users'))->toBeFalse();
    expect(Cache::has("user:{$freshUser->id}:permissions"))->toBeTrue();

    $this->actingAs($admin)
        ->put(route('roles-permissions.update', [
            'role' => $role->name,
        ]), [
            'permissions' => [$manageRoles->name],
        ])
        ->assertRedirect();

    expect(Cache::has("user:{$freshUser->id}:permissions"))->toBeFalse();
    expect(Cache::has("user:{$admin->id}:permissions"))->toBeTrue();

    $updatedUser = User::query()->findOrFail($user->id);
    expect($updatedUser->hasPermissionTo('manage_users'))->toBeFalse();
    expect($updatedUser->hasPermissionTo('manage_roles'))->toBeTrue();
    expect(Cache::has("user:{$updatedUser->id}:permissions"))->toBeTrue();
});

test('invalid permissions payload does not change role permissions or invalidate caches', function() {
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

    expect($admin->hasPermissionTo('manage_roles'))->toBeTrue();
    expect(Cache::has("user:{$admin->id}:permissions"))->toBeTrue();

    $this->actingAs($admin)
        ->put(route('roles-permissions.update', [
            'role' => $role->name,
        ]), [
            'permissions' => [$manageRoles->id],
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['permissions.0']);

    expect(Cache::has("user:{$user->id}:permissions"))->toBeTrue();
    expect(Cache::has("user:{$admin->id}:permissions"))->toBeTrue();

    $role->refresh();
    expect($role->permissions()->pluck('name')->toArray())->toBe(['manage_users']);
});
