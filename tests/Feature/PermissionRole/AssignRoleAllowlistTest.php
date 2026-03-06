<?php

use App\Enum\Roles;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\PermissionRoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function() {
    $this->seed(PermissionRoleSeeder::class);
});

test('cannot assign a legacy role that exists in DB but is not in Roles enum allowlist', function() {
    $legacyRole = Role::create([
        'name'     => 'legacy_role_not_allowed',
        'label'    => 'Legacy (Not Allowed)',
        'priority' => 1,
    ]);

    $superUserRoleId = Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id;

    $superUser = User::factory()->create([
        'role_id'   => $superUserRoleId,
        'is_active' => true,
    ]);

    $targetUser = User::factory()->create([
        'role_id'   => null,
        'is_active' => true,
    ]);

    $this->actingAs($superUser)
        ->post(route('user.assign-role', $targetUser), [
            'role' => $legacyRole->name,
        ])
        ->assertSessionHasErrors(['role']);

    $targetUser->refresh();
    expect($targetUser->role_id)->toBeNull();
});

test('cannot create user with legacy role_id even if it exists in roles table', function() {
    $legacyRole = Role::create([
        'name'     => 'legacy_role_not_allowed',
        'label'    => 'Legacy (Not Allowed)',
        'priority' => 1,
    ]);

    $superUserRoleId = Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id;

    $superUser = User::factory()->create([
        'role_id'   => $superUserRoleId,
        'is_active' => true,
    ]);

    $this->actingAs($superUser)
        ->post(route('users.store'), [
            'name'                  => 'New User',
            'email'                 => 'new.user@example.com',
            'password'              => 'password',
            'password_confirmation' => 'password',
            'role_id'               => $legacyRole->id,
            'is_active'             => true,
        ])
        ->assertSessionHasErrors(['role_id']);

    $this->assertDatabaseMissing('users', [
        'email' => 'new.user@example.com',
    ]);
});

test('cannot update user with legacy role_id even if it exists in roles table', function() {
    $legacyRole = Role::create([
        'name'     => 'legacy_role_not_allowed',
        'label'    => 'Legacy (Not Allowed)',
        'priority' => 1,
    ]);

    $superUserRoleId = Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id;

    $superUser = User::factory()->create([
        'role_id'   => $superUserRoleId,
        'is_active' => true,
    ]);

    $visitorRoleId = Role::where('name', Roles::VISITOR->value)->firstOrFail()->id;

    $targetUser = User::factory()->create([
        'role_id'   => $visitorRoleId,
        'is_active' => true,
    ]);

    $this->actingAs($superUser)
        ->put(route('users.update', $targetUser), [
            'name'      => $targetUser->name,
            'email'     => $targetUser->email,
            'role_id'   => $legacyRole->id,
            'is_active' => true,
        ])
        ->assertSessionHasErrors(['role_id']);

    $targetUser->refresh();
    expect($targetUser->role_id)->toBe($visitorRoleId);
});
