<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

uses(RefreshDatabase::class);

test('getAllPermissions includes direct user permissions even when user has no role', function() {
    Cache::flush();

    $userWithoutRole = User::factory()->create([
        'role_id'   => null,
        'is_active' => true,
    ]);

    $userWithoutRole->givePermissionTo('manage_users');

    expect($userWithoutRole->role)->toBeNull();
    expect($userWithoutRole->getAllPermissions()->pluck('name')->toArray())
        ->toContain('manage_users');
    expect($userWithoutRole->hasPermissionTo('manage_users'))->toBeTrue();
});

test('getAllPermissions is empty when user has no role and no direct permissions', function() {
    Cache::flush();

    $userWithoutRole = User::factory()->create([
        'role_id'   => null,
        'is_active' => true,
    ]);

    expect($userWithoutRole->role)->toBeNull();
    expect($userWithoutRole->getAllPermissions())->toHaveCount(0);
    expect($userWithoutRole->hasPermissionTo('manage_users'))->toBeFalse();
});
