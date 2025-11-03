<?php

declare(strict_types = 1);

namespace Tests\Feature;

use App\Enum\Roles;
use App\Events\ImpersonateStarted;
use App\Events\ImpersonateStopped;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\PermissionRoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

final class ImpersonateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PermissionRoleSeeder::class);
    }

    public function test_super_user_can_impersonate_any_user(): void
    {
        $superUser = User::factory()->create([
            'role_id' => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id
        ]);
        $targetUser = User::factory()->create(['is_active' => true]);

        $this->actingAs($superUser)
            ->post(route('users.impersonate', $targetUser->id))
            ->assertRedirect(route('dashboard'));

        $this->assertEquals($targetUser->id, Auth::user()?->id);
    }

    public function test_user_with_can_impersonate_any_meta_can_impersonate_anyone(): void
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->givePermissionTo('impersonate_users', ['can_impersonate_any' => true]);

        $targetSuperUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);

        $this->actingAs($user)
            ->post(route('users.impersonate', $targetSuperUser))
            ->assertRedirect(route('dashboard'));
    }

    public function test_user_cannot_impersonate_himself(): void
    {
        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);

        $this->actingAs($superUser)
            ->post(route('users.impersonate', $superUser))
            ->assertStatus(403);
    }

    public function test_user_cannot_impersonate_inactive_user(): void
    {
        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $inactiveUser = User::factory()->create(['is_active' => false]);

        $this->actingAs($superUser)
            ->post(route('users.impersonate', $inactiveUser))
            ->assertStatus(403);
    }

    public function test_user_without_impersonate_permission_cannot_impersonate(): void
    {
        $user = User::factory()->create([
            'role_id'   => Role::where('name', Roles::VISITOR->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $targetUser = User::factory()->create(['is_active' => true]);

        $this->actingAs($user)
            ->post(route('users.impersonate', $targetUser))
            ->assertStatus(403);
    }

    public function test_user_can_only_impersonate_lower_priority_roles(): void
    {
        $adminUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::ADMIN->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $adminUser->givePermissionTo('impersonate_users', ['can_impersonate_any' => false]);

        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);

        $this->actingAs($adminUser)
            ->post(route('users.impersonate', $superUser))
            ->assertStatus(403);
    }

    public function test_impersonation_events_are_fired(): void
    {
        Event::fake([ImpersonateStarted::class, ImpersonateStopped::class]);

        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $targetUser = User::factory()->create(['is_active' => true]);

        $this->actingAs($superUser)
            ->post(route('users.impersonate', $targetUser));

        Event::assertDispatched(ImpersonateStarted::class);

        $this->delete(route('users.impersonate.stop'));

        Event::assertDispatched(ImpersonateStopped::class);
    }

    public function test_cannot_start_impersonation_when_already_impersonating(): void
    {
        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $targetUser1 = User::factory()->create(['is_active' => true]);
        $targetUser2 = User::factory()->create(['is_active' => true]);

        // Start impersonation
        $this->actingAs($superUser)
            ->post(route('users.impersonate', $targetUser1))
            ->assertRedirect(route('dashboard'));

        // Try to impersonate another user while already impersonating
        $this->post(route('users.impersonate', $targetUser2))
            ->assertStatus(403);
    }

    public function test_can_stop_impersonation(): void
    {
        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $targetUser = User::factory()->create(['is_active' => true]);

        // Start impersonation
        $this->actingAs($superUser)
            ->post(route('users.impersonate', $targetUser));

        $this->assertEquals($targetUser->id, Auth::user()?->id);

        // Stop impersonation
        $this->delete(route('users.impersonate.stop'))
            ->assertRedirect(route('users.index'));

        $this->assertEquals($superUser->id, Auth::id());
    }

    public function test_cannot_stop_impersonation_when_not_impersonating(): void
    {
        $user = User::factory()->create(['is_active' => true]);

        $this->actingAs($user)
            ->delete(route('users.impersonate.stop'))
            ->assertStatus(403);
    }

    public function test_impersonation_is_logged_in_audits(): void
    {
        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $targetUser = User::factory()->create(['is_active' => true]);

        $this->actingAs($superUser)
            ->post(route('users.impersonate', $targetUser));

        $this->assertDatabaseHas('audits', [
            'user_id'        => $superUser->id,
            'event'          => 'impersonate_started',
            'auditable_id'   => $targetUser->id,
            'auditable_type' => User::class,
        ]);

        $this->delete(route('users.impersonate.stop'));

        $this->assertDatabaseHas('audits', [
            'user_id'        => $superUser->id,
            'event'          => 'impersonate_stopped',
            'auditable_id'   => $targetUser->id,
            'auditable_type' => User::class,
        ]);
    }
}
