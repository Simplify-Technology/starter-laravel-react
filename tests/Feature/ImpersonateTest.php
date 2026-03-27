<?php

declare(strict_types = 1);

namespace Tests\Feature;

use App\Enum\Roles;
use App\Events\ImpersonateStarted;
use App\Events\ImpersonateStopped;
use App\Models\Role;
use App\Models\User;
use App\Services\ImpersonationService;
use Database\Seeders\PermissionRoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Spatie\Activitylog\Models\Activity;
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

    public function test_impersonation_is_logged_in_activity_log_with_real_actor_context(): void
    {
        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $targetUser = User::factory()->create(['is_active' => true]);

        Activity::query()->delete();

        $this->actingAs($superUser)
            ->post(route('users.impersonate', $targetUser));

        $startedActivity = Activity::query()
            ->where('log_name', 'security')
            ->where('event', 'impersonate_started')
            ->where('subject_type', User::class)
            ->where('subject_id', $targetUser->id)
            ->first();

        $this->assertNotNull($startedActivity);
        $this->assertSame($superUser->id, $startedActivity->causer_id);
        $this->assertSame(User::class, $startedActivity->causer_type);
        $this->assertSame('impersonate_started', $startedActivity->description);
        $this->assertSame('impersonation', $startedActivity->getProperty('type'));
        $this->assertSame('security', $startedActivity->getProperty('scope'));
        $this->assertSame($superUser->id, $startedActivity->getProperty('impersonation.impersonator.id'));
        $this->assertSame($targetUser->id, $startedActivity->getProperty('impersonation.target_user.id'));
        $this->assertNotNull($startedActivity->getProperty('request.url'));

        $this->delete(route('users.impersonate.stop'));

        $stoppedActivity = Activity::query()
            ->where('log_name', 'security')
            ->where('event', 'impersonate_stopped')
            ->where('subject_type', User::class)
            ->where('subject_id', $targetUser->id)
            ->first();

        $this->assertNotNull($stoppedActivity);
        $this->assertSame($superUser->id, $stoppedActivity->causer_id);
        $this->assertSame(User::class, $stoppedActivity->causer_type);
        $this->assertSame('impersonate_stopped', $stoppedActivity->description);
        $this->assertSame($superUser->id, $stoppedActivity->getProperty('impersonation.impersonator.id'));
        $this->assertSame($targetUser->id, $stoppedActivity->getProperty('impersonation.target_user.id'));
        $this->assertNotNull($stoppedActivity->getProperty('request.url'));
    }

    public function test_forbidden_impersonation_does_not_create_activity_logs(): void
    {
        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);

        Activity::query()->delete();

        $this->actingAs($superUser)
            ->post(route('users.impersonate', $superUser))
            ->assertForbidden();

        $this->assertDatabaseCount('activity_log', 0);
    }

    public function test_user_changes_during_impersonation_are_attributed_to_original_user(): void
    {
        $superUser = User::factory()->create([
            'role_id'   => Role::where('name', Roles::SUPER_USER->value)->firstOrFail()->id,
            'is_active' => true
        ]);
        $targetUser = User::factory()->create([
            'is_active' => true,
            'name'      => 'Target User Before Update',
        ]);

        Activity::query()->delete();

        $this->actingAs($superUser);

        app(ImpersonationService::class)->start($superUser, $targetUser);

        Activity::query()->delete();

        $targetUser->update([
            'name' => 'Target User After Update',
        ]);

        $activity = Activity::query()
            ->where('log_name', 'users')
            ->where('event', 'updated')
            ->where('subject_type', User::class)
            ->where('subject_id', $targetUser->id)
            ->latest()
            ->first();

        $this->assertNotNull($activity);
        $this->assertSame($superUser->id, $activity->causer_id);
        $this->assertSame(User::class, $activity->causer_type);

        $changes = $activity->attribute_changes?->toArray();

        $this->assertIsArray($changes);
        $this->assertSame('Target User After Update', $changes['attributes']['name'] ?? null);
        $this->assertSame('Target User Before Update', $changes['old']['name'] ?? null);
    }
}
