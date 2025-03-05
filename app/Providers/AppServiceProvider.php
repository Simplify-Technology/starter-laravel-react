<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
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
    }

    private function setupLogViewer(): void
    {
        LogViewer::auth(fn($request) => $request->user()?->is_admin);
    }

    private function configModels(): void
    {
        Model::shouldBeStrict();
    }

    private function configCommands(): void
    {
        DB::prohibitDestructiveCommands(
            app()->isProduction()
        );
    }

    private function configUrls(): void
    {
        URL::forceHttps();
    }

    private function configDate(): void
    {
        Date::use(CarbonImmutable::class);
    }

    private function configGates(): void
    {
        //        foreach (Can::cases() as $permission) {
        //            Gate::define(
        //                $permission->value,
        //                function ($user) use ($permission) {
        //                    $check = $user
        //                        ->permissions()
        //                        ->whereName($permission->value)
        //                        ->exists();
        //
        //                    Log::info('Checking permission: '.$permission->value,
        //                        ['user' => $user->id, 'check' => $check ? 'true' : 'false']);
        //
        //                    return $check;
        //                }
        //            );
        //        }
    }
}
