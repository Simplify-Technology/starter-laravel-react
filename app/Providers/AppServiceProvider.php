<?php

namespace App\Providers;

use App\Enum\Permissions;
use App\Enum\Roles;
use App\Events\ImpersonateStarted;
use App\Events\ImpersonateStopped;
use App\Listeners\LogImpersonateStarted;
use App\Listeners\LogImpersonateStopped;
use App\Models\User;
use App\Policies\UserPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Opcodes\LogViewer\Facades\LogViewer;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->setupLogViewer();
        $this->configModels();
        $this->configCommands();
        $this->configUrls();
        $this->configDate();
        $this->configGates();
        $this->configResources();
        $this->configEvents();

        $this->getComposer();
    }

    private function setupLogViewer(): void
    {
        LogViewer::auth(fn($request) => $request->user()?->hasRole(Roles::SUPER_USER));
    }

    private function configModels(): void
    {
        Model::shouldBeStrict();
    }

    private function configCommands(): void
    {
        // if (!app()->isProduction()) {
        //     Log::warning('Destructive database commands are enabled in development mode.');
        // }

        DB::prohibitDestructiveCommands(
            app()->isProduction()
        );
    }

    private function configUrls(): void
    {
        if (app()->isProduction()) {
            URL::forceHttps();
        }
    }

    private function configDate(): void
    {
        Date::use(CarbonImmutable::class);
    }

    private function configGates(): void
    {
        Gate::policy(User::class, UserPolicy::class);

        foreach (Permissions::cases() as $permission) {
            Gate::define(
                $permission->value,
                function($user) use ($permission) {
                    if (!$user) {
                        return false;
                    }
                    $hasPermission = $user->hasPermissionTo($permission->value);
                    Log::channel('daily')->info(
                        "[Gate Check] Permission: $permission->value | User ID: $user->id | Allowed: " . ($hasPermission ? 'YES' : 'NO'),
                        ['env' => app()->environment()]
                    );

                    return $hasPermission;
                }
            );
        }
    }

    private function configResources(): void
    {
        JsonResource::withoutWrapping();
    }

    private function configEvents(): void
    {
        Event::listen(ImpersonateStarted::class, LogImpersonateStarted::class);
        Event::listen(ImpersonateStopped::class, LogImpersonateStopped::class);
    }

    public function getComposer(): void
    {
        View::composer('*', function($view): void {
            if (Auth::check()) {
                $user = Auth::user()->load(['permissions', 'role']);
                $view->with('auth', [
                    'user'        => $user,
                    'role'        => $user->role?->name,
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ]);
            } else {
                $view->with('auth', ['user' => null, 'role' => null, 'permissions' => []]);
            }
        });
    }
}
