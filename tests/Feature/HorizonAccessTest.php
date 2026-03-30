<?php

use App\Enum\Roles;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\PermissionRoleSeeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Gate;

beforeEach(function(): void {
    $this->seed(PermissionRoleSeeder::class);
});

it('allows super users to view Horizon in non-local environments', function(): void {
    $superUser = User::factory()->create([
        'role_id'   => roleId(Roles::SUPER_USER),
        'is_active' => true,
    ]);

    expect(Gate::forUser($superUser)->allows('viewHorizon'))->toBeTrue();
});

it('denies Horizon access to guests and non super users', function(): void {
    $adminUser = User::factory()->create([
        'role_id'   => roleId(Roles::ADMIN),
        'is_active' => true,
    ]);

    expect(Gate::allows('viewHorizon'))->toBeFalse()
        ->and(Gate::forUser($adminUser)->allows('viewHorizon'))->toBeFalse();
});

it('schedules Horizon snapshots every five minutes', function(): void {
    Artisan::call('schedule:list');

    $output = preg_replace('/\e\[[\d;]*m/', '', Artisan::output()) ?? '';

    expect($output)->toContain('*/5 * * * *')
        ->and($output)->toContain('horizon:snapshot');
});

function roleId(Roles $role): int
{
    return Role::where('name', $role->value)->firstOrFail()->id;
}
