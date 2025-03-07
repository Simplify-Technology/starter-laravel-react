<?php

namespace App\Providers;

use App\Enum\Permissions;
use App\Enum\Roles;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
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
        if (!app()->isProduction()) {
            Log::warning('Destructive database commands are enabled in development mode.');
        }

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

    public function getComposer(): void
    {
        View::composer('*', function($view) {
            if (Auth::check()) {
                $user = Auth::user()->load(['permissions', 'roles']);
                $view->with('auth', [
                    'user'        => $user,
                    'roles'       => $user->roles->pluck('name'),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ]);
            } else {
                $view->with('auth', ['user' => null, 'roles' => [], 'permissions' => []]);
            }
        });
    }
}
